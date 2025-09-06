import { Component } from './Component';

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
    }
  }

  private clearFocus() {
    const current = this.currentContext[this.index];
    if (current) {
      current.hasFocus = false;
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

  reset(component: Component) {
    const focusables = this.getFocusableDescendants(component).filter(
      (c) => c.focusable
    );
    this.contextStack = [focusables];
    this.index = 0;
    this.setFocus(0);
  }

  refresh(component: Component) {
    const currentlyFocused = this.currentContext[this.index];
    const focusables = this.getFocusableDescendants(component).filter(
      (c) => c.focusable
    );
    this.contextStack = [focusables];
    
    // Try to find the same component in the new list
    if (currentlyFocused) {
      const newIndex = focusables.indexOf(currentlyFocused);
      if (newIndex !== -1) {
        this.index = newIndex;
        this.setFocus(newIndex);
        return;
      }
    }
    
    // Fallback to index 0 if current component not found
    this.index = 0;
    this.setFocus(0);
  }

  getFocusableDescendants(parent: Component): Component[] {
    const focusables: Component[] = [];

    for (const child of parent.getChildren()) {
      if (child.focusable) {
        focusables.push(child);
      }

      // Now all components can have children, so recursively check all
      focusables.push(...this.getFocusableDescendants(child));
    }

    return focusables;
  }
}
