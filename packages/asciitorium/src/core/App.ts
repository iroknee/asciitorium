import { Component, ComponentProps } from './Component';
import { FocusManager } from './FocusManager';
import type { Renderer } from './renderers/Renderer';
import { DOMRenderer } from './renderers/DOMRenderer';
import { TTYRenderer } from './renderers/TTYRenderer';
import { setRenderCallback } from './RenderScheduler';
import { setupKeyboardHandling, validateWebEnvironment } from './environment';
import { createSizeContext } from './utils/sizeUtils';

export interface AppProps extends ComponentProps {
  // App-specific props can be added here
  font?: string;
}

export class App extends Component {
  readonly isApp = true; // Reliable identifier for App class
  readonly focus: FocusManager;
  private readonly renderer: Renderer;
  private fpsCounter: number = 0;
  private totalRenderTime: number = 0;
  private currentFPS: number = 0;
  private currentCPU: number = 0;
  private currentMemory: number = 0;
  private lastCPUUsage?: any;
  private keybindRegistry = new Map<string, any>();

  constructor(props: AppProps) {
    // Extract font from props or style object
    const fontFromStyle = props.style?.font;
    const selectedFont = props.font ?? fontFromStyle;

    // Initialize renderer first to get screen size
    const renderer = getDefaultRenderer(selectedFont);
    const screenSize = renderer.getScreenSize();

    // Extract dimensions from style object if present
    const widthFromStyle = props.style?.width;
    const heightFromStyle = props.style?.height;
    const layoutFromStyle = props.style?.layout;

    // Set column layout as default for Asciitorium
    // Use screen size if width/height not explicitly provided
    const asciitoriumProps = {
      ...props,
      width: props.width ?? widthFromStyle ?? screenSize.width,
      height: props.height ?? heightFromStyle ?? screenSize.height,
      layout: props.layout ?? layoutFromStyle ?? 'column',
      layoutOptions: props.layoutOptions ?? {},
    };

    super(asciitoriumProps);

    this.renderer = renderer;
    this.focus = new FocusManager();

    // Setup resize handling
    this.setupResizeHandling();

    this.focus.reset(this);

    // Subscribe to hotkey visibility changes to trigger re-renders
    this.focus.hotkeyVisibilityState.subscribe(() => {
      this.render();
    });

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
      // Skip rendering invisible components
      if (!component.visible) continue;

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


  // Add keybind registration methods
  registerKeybind(keybind: any) {
    this.keybindRegistry.set(keybind.keyBinding, keybind);
  }

  unregisterKeybind(keybind: any) {
    this.keybindRegistry.delete(keybind.keyBinding);
  }

  handleKey(key: string, event?: KeyboardEvent): void {
    // Check for app-level keybinds first
    const keybind = this.keybindRegistry.get(key);
    if (keybind && !keybind.disabled) {
      // Execute if global or no component has focus
      if (keybind.global || !this.hasComponentWithFocus()) {
        keybind.action();
        this.render();
        event?.preventDefault();
        return;
      }
    }

    // Continue with existing focus manager delegation
    if (this.focus.handleKey(key)) {
      this.render();
      event?.preventDefault();
    }
  }

  private hasComponentWithFocus(): boolean {
    // Check if any component currently has focus
    return this.getAllDescendants().some(c => c.hasFocus);
  }

  private setupResizeHandling(): void {
    const handleResize = () => {
      const newSize = this.renderer.getScreenSize();
      if (newSize.width !== this.width || newSize.height !== this.height) {
        this.width = newSize.width;
        this.height = newSize.height;
        this.render();
      }
    };

    // Web environment resize handling
    if (typeof window !== 'undefined') {
      window.addEventListener('resize', handleResize);
    }

    // Terminal environment resize handling (SIGWINCH signal)
    if (typeof process !== 'undefined' && process.on) {
      process.on('SIGWINCH', handleResize);
    }
  }

  getScreenSize(): { width: number; height: number } {
    return this.renderer.getScreenSize();
  }

  async start(): Promise<void> {
    validateWebEnvironment();
    await setupKeyboardHandling((key, event) => this.handleKey(key, event));
    setRenderCallback(() => this.render());
    // Trigger initial render to ensure all components are displayed
    this.render();
  }

  private resolveSizesRecursively(): void {
    // Create size context for the app (root component)
    const sizeContext = createSizeContext(this.width, this.height, 0);

    // Resolve sizes for all components in the tree
    const allComponents = this.getAllDescendants().concat([this]);
    for (const component of allComponents) {
      // Create appropriate size context based on parent
      let componentContext = sizeContext;
      if (component.parent) {
        const borderPad = component.parent.border ? 1 : 0;
        componentContext = createSizeContext(
          component.parent.width,
          component.parent.height,
          borderPad
        );
      }
      component.resolveSize(componentContext);
    }
  }
}

function getDefaultRenderer(font?: string): Renderer {
  if (typeof window !== 'undefined' && typeof document !== 'undefined') {
    const screen = document.getElementById('screen');
    if (!screen) throw new Error('No #screen element found for DOM rendering');
    return new DOMRenderer(screen, font);
  } else {
    return new TTYRenderer();
  }
}
