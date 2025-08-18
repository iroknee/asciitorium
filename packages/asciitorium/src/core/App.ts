import { Component, ComponentProps } from './Component';
import { FocusManager } from './FocusManager';
import type { Renderer } from './renderers/Renderer';
import { DomRenderer } from './renderers/DomRenderer';
import { TerminalRenderer } from './renderers/TerminalRenderer';
import { setRenderCallback } from './RenderScheduler';
import { setupKeyboardHandling, validateWebEnvironment } from './utils';

export interface AppProps extends ComponentProps {
  fit?: boolean;
}

export class App extends Component {
  readonly focus: FocusManager;
  private readonly renderer: Renderer;
  private fpsCounter: number = 0;
  private totalRenderTime: number = 0;
  private currentFPS: number = 0;
  private currentCPU: number = 0;
  private currentMemory: number = 0;
  private lastCPUUsage?: any;

  constructor(props: AppProps) {
    // Set vertical layout as default for Asciitorium, pass through fit option
    const asciitoriumProps = {
      ...props,
      layout: props.layout ?? 'vertical',
      layoutOptions: { fit: props.fit, ...props.layoutOptions },
    };

    super(asciitoriumProps);

    this.renderer = getDefaultRenderer();
    this.focus = new FocusManager();

    this.focus.reset(this);
    this.render();

    // Initialize performance monitoring
    this.updatePerformanceMetrics();

    // Start FPS and render time reporting
    setInterval(() => {
      this.currentFPS = this.fpsCounter;
      this.fpsCounter = 0;
      this.totalRenderTime = 0;
      this.updatePerformanceMetrics();
    }, 1000);
  }

  render(): void {
    const start =
      typeof performance !== 'undefined' && performance.now
        ? performance.now()
        : Date.now();
    this.fpsCounter++;
    const screenBuffer = Array.from({ length: this.height }, () =>
      Array.from({ length: this.width }, () => ' ')
    );

    // Flatten and sort components by z-index
    const allComponents = this.getAllDescendants().concat([this]);
    allComponents.sort((a, b) => (a.z ?? 0) - (b.z ?? 0));

    for (const component of allComponents) {
      const buffer = component.draw();
      const x = component.x;
      const y = component.y;
      const transparentChar = component.transparentChar;

      for (let row = 0; row < buffer.length; row++) {
        const globalY = y + row;
        if (globalY < 0 || globalY >= this.height) continue;

        for (let col = 0; col < buffer[row].length; col++) {
          const globalX = x + col;
          if (globalX < 0 || globalX >= this.width) continue;

          const char = buffer[row][col];
          if (char !== transparentChar) {
            screenBuffer[globalY][globalX] = char;
          }
        }
      }
    }

    this.renderer.render(screenBuffer);
    const end =
      typeof performance !== 'undefined' && performance.now
        ? performance.now()
        : Date.now();
    this.totalRenderTime += end - start;
  }

  addChild(component: Component): void {
    super.addChild(component);
    this.focus?.reset(this); // avoid crashing
    this.render();
  }

  removeChild(component: Component): void {
    super.removeChild(component);
    this.focus.reset(this);
    this.render();
  }

  getFPS(): number {
    return this.currentFPS;
  }

  getRenderTime(): number {
    return this.totalRenderTime;
  }

  getCPUUsage(): number {
    return this.currentCPU;
  }

  getMemoryUsage(): number {
    return this.currentMemory;
  }

  private updatePerformanceMetrics(): void {
    // CPU and Memory monitoring - cross-platform
    if (
      typeof process !== 'undefined' &&
      process.cpuUsage &&
      process.memoryUsage
    ) {
      // Node.js environment (CLI)
      try {
        const currentUsage = process.cpuUsage(this.lastCPUUsage);
        const totalUsage = currentUsage.user + currentUsage.system;
        // Convert microseconds to percentage (approximate)
        this.currentCPU = Math.min(100, totalUsage / 10000); // Rough estimation
        this.lastCPUUsage = process.cpuUsage();

        const memUsage = process.memoryUsage();
        this.currentMemory = memUsage.heapUsed / (1024 * 1024); // Convert to MB
      } catch (e) {
        this.currentCPU = 0;
        this.currentMemory = 0;
      }
    } else if (
      typeof performance !== 'undefined' &&
      (performance as any).memory
    ) {
      // Browser environment with memory API
      try {
        const memInfo = (performance as any).memory;
        this.currentMemory = memInfo.usedJSHeapSize / (1024 * 1024); // Convert to MB
        // No direct CPU access in browser, estimate from render performance
        this.currentCPU = Math.min(100, Math.max(0, this.totalRenderTime * 6)); // Rough estimation
      } catch (e) {
        this.currentCPU = 0;
        this.currentMemory = 0;
      }
    } else {
      // Fallback - no metrics available
      this.currentCPU = 0;
      this.currentMemory = 0;
    }
  }

  handleKey(key: string): void {
    if (key === 'Tab') {
      this.focus.focusNext();
      this.render();
      event?.preventDefault();
      return;
    }

    if (key === 'Shift') {
      this.focus.focusPrevious();
      this.render();
      event?.preventDefault();
      return;
    }

    if (this.focus.handleKey(key)) {
      this.render();
    }
  }

  async start(): Promise<void> {
    validateWebEnvironment();
    await setupKeyboardHandling((key) => this.handleKey(key));
    setRenderCallback(() => this.render());
  }
}

function getDefaultRenderer(): Renderer {
  if (typeof window !== 'undefined' && typeof document !== 'undefined') {
    const screen = document.getElementById('screen');
    if (!screen) throw new Error('No #screen element found for DOM rendering');
    return new DomRenderer(screen);
  } else {
    return new TerminalRenderer();
  }
}
