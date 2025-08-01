import { Component } from './Component';
import App from './App';

export class FocusManager {
  private contextStack: Component[][] = [];
  private index = 0;

  pushContext(components: Component[]) {
    this.clearFocus();
    this.contextStack.push(components);
    this.index = 0;
    this.setFocus(0);
  }

  popContext() {
    this.clearFocus();
    this.contextStack.pop();
    this.index = 0;
    this.setFocus(0);
  }

  private get currentContext(): Component[] {
    return this.contextStack[this.contextStack.length - 1] || [];
  }

  private setFocus(index: number) {
    this.index = index;
    const current = this.currentContext[this.index];
    if (current) {
      current.hasFocus = true;
      current.dirty = true;
    }
  }

  private clearFocus() {
    const current = this.currentContext[this.index];
    if (current) {
      current.hasFocus = false;
      current.dirty = true;
    }
  }

  focusNext() {
    if (this.currentContext.length === 0) return;
    this.clearFocus();
    this.index = (this.index + 1) % this.currentContext.length;
    this.setFocus(this.index);
  }

  handleKey(key: string): boolean {
    const current = this.currentContext[this.index];
    const handled = current?.handleEvent?.(key);
    return handled ?? false;
  }

  reset(layoutRoot: App) {
    this.contextStack = [this.getFocusableDescendants(layoutRoot)];
    this.index = 0;
    this.setFocus(0);
  }

  getFocusableDescendants(layoutRoot: App): Component[] {
    const focusables: Component[] = [];
    for (const child of layoutRoot.getChildren()) {
      if (child.focusable) focusables.push(child);
      // Recursively check if the child is a Container
      if (child instanceof App) {
        focusables.push(...this.getFocusableDescendants(child));
      }
    }
    return focusables;
  }
}
