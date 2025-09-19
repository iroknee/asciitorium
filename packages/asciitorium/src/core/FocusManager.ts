import { Component } from './Component';
import { State } from './State';

export class FocusManager {
  private contextStack: Component[][] = [];
  private index = 0;
  private hotkeyMap = new Map<string, Component>();
  public hotkeyVisibilityState = new State<boolean>(false);

  // Reserved keys that should not be used for hotkeys
  private static readonly RESERVED_KEYS = new Set([
    'w', 'a', 's', 'd', // WASD movement
    'ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight', // Arrow keys
    'Tab', 'Enter', ' ', 'Escape', // Navigation and control
    'Backspace', 'Delete', 'Home', 'End', // Text editing
    'PageUp', 'PageDown', // Scrolling
  ]);

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

  /**
   * Unified key handling for both hotkeys and navigation
   */
  handleKey(key: string): boolean {
    // Handle hotkey visibility toggle first
    if (key === '`' || key === 'F1') {
      this.hotkeyVisibilityState.value = !this.hotkeyVisibilityState.value;
      return true;
    }

    // Handle direct hotkeys
    const hotkeyComponent = this.hotkeyMap.get(key.toLowerCase());
    if (hotkeyComponent) {
      // Focus the component
      const targetIndex = this.currentContext.indexOf(hotkeyComponent);
      if (targetIndex !== -1) {
        this.clearFocus();
        this.index = targetIndex;
        this.setFocus(targetIndex);

        // For buttons: trigger action
        if ((hotkeyComponent as any).onClick) {
          (hotkeyComponent as any).onClick();
        }
        return true;
      }
    }

    // Handle navigation keys
    if (key === 'Tab') {
      this.focusNext();
      return true;
    }

    if (key === 'Shift+Tab') {
      this.focusPrevious();
      return true;
    }

    // Pass other keys to focused component
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
    this.buildHotkeyMap(focusables);
  }

  refresh(component: Component) {
    const currentlyFocused = this.currentContext[this.index];
    const focusables = this.getFocusableDescendants(component).filter(
      (c) => c.focusable
    );
    this.contextStack = [focusables];
    this.buildHotkeyMap(focusables);

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

  /**
   * Build hotkey map from focusable components
   */
  private buildHotkeyMap(focusableComponents: Component[]): void {
    this.hotkeyMap.clear();

    for (const component of focusableComponents) {
      if (component.hotkey) {
        if (this.isReservedKey(component.hotkey)) {
          console.error(`ERROR: Hotkey '${component.hotkey}' is reserved for system navigation and cannot be used. Reserved keys: ${Array.from(FocusManager.RESERVED_KEYS).join(', ')}`);
        } else {
          const key = component.hotkey.toLowerCase();
          if (this.hotkeyMap.has(key)) {
            console.warn(`Hotkey '${component.hotkey}' is already assigned to another component`);
          } else {
            this.hotkeyMap.set(key, component);
          }
        }
      }
    }
  }

  private isReservedKey(key: string): boolean {
    return FocusManager.RESERVED_KEYS.has(key) || FocusManager.RESERVED_KEYS.has(key.toLowerCase());
  }

  getFocusableDescendants(parent: Component): Component[] {
    const focusables: Component[] = [];

    for (const child of parent.getChildren()) {
      // Skip invisible components for focus navigation
      if (!child.visible) continue;

      if (child.focusable) {
        focusables.push(child);
      }

      // Now all components can have children, so recursively check all
      focusables.push(...this.getFocusableDescendants(child));
    }

    return focusables;
  }
}
