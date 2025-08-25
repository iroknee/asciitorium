import type { Component } from '../Component';
import { Layout } from './Layout';
import type { Alignment } from '../types';
import { resolveAlignment } from '../utils/index';

export class FixedLayout implements Layout {
  layout(parent: Component, children: Component[]): void {
    const borderPad = parent.border ? 1 : 0;
    const innerWidth = parent.width - 2 * borderPad;
    const innerHeight = parent.height - 2 * borderPad;

    for (const child of children) {
      if (child.fixed) continue; // Skip positioning if component is fixed

      // Apply alignment within the parent's inner area
      const { x, y } = resolveAlignment(
        child.align,
        innerWidth,
        innerHeight,
        child.width,
        child.height
      );

      child.x = borderPad + x;
      child.y = borderPad + y;
    }
  }

}