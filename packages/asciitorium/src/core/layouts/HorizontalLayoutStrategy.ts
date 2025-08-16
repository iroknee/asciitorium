import type { Component } from '../Component';
import { LayoutStrategy, LayoutOptions } from './LayoutStrategy';
import { resolveAlignment } from '../utils';

export class HorizontalLayoutStrategy implements LayoutStrategy {
  private fit: boolean;

  constructor(options?: LayoutOptions) {
    this.fit = options?.fit ?? false;
  }

  layout(parent: Component, children: Component[]): void {
    const borderPad = parent.border ? 1 : 0;
    const innerHeight = parent.height - 2 * borderPad;
    const innerWidth = parent.width - 2 * borderPad;
    const count = children.length;

    let currentX = borderPad;

    for (const child of children) {
      if (child.fixed) continue; // Skip positioning if component is fixed

      if (this.fit && count > 0) {
        child.width = Math.floor(innerWidth / count);
      }

      if (!child.height) {
        child.height = innerHeight;
      }

      const { y } = resolveAlignment(
        child.align,
        child.width,
        innerHeight,
        child.width,
        child.height
      );

      child.x = currentX;
      child.y = borderPad + y;

      currentX += child.width;
    }
  }
}