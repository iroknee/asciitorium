import type { Component } from '../Component';
import { Layout, LayoutOptions } from './Layout';
import type { Alignment } from '../types';
import { resolveGap, resolveAlignment } from '../utils/index';

export class AlignedLayout implements Layout {
  constructor(_options?: LayoutOptions) {
    // AlignedLayout doesn't use any specific options currently
  }

  layout(parent: Component, children: Component[]): void {
    const borderPad = parent.border ? 1 : 0;
    const innerWidth = parent.width - 2 * borderPad;
    const innerHeight = parent.height - 2 * borderPad;

    for (const child of children) {
      if (child.fixed) {
        continue; // Skip positioning if component is fixed
      }

      // Only apply alignment-based positioning
      const { x, y } = resolveAlignment(
        child.align,
        innerWidth,
        innerHeight,
        child.width,
        child.height
      );

      // Resolve gap and apply it to the final position
      const gap = resolveGap(child.gap);

      child.x = borderPad + x + gap.left;
      child.y = borderPad + y + gap.top;
    }
  }


}