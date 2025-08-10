import { Layout } from './layouts/Layout';
export class FocusManager {
    constructor() {
        this.contextStack = [];
        this.index = 0;
    }
    pushContext(components) {
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
    get currentContext() {
        return this.contextStack[this.contextStack.length - 1] || [];
    }
    setFocus(index) {
        this.index = index;
        const current = this.currentContext[this.index];
        if (current) {
            current.hasFocus = true;
        }
    }
    clearFocus() {
        const current = this.currentContext[this.index];
        if (current) {
            current.hasFocus = false;
        }
    }
    focusNext() {
        if (this.currentContext.length === 0)
            return;
        this.clearFocus();
        this.index = (this.index + 1) % this.currentContext.length;
        this.setFocus(this.index);
    }
    // TODO: this doesn't work, still goes forward
    focusPrevious() {
        if (this.currentContext.length === 0)
            return;
        this.clearFocus();
        this.index =
            (this.index - 1 + this.currentContext.length) %
                this.currentContext.length;
        this.setFocus(this.index);
    }
    handleKey(key) {
        const current = this.currentContext[this.index];
        const handled = current?.handleEvent?.(key);
        return handled ?? false;
    }
    reset(layout) {
        const focusables = this.getFocusableDescendants(layout).filter((c) => c.focusable);
        this.contextStack = [focusables];
        this.index = 0;
        this.setFocus(0);
    }
    getFocusableDescendants(parent) {
        const focusables = [];
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
