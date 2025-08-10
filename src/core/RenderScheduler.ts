let renderCallback: (() => void) | null = null;

export function setRenderCallback(cb: () => void) {
  renderCallback = cb;
}

export function requestRender() {
  renderCallback?.();
}
