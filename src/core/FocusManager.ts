import { Component } from './Component';
import { Layout } from './layouts/Layout';

export class FocusManager {
  private contextStack: Component[][] = [];
  private index = 0;

  pushContext(components: Component[]) {
    this.clearFocus();
    const focusables = components.filter((c) => c.focusable);
    this.contextStack.push(focusables);
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

  // TODO: this doesn't work, still goes forward
  focusPrevious() {
    if (this.currentContext.length === 0) return;
    this.clearFocus();
    this.index =
      (this.index - 1 + this.currentContext.length) %
      this.currentContext.length;
    this.setFocus(this.index);
  }

  handleKey(key: string): boolean {
    const current = this.currentContext[this.index];
    const handled = current?.handleEvent?.(key);
    return handled ?? false;
  }

  reset(layout: Layout) {
    const focusables = this.getFocusableDescendants(layout).filter(
      (c) => c.focusable
    );
    this.contextStack = [focusables];
    this.index = 0;
    this.setFocus(0);
  }

  getFocusableDescendants(parent: Layout): Component[] {
    const focusables: Component[] = [];

    for (const child of parent.getChildren()) {
      if (child.focusable) {
        focusables.push(child);
      }

      if (child instanceof Layout) {
        focusables.push(...this.getFocusableDescendants(child));
      }
    }

    return focusables;
  }
}
