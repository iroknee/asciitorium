import type { Component } from '../Component';
import { Layout, LayoutOptions } from './Layout';
import type { Alignment } from '../types';
import { resolveGap, resolveAlignment, createSizeContext, resolveSize, calculateAvailableSpace } from '../utils/index';

export class ColumnLayout implements Layout {
  constructor(_options?: LayoutOptions) {
    // Column layout constructor - options reserved for future extensions
  }

  layout(parent: Component, children: Component[]): void {
    const borderPad = parent.border ? 1 : 0;
    const innerWidth = parent.width - 2 * borderPad;
    const innerHeight = parent.height - 2 * borderPad;
    
    // Calculate total gap height consumed by all children
    const totalGapHeight = children.reduce((sum, child) => {
      if (child.fixed) return sum;
      const gap = resolveGap(child.gap);
      return sum + gap.top + gap.bottom;
    }, 0);
    
    // Create size context that accounts for gaps
    const context = createSizeContext(parent.width, parent.height, borderPad);
    // Adjust available height to account for gaps
    context.availableHeight = Math.max(0, context.availableHeight - totalGapHeight);

    // First pass: resolve sizes for all children
    for (const child of children) {
      if (child.fixed) continue;
      
      // Resolve child size based on parent context
      child.resolveSize(context);
    }

    // Second pass: sizing is now handled via width/height props and 'fill' values

    // Third pass: position children
    let currentY = borderPad;

    for (const child of children) {
      if (child.fixed) {
        continue; // Skip positioning if component is fixed
      }

      // Resolve child's gap to normalized format
      const gap = resolveGap(child.gap);

      // Apply top gap
      currentY += gap.top;

      // Calculate available width after accounting for left/right gaps
      const availableWidth = innerWidth - gap.left - gap.right;
      
      // For column layout, children should fill width if not specified
      const originalWidth = child.getOriginalWidth();
      if (originalWidth === undefined || originalWidth === 'fill') {
        child.width = Math.max(1, availableWidth);
      }

      // Handle height="fill" - fill remaining vertical space
      const originalHeight = child.getOriginalHeight();
      if (originalHeight === 'fill') {
        // Calculate space needed by remaining components
        const currentIndex = children.indexOf(child);
        let spaceNeededByLaterComponents = 0;
        
        for (let i = currentIndex + 1; i < children.length; i++) {
          const laterChild = children[i];
          if (laterChild.fixed) continue;
          
          const laterGap = resolveGap(laterChild.gap);
          spaceNeededByLaterComponents += laterChild.height + laterGap.top + laterGap.bottom;
        }
        
        const remainingHeight = innerHeight - (currentY - borderPad) - gap.top - gap.bottom - spaceNeededByLaterComponents;
        child.height = Math.max(1, remainingHeight);
      }

      const { x } = resolveAlignment(
        child.align,
        availableWidth,
        child.height,
        child.width,
        child.height
      );

      // Position with border padding + left gap + alignment offset
      child.x = borderPad + gap.left + x;
      child.y = currentY;

      // Move to next position: current position + component height + bottom gap
      currentY += child.height + gap.bottom;
    }
  }

}