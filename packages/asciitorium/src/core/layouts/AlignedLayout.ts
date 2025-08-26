import type { Component } from '../Component';
import { Layout, LayoutOptions } from './Layout';
import type { Alignment } from '../types';
import { resolveGap, resolveAlignment } from '../utils/index';
import { createSizeContext } from '../utils/sizeUtils';

export class AlignedLayout implements Layout {
  constructor(_options?: LayoutOptions) {
    // AlignedLayout doesn't use any specific options currently
  }

  layout(parent: Component, children: Component[]): void {
    const borderPad = parent.border ? 1 : 0;
    const innerWidth = parent.width - 2 * borderPad;
    const innerHeight = parent.height - 2 * borderPad;

    // Create size context for resolving relative sizes
    const sizeContext = createSizeContext(innerWidth, innerHeight, 0);

    for (const child of children) {
      if (child.fixed) {
        continue; // Skip positioning if component is fixed
      }

      // Always resolve width, but only resolve height for non-dynamic TextInputs
      const hasFixedHeight = (child as any).fixedHeight !== undefined;
      const isTextInput = child.constructor.name === 'TextInput';
      
      if (!isTextInput || hasFixedHeight) {
        // Resolve full size for non-TextInput components or TextInputs with fixed height
        child.resolveSize(sizeContext);
      } else {
        // For dynamic TextInputs, only resolve width but preserve dynamic height
        const originalHeight = child.height;
        child.resolveSize(sizeContext);
        child.height = originalHeight; // Restore the dynamic height
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