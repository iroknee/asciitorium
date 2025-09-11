import { Component } from '../../core/Component';
import { State } from '../../core/State';
import { createSizeContext } from '../../core/utils/sizeUtils';

/**
 * A headless renderer for testing components without DOM or terminal output
 * Provides access to the internal buffer for testing visual output
 */
export class ComponentTestRenderer {
  private component: Component | null = null;

  /**
   * Render a component and return its buffer output
   */
  render(component: Component): string[][] {
    this.component = component;
    
    // Create a reasonable default size context for testing (80x24 terminal)
    const defaultContext = createSizeContext(80, 24, 0);
    
    // Resolve component size before drawing
    this.component.resolveSize(defaultContext);
    
    // Draw the component to its internal buffer (this will recalculate layout)
    return this.component.draw();
  }

  /**
   * Get the rendered output as a string (useful for debugging)
   */
  getAsString(buffer: string[][]): string {
    return buffer.map(row => row.join('')).join('\n');
  }

  /**
   * Get the component's dimensions
   */
  getDimensions(component: Component): { width: number; height: number } {
    return {
      width: component.width,
      height: component.height,
    };
  }

  /**
   * Simulate focus on the component
   */
  focus(component: Component): void {
    if ('focusable' in component && component.focusable) {
      (component as any).hasFocus = true;
      component.draw(); // Redraw to show focus state
    }
  }

  /**
   * Simulate blur on the component
   */
  blur(component: Component): void {
    if ('focusable' in component && component.focusable) {
      (component as any).hasFocus = false;
      component.draw(); // Redraw to show unfocused state
    }
  }

  /**
   * Simulate keyboard event on the component
   */
  sendKey(component: Component, key: string): boolean {
    if ('handleEvent' in component && typeof component.handleEvent === 'function') {
      return component.handleEvent(key);
    }
    return false;
  }

  /**
   * Simulate mouse click on the component
   */
  click(component: Component): void {
    if ('onClick' in component && typeof (component as any).onClick === 'function') {
      (component as any).onClick();
    }
  }

  /**
   * Clean up resources
   */
  cleanup(): void {
    if (this.component && 'destroy' in this.component) {
      this.component.destroy();
    }
    this.component = null;
  }
}