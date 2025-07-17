import { Component } from '../components/Component';

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
    if (current) current.hasFocus = true;
  }

  private clearFocus() {
    const current = this.currentContext[this.index];
    if (current) current.hasFocus = false;
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

  reset(layoutRoot: Component) {
    const focusables = layoutRoot.getFocusableDescendants?.() ?? [];
    this.contextStack = [focusables];
    this.index = 0;
    this.setFocus(0);
  }
}