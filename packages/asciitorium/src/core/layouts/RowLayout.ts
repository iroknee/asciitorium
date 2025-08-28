import type { Component } from '../Component';
import { Layout, LayoutOptions } from './Layout';
import type { Alignment } from '../types';
import { resolveGap, resolveAlignment, createSizeContext, resolveSize, calculateAvailableSpace } from '../utils/index';

export class RowLayout implements Layout {
  constructor(_options?: LayoutOptions) {
    // Row layout constructor - options reserved for future extensions
  }

  layout(parent: Component, children: Component[]): void {
    const borderPad = parent.border ? 1 : 0;
    const innerHeight = parent.height - 2 * borderPad;
    const innerWidth = parent.width - 2 * borderPad;
    
    // Calculate total gap width consumed by all children
    const totalGapWidth = children.reduce((sum, child) => {
      if (child.fixed) return sum;
      const gap = resolveGap(child.gap);
      return sum + gap.left + gap.right;
    }, 0);
    
    // Create size context that accounts for gaps
    const context = createSizeContext(parent.width, parent.height, borderPad);
    // Adjust available width to account for gaps
    context.availableWidth = Math.max(0, context.availableWidth - totalGapWidth);

    // First pass: resolve sizes for all children
    for (const child of children) {
      if (child.fixed) continue;
      
      // Resolve child size based on parent context
      child.resolveSize(context);
    }

    // Second pass: sizing is now handled via width/height props and 'fill' values

    // Third pass: position children
    let currentX = borderPad;

    for (const child of children) {
      if (child.fixed) continue;

      // Resolve child's gap to normalized format
      const gap = resolveGap(child.gap);

      // Apply left gap
      currentX += gap.left;

      // Calculate available height after accounting for top/bottom gaps
      const availableHeight = innerHeight - gap.top - gap.bottom;
      
      // For row layout, children should fill height if not specified
      const originalHeight = child.getOriginalHeight();
      if (originalHeight === undefined || originalHeight === 'fill') {
        child.height = Math.max(1, availableHeight);
      }

      // Handle width="fill" - fill remaining horizontal space
      const originalWidth = child.getOriginalWidth();
      if (originalWidth === 'fill') {
        const remainingWidth = innerWidth - (currentX - borderPad) - gap.left - gap.right;
        child.width = Math.max(1, remainingWidth);
      }

      const { y } = resolveAlignment(
        child.align,
        child.width,
        availableHeight,
        child.width,
        child.height
      );

      // Position with current X and border padding + top gap + alignment offset
      child.x = currentX;
      child.y = borderPad + gap.top + y;

      // Move to next position: current position + component width + right gap
      currentX += child.width + gap.right;
    }
  }

}