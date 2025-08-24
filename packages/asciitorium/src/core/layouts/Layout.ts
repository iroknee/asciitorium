import type { Component } from '../Component';
import { RowLayout } from './RowLayout';
import { ColumnLayout } from './ColumnLayout';
import { FixedLayout } from './FixedLayout';
import { AlignedLayout } from './AlignedLayout';

/**
 * Interface for layouts that handle child component positioning
 */
export interface Layout {
  /**
   * Calculate positions and sizes for child components
   * @param parent The parent component containing the children
   * @param children Array of child components to layout
   */
  layout(parent: Component, children: Component[]): void;
}

/**
 * Available layout types that can be specified by name
 */
export type LayoutType = 'row' | 'column' | 'fixed' | 'aligned';

/**
 * Configuration options for specific layouts
 */
export interface LayoutOptions {
  fit?: boolean; // Whether to fit children to available space
}

/**
 * Registry of available layouts
 */
export class LayoutRegistry {
  private static layouts = new Map<
    LayoutType,
    new (options?: LayoutOptions) => Layout
  >();

  // Static initialization - register all built-in layouts
  static {
    this.layouts.set('row', RowLayout);
    this.layouts.set('column', ColumnLayout);
    this.layouts.set('fixed', FixedLayout);
    this.layouts.set('aligned', AlignedLayout);
  }

  static register(
    type: LayoutType,
    layoutClass: new (options?: LayoutOptions) => Layout
  ): void {
    this.layouts.set(type, layoutClass);
  }

  static create(type: LayoutType, options?: LayoutOptions): Layout {
    const LayoutClass = this.layouts.get(type);
    if (!LayoutClass) {
      throw new Error(`Unknown layout type: ${type}`);
    }
    return new LayoutClass(options);
  }

  static getAvailableTypes(): LayoutType[] {
    return Array.from(this.layouts.keys());
  }
}
