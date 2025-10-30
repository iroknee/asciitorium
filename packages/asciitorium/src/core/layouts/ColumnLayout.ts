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

    // Filter out invisible children (width=0, height=0, or visible=false)
    const visibleChildren = children.filter(child => {
      if (child.width === 0 || child.height === 0) return false;
      if (child.visible !== undefined && !child.visible) return false;
      return true;
    });

    // Pass 1: Categorize children and measure fixed-height children
    const fixedChildren: Component[] = [];
    const fillChildren: Component[] = [];
    let fixedHeightTotal = 0;

    for (const child of visibleChildren) {
      if (child.fixed) {
        // Fixed positioned children still need size resolution
        const context = createSizeContext(parent.width, parent.height, borderPad);
        child.resolveSize(context);
        continue;
      }

      const gap = resolveGap(child.gap);
      const originalHeight = child.getOriginalHeight();

      if (originalHeight === 'fill') {
        // This child wants to fill remaining space
        fillChildren.push(child);
        // Account for its gaps in the total
        fixedHeightTotal += gap.top + gap.bottom;
      } else {
        // This child has a fixed or content-based height
        fixedChildren.push(child);

        // Create size context for resolving this child's size
        const context = createSizeContext(parent.width, parent.height, borderPad);
        child.resolveSize(context);

        // Add to total fixed height
        fixedHeightTotal += gap.top + child.height + gap.bottom;
      }
    }

    // Pass 2: Distribute remaining space to fill children
    const remainingHeight = innerHeight - fixedHeightTotal;
    const fillCount = fillChildren.length;

    if (fillCount > 0 && remainingHeight > 0) {
      const heightPerFill = Math.floor(remainingHeight / fillCount);

      for (const child of fillChildren) {
        const gap = resolveGap(child.gap);
        // Each fill child gets equal share, minus its gaps
        child.height = Math.max(1, heightPerFill - gap.top - gap.bottom);
      }
    } else if (fillCount > 0) {
      // No remaining space - give fill children minimum size
      for (const child of fillChildren) {
        child.height = 1;
      }
    }

    // Pass 3: Position all children and set widths
    let currentY = borderPad;

    for (const child of visibleChildren) {
      if (child.fixed) continue; // Skip positioning - already positioned

      const gap = resolveGap(child.gap);

      // Apply top gap
      currentY += gap.top;

      // Calculate available width after accounting for left/right gaps
      const availableWidth = innerWidth - gap.left - gap.right;

      // For column layout, children should fill width if explicitly set to 'fill'
      const originalWidth = child.getOriginalWidth();
      if (originalWidth === 'fill') {
        child.width = Math.max(1, availableWidth);
      }

      // Calculate horizontal alignment
      const { x } = resolveAlignment(
        child.align,
        availableWidth,
        child.height,
        child.width,
        child.height
      );

      // Position child
      child.x = borderPad + gap.left + x;
      child.y = currentY;

      // Move to next position
      currentY += child.height + gap.bottom;
    }
  }

}