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

      // Resolve gap and apply it to the final position based on alignment
      const gap = resolveGap(child.gap);
      
      // Determine alignment components
      const align = child.align || 'top-left';
      const isRight = typeof align === 'string' && (align.includes('right') || align === 'right');
      const isBottom = typeof align === 'string' && (align.includes('bottom') || align === 'bottom');
      const isCenter = typeof align === 'string' && align === 'center';
      const isMiddle = typeof align === 'string' && (align.includes('middle') || align === 'left' || align === 'right');
      
      // Apply gap based on alignment direction
      let finalX = borderPad + x;
      let finalY = borderPad + y;
      
      if (isRight) {
        finalX += gap.left - gap.right; // For right-aligned, right gap moves left
      } else if (isCenter || (typeof align === 'string' && align === 'top')) {
        finalX += (gap.left - gap.right) / 2; // For center-aligned, balance gaps
      } else {
        finalX += gap.left; // For left-aligned, left gap moves right
      }
      
      if (isBottom) {
        finalY += gap.top - gap.bottom; // For bottom-aligned, bottom gap moves up
      } else if (isMiddle) {
        finalY += (gap.top - gap.bottom) / 2; // For middle-aligned, balance gaps
      } else {
        finalY += gap.top; // For top-aligned, top gap moves down
      }

      child.x = finalX;
      child.y = finalY;
    }
  }


}