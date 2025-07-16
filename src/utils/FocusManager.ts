import { Component } from '../components/Component';

export class FocusManager {
  private components: Component[] = [];
  private index = 0;

  register(component: Component) {
    if (!component.focusable) return;
    this.components.push(component);
    if (this.components.length === 1) {
      component.hasFocus = true;
    }
  }

  unregister(component: Component) {
    const idx = this.components.indexOf(component);
    if (idx >= 0) {
      if (this.index === idx) {
        this.components[this.index].hasFocus = false;
        this.index = 0;
      }
      this.components.splice(idx, 1);
    }
  }

  focusNext() {
    if (this.components.length === 0) return;
    this.components[this.index].hasFocus = false;
    this.index = (this.index + 1) % this.components.length;
    this.components[this.index].hasFocus = true;
  }

  handleKey(key: string): boolean {
    const current = this.components[this.index];
    const handled = current.handleEvent?.(key);
    return handled ?? false;
  }
}