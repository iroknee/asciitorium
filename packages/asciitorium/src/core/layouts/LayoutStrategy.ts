import type { Component } from '../Component';
import { HorizontalLayoutStrategy } from './HorizontalLayoutStrategy';
import { VerticalLayoutStrategy } from './VerticalLayoutStrategy';
import { AbsoluteLayoutStrategy } from './AbsoluteLayoutStrategy';

/**
 * Interface for layout strategies that handle child component positioning
 */
export interface LayoutStrategy {
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
export type LayoutType = 'horizontal' | 'vertical' | 'absolute';

/**
 * Configuration options for specific layout strategies
 */
export interface LayoutOptions {
  fit?: boolean; // Whether to fit children to available space
}

/**
 * Registry of available layout strategies
 */
export class LayoutRegistry {
  private static strategies = new Map<LayoutType, new (options?: LayoutOptions) => LayoutStrategy>();
  
  // Static initialization - register all built-in layout strategies
  static {
    this.strategies.set('horizontal', HorizontalLayoutStrategy);
    this.strategies.set('vertical', VerticalLayoutStrategy);
    this.strategies.set('absolute', AbsoluteLayoutStrategy);
  }

  static register(type: LayoutType, strategyClass: new (options?: LayoutOptions) => LayoutStrategy): void {
    this.strategies.set(type, strategyClass);
  }

  static create(type: LayoutType, options?: LayoutOptions): LayoutStrategy {
    const StrategyClass = this.strategies.get(type);
    if (!StrategyClass) {
      throw new Error(`Unknown layout type: ${type}`);
    }
    return new StrategyClass(options);
  }

  static getAvailableTypes(): LayoutType[] {
    return Array.from(this.strategies.keys());
  }
}