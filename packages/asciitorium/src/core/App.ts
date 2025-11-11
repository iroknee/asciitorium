import { Component, ComponentProps } from './Component.js';
import { FocusManager } from './FocusManager.js';
import type { Renderer } from './renderers/Renderer.js';
import { DOMRenderer } from './renderers/DOMRenderer.js';
import { TTYRenderer } from './renderers/TTYRenderer.js';
import { setRenderCallback } from './RenderScheduler.js';
import {
  setupKeyboardHandling,
  validateWebEnvironment,
} from './environment.js';
import { createSizeContext } from './utils/sizeUtils.js';

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
  private mobileControllerRegistry: any[] = [];
  private readonly fixedWidth: boolean;
  private readonly fixedHeight: boolean;

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

    // Determine if dimensions are fixed (numeric values were explicitly provided)
    const hasFixedWidth = typeof (props.width ?? widthFromStyle) === 'number';
    const hasFixedHeight =
      typeof (props.height ?? heightFromStyle) === 'number';

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
    this.fixedWidth = hasFixedWidth;
    this.fixedHeight = hasFixedHeight;

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
    if (this.keybindRegistry.has(keybind.keyBinding)) {
      console.warn(
        `Warning: Duplicate keybinding for "${keybind.keyBinding}". The previous binding will be overwritten.`
      );
    }
    this.keybindRegistry.set(keybind.keyBinding, keybind);
  }

  unregisterKeybind(keybind: any) {
    this.keybindRegistry.delete(keybind.keyBinding);
  }

  // Add mobile controller registration methods
  registerMobileController(controller: any) {
    this.mobileControllerRegistry.push(controller);
  }

  unregisterMobileController(controller: any) {
    const index = this.mobileControllerRegistry.indexOf(controller);
    if (index !== -1) {
      this.mobileControllerRegistry.splice(index, 1);
    }
  }

  // Handle mobile button press
  handleMobileButton(buttonId: string): void {
    // Find all enabled controllers in the component tree, sorted by priority (highest first)
    const activeControllers = this.mobileControllerRegistry
      .filter((c) => !c.disabled && this.isComponentInTree(c))
      .sort((a, b) => b.priority - a.priority);

    // Execute first controller that handles this button
    for (const controller of activeControllers) {
      if (controller.handleButton(buttonId)) {
        this.render();
        return;
      }
    }
  }

  handleKey(key: string, event?: KeyboardEvent): void {
    // Check if focused component is in capture mode
    const focusedComponent = this.getFocusedComponent();
    if (focusedComponent?.captureModeActive) {
      // Only bypass keys (Tab, Shift+Tab) escape capture mode
      if (!Component.BYPASS_KEYS.includes(key)) {
        // Send key directly to component, skip keybindings/hotkeys
        if (focusedComponent.handleEvent(key)) {
          this.render();
          event?.preventDefault();
        }
        return;
      }
    }

    // Check for app-level keybinds first
    const keybind = this.keybindRegistry.get(key);
    if (keybind && !keybind.disabled && this.isKeybindActive(keybind)) {
      keybind.action();
      this.render();
      event?.preventDefault();
      return;
    }

    // Continue with existing focus manager delegation
    if (this.focus.handleKey(key)) {
      this.render();
      event?.preventDefault();
    }
  }

  private getFocusedComponent(): Component | undefined {
    return this.getAllDescendants().find((c) => c.hasFocus);
  }

  private isKeybindActive(keybind: any): boolean {
    // Keybind is active if it's in the component tree and visible
    return this.isComponentInTree(keybind);
  }

  private isComponentInTree(component: Component): boolean {
    // Check if component is in the tree by walking up to find this App
    let current: Component | undefined = component;
    while (current) {
      if (current === this) return true;
      current = current.parent;
    }
    return false;
  }

  private hasComponentWithFocus(): boolean {
    // Check if any component currently has focus
    return this.getAllDescendants().some((c) => c.hasFocus);
  }

  private setupResizeHandling(): void {
    const handleResize = () => {
      const newSize = this.renderer.getScreenSize();
      let changed = false;

      // Only update width if it wasn't fixed
      if (!this.fixedWidth && newSize.width !== this.width) {
        this.width = newSize.width;
        changed = true;
      }

      // Only update height if it wasn't fixed
      if (!this.fixedHeight && newSize.height !== this.height) {
        this.height = newSize.height;
        changed = true;
      }

      if (changed) {
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
    await setupKeyboardHandling(
      (key, event) => this.handleKey(key, event),
      (buttonId) => this.handleMobileButton(buttonId)
    );
    setRenderCallback(() => this.render());
    // Trigger initial render to ensure all components are displayed
    this.render();
  }

  private resolveSizesRecursively(): void {
    // Recursively resolve sizes and layouts top-down
    // This ensures parents calculate their children's dimensions before those children draw
    console.log('=== PASS 1: Size Resolution Starting ===');
    this.resolveSizesForComponent(this);
    console.log('=== PASS 1: Size Resolution Complete ===');

    // Validate that all sizes are resolved
    this.validateSizesResolved();
  }

  private validateSizesResolved(): void {
    console.log('=== Validating All Sizes Are Resolved ===');
    const allComponents = this.getAllDescendants().concat([this]);
    let invalidCount = 0;

    for (const component of allComponents) {
      const name = component.constructor.name;
      const isInvalid =
        typeof component.width !== 'number' ||
        component.width < 1 ||
        typeof component.height !== 'number' ||
        component.height < 1;

      if (isInvalid && component.visible) {
        console.error(
          `❌ ${name} has invalid dimensions: ${component.width}x${component.height}, ` +
            `originalWidth=${(component as any).originalWidth}, ` +
            `originalHeight=${(component as any).originalHeight}, ` +
            `visible=${component.visible}`
        );
        invalidCount++;
      }
    }

    if (invalidCount === 0) {
      console.log('✅ All visible components have valid numeric dimensions');
    } else {
      console.error(
        `❌ ${invalidCount} visible components have invalid dimensions!`
      );
    }
  }

  private resolveSizesForComponent(component: Component): void {
    const name = component.constructor.name;
    const beforeWidth = component.width;
    const beforeHeight = component.height;

    // Step 1: Resolve this component's size based on parent context
    if (component.parent) {
      const borderPad = component.parent.border ? 1 : 0;
      const context = createSizeContext(
        component.parent.width,
        component.parent.height,
        borderPad
      );
      component.resolveSize(context);
    } else {
      // Root component (App) uses screen size
      const context = createSizeContext(this.width, this.height, 0);
      component.resolveSize(context);
    }


    // Step 2: Calculate layout ONLY for components with VISIBLE children
    // This will set the dimensions (width/height) of child components with "fill" sizing
    // Data-only children (Option, OptionGroup) have visible=false and are skipped
    // This prevents recursive layout calls on components like Select that have
    // data children but handle their own rendering
    const children = (component as any).children || [];
    const visibleChildren = children.filter((c: any) => c.visible);

    if (visibleChildren.length > 0) {
      const beforeLayoutHeight = component.height;
      (component as any).recalculateLayout();
    }

    // Step 3: Recursively resolve children
    // Now that parent has calculated their sizes via layout, children can proceed
    for (const child of children) {
      this.resolveSizesForComponent(child);
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
