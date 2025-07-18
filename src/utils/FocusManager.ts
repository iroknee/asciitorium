import { Component } from '../components/Component';
import { Container } from '../components/Container';

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

  reset(layoutRoot: Container) {
    this.contextStack = [this.getFocusableDescendants(layoutRoot)];
    this.index = 0;
    this.setFocus(0);
  }

  getFocusableDescendants(layoutRoot: Container): Component[] {
    const focusables: Component[] = [];
    for (const child of layoutRoot.children) {
      if (child.component.focusable) focusables.push(child.component);
      // Recursively check if the child is a Container
      if (child.component instanceof Container) {
        focusables.push(...this.getFocusableDescendants(child.component));
      }
    }
    return focusables;
  }
}
