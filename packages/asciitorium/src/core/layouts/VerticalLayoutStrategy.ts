import type { Component } from '../Component';
import { LayoutStrategy, LayoutOptions } from './LayoutStrategy';
import { resolveAlignment } from '../utils';

export class VerticalLayoutStrategy implements LayoutStrategy {
  private fit: boolean;

  constructor(options?: LayoutOptions) {
    this.fit = options?.fit ?? false;
  }

  layout(parent: Component, children: Component[]): void {
    const borderPad = parent.border ? 1 : 0;
    const innerWidth = parent.width - 2 * borderPad;
    const innerHeight = parent.height - 2 * borderPad;
    const count = children.length;

    let currentY = borderPad;

    for (const child of children) {
      if (child.fixed) {
        continue; // Skip positioning if component is fixed
      }

      if (this.fit && count > 0) {
        child.height = Math.floor(innerHeight / count);
      }

      if (!child.width) {
        child.width = innerWidth;
      }

      const { x } = resolveAlignment(
        child.align,
        innerWidth,
        child.height,
        child.width,
        child.height
      );

      child.x = borderPad + x;
      child.y = currentY;

      currentY += child.height;
    }
  }
}