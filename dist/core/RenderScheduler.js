let renderCallback = null;
export function setRenderCallback(cb) {
    renderCallback = cb;
}
export function requestRender() {
    renderCallback?.();
}
