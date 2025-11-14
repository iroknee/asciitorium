class RenderScheduler {
  private static instance: RenderScheduler;
  private renderCallback: (() => void) | null = null;
  private renderPending = false;

  private constructor() {}

  public static getInstance(): RenderScheduler {
    if (!RenderScheduler.instance) {
      RenderScheduler.instance = new RenderScheduler();
    }
    return RenderScheduler.instance;
  }

  public setRenderCallback(cb: () => void) {
    this.renderCallback = cb;
  }

  public requestRender() {
    // If a render is already queued, don't queue another
    if (this.renderPending) return;

    this.renderPending = true;

    // Queue render as a microtask to batch multiple render requests
    // This ensures all synchronous state updates complete before rendering
    queueMicrotask(() => this.executeRender());
  }

  private executeRender() {
    this.renderPending = false;
    this.renderCallback?.();
  }
}

// Export convenience functions that use the singleton
const scheduler = RenderScheduler.getInstance();

export function setRenderCallback(cb: () => void) {
  scheduler.setRenderCallback(cb);
}

export function requestRender() {
  scheduler.requestRender();
}
