import { Component } from './Component';
import { State } from './State';

export interface HotkeyRegistration {
  component: Component;
  hotkey: string;
}

export class HotkeyManager {
  private registrations = new Map<string, HotkeyRegistration>();
  private componentToHotkey = new Map<Component, string>();
  public hotkeyVisibilityState = new State<boolean>(false);

  // Reserved keys that should not be used for hotkeys
  private static readonly RESERVED_KEYS = new Set([
    'w', 'a', 's', 'd', // WASD movement
    'ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight', // Arrow keys
    'Tab', 'Enter', ' ', 'Escape', // Navigation and control
    'Backspace', 'Delete', 'Home', 'End', // Text editing
    'PageUp', 'PageDown', // Scrolling
  ]);


  /**
   * Register a component with an explicit hotkey
   */
  registerComponent(component: Component, hotkey?: string): string | null {
    // Only register if an explicit hotkey is provided
    if (!hotkey) {
      return null;
    }

    // Remove any existing registration for this component
    this.unregisterComponent(component);

    if (this.isReservedKey(hotkey)) {
      console.warn(`Cannot assign reserved key '${hotkey}' to component`);
      return null;
    }

    const existing = this.registrations.get(hotkey.toLowerCase());
    if (existing) {
      console.warn(`Hotkey '${hotkey}' is already assigned to another component`);
      return null;
    }

    return this.doRegister(component, hotkey);
  }

  private doRegister(component: Component, hotkey: string): string {
    const registration: HotkeyRegistration = { component, hotkey };
    this.registrations.set(hotkey.toLowerCase(), registration);
    this.componentToHotkey.set(component, hotkey);
    return hotkey;
  }

  /**
   * Unregister a component
   */
  unregisterComponent(component: Component): void {
    const hotkey = this.componentToHotkey.get(component);
    if (hotkey) {
      this.registrations.delete(hotkey.toLowerCase());
      this.componentToHotkey.delete(component);
    }
  }

  /**
   * Get the hotkey for a component
   */
  getHotkey(component: Component): string | null {
    return this.componentToHotkey.get(component) || null;
  }

  /**
   * Handle a hotkey press
   */
  handleHotkey(key: string): boolean {
    // Use backtick (`) as hotkey toggle since F1 is often intercepted by browsers
    if (key === '`' || key === 'F1') {
      this.hotkeyVisibilityState.value = !this.hotkeyVisibilityState.value;
      return true;
    }

    const registration = this.registrations.get(key.toLowerCase());
    if (registration && registration.component.focusable) {
      // Clear focus from all other components and focus this one
      this.focusComponent(registration.component);

      // If it's a button, trigger click
      if ((registration.component as any).onClick) {
        (registration.component as any).onClick();
      }

      return true;
    }

    return false;
  }

  /**
   * Clear all registrations
   */
  clear(): void {
    this.registrations.clear();
    this.componentToHotkey.clear();
  }

  /**
   * Get all current registrations for debugging
   */
  getRegistrations(): Map<string, HotkeyRegistration> {
    return new Map(this.registrations);
  }

  /**
   * Focus a component and clear focus from all others
   */
  private focusComponent(component: Component): void {
    // Find the App by walking up the component tree
    let current: Component | undefined = component;
    while (current && !(current as any).isApp) {
      current = current.parent;
    }

    if (current && (current as any).focus) {
      // Get all components and clear their focus
      const allComponents = (current as any).getAllDescendants();
      for (const comp of allComponents) {
        comp.hasFocus = false;
      }

      // Set focus on target component
      component.hasFocus = true;

      // Update the focus manager to track this component
      (current as any).focus.refresh(current);
    }
  }

  private isReservedKey(key: string): boolean {
    return HotkeyManager.RESERVED_KEYS.has(key) || HotkeyManager.RESERVED_KEYS.has(key.toLowerCase());
  }
}