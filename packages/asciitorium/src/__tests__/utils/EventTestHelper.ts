import { Component } from '../../core/Component.js';

/**
 * Helper for simulating user interactions and events in tests
 */
export class EventTestHelper {
  /**
   * Common keyboard events for testing
   */
  static Keys = {
    ENTER: 'Enter',
    SPACE: ' ',
    TAB: 'Tab',
    ESCAPE: 'Escape',
    ARROW_UP: 'ArrowUp',
    ARROW_DOWN: 'ArrowDown',
    ARROW_LEFT: 'ArrowLeft',
    ARROW_RIGHT: 'ArrowRight',
    W: 'w',
    A: 'a',
    S: 's',
    D: 'd',
    BACKSPACE: 'Backspace',
    DELETE: 'Delete',
  } as const;

  /**
   * Simulate a key press on a component
   */
  static pressKey(component: Component, key: string): boolean {
    if ('handleEvent' in component && typeof component.handleEvent === 'function') {
      return component.handleEvent(key);
    }
    return false;
  }

  /**
   * Simulate multiple key presses in sequence
   */
  static pressKeys(component: Component, keys: string[]): boolean[] {
    return keys.map(key => this.pressKey(component, key));
  }

  /**
   * Simulate arrow key navigation
   */
  static navigate(component: Component, direction: 'up' | 'down' | 'left' | 'right'): boolean {
    const keyMap = {
      up: this.Keys.ARROW_UP,
      down: this.Keys.ARROW_DOWN,
      left: this.Keys.ARROW_LEFT,
      right: this.Keys.ARROW_RIGHT,
    };
    return this.pressKey(component, keyMap[direction]);
  }

  /**
   * Simulate WASD movement (common in games like AsciiMap)
   */
  static move(component: Component, direction: 'w' | 'a' | 's' | 'd'): boolean {
    return this.pressKey(component, direction);
  }

  /**
   * Simulate Enter key press (for activation)
   */
  static activate(component: Component): boolean {
    return this.pressKey(component, this.Keys.ENTER);
  }

  /**
   * Simulate Space key press (alternative activation)
   */
  static activateWithSpace(component: Component): boolean {
    return this.pressKey(component, this.Keys.SPACE);
  }

  /**
   * Simulate focus event
   */
  static focus(component: Component): void {
    if ('focusable' in component && component.focusable) {
      (component as any).hasFocus = true;
    }
  }

  /**
   * Simulate blur event  
   */
  static blur(component: Component): void {
    if ('focusable' in component && component.focusable) {
      (component as any).hasFocus = false;
    }
  }

  /**
   * Simulate mouse click
   */
  static click(component: Component): void {
    if ('onClick' in component && typeof (component as any).onClick === 'function') {
      (component as any).onClick();
    }
  }

  /**
   * Type text into a component (useful for TextInput testing)
   */
  static typeText(component: Component, text: string): boolean[] {
    return text.split('').map(char => this.pressKey(component, char));
  }

  /**
   * Simulate common input patterns for testing
   */
  static inputSequence(component: Component, sequence: Array<string | { action: string }>): boolean[] {
    return sequence.map(item => {
      if (typeof item === 'string') {
        return this.pressKey(component, item);
      } else {
        switch (item.action) {
          case 'focus':
            this.focus(component);
            return true;
          case 'blur':
            this.blur(component);
            return true;
          case 'click':
            this.click(component);
            return true;
          default:
            return false;
        }
      }
    });
  }
}