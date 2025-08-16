import type { Component } from '../Component';
import { LayoutStrategy } from './LayoutStrategy';

export class AbsoluteLayoutStrategy implements LayoutStrategy {
  layout(parent: Component, children: Component[]): void {
    // Absolute layout doesn't modify child positions - they use their x,y coordinates as-is
    // This is useful for components that want manual positioning of their children
    // Children keep their explicitly set x,y coordinates
  }
}