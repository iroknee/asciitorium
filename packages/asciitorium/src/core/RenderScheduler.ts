class RenderScheduler {
  private static instance: RenderScheduler;
  private renderCallback: (() => void) | null = null;

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
