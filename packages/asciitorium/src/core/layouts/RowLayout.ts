import type { Component } from '../Component.js';
import { Layout, LayoutOptions } from './Layout.js';
import { resolveGap, resolveAlignment, createSizeContext, resolveSize, calculateAvailableSpace } from '../utils/index.js';

export class RowLayout implements Layout {
  constructor(_options?: LayoutOptions) {
    // Row layout constructor - options reserved for future extensions
  }

  layout(parent: Component, children: Component[]): void {
    const borderPad = parent.border ? 1 : 0;
    const innerHeight = parent.height - 2 * borderPad;
    const innerWidth = parent.width - 2 * borderPad;

    // Filter out invisible children (width=0, height=0, or visible=false)
    const visibleChildren = children.filter(child => {
      if (child.width === 0 || child.height === 0) return false;
      if (child.visible !== undefined && !child.visible) return false;
      return true;
    });

    // Pass 1: Categorize children and measure fixed-width children
    const fixedChildren: Component[] = [];
    const fillChildren: Component[] = [];
    let fixedWidthTotal = 0;

    for (const child of visibleChildren) {
      if (child.fixed) {
        // Fixed positioned children still need size resolution
        const context = createSizeContext(parent.width, parent.height, borderPad);
        child.resolveSize(context);
        continue;
      }

      const gap = resolveGap(child.gap);
      const originalWidth = child.getOriginalWidth();

      if (originalWidth === 'fill') {
        // This child wants to fill remaining space
        fillChildren.push(child);
        // Account for its gaps in the total
        fixedWidthTotal += gap.left + gap.right;
      } else {
        // This child has a fixed or content-based width
        fixedChildren.push(child);

        // Create size context for resolving this child's size
        const context = createSizeContext(parent.width, parent.height, borderPad);
        child.resolveSize(context);

        // Add to total fixed width
        fixedWidthTotal += gap.left + child.width + gap.right;
      }
    }

    // Pass 2: Distribute remaining space to fill children
    const remainingWidth = innerWidth - fixedWidthTotal;
    const fillCount = fillChildren.length;

    if (fillCount > 0 && remainingWidth > 0) {
      const widthPerFill = Math.floor(remainingWidth / fillCount);

      for (const child of fillChildren) {
        const gap = resolveGap(child.gap);
        // Each fill child gets equal share, minus its gaps
        child.width = Math.max(1, widthPerFill - gap.left - gap.right);
      }
    } else if (fillCount > 0) {
      // No remaining space - give fill children minimum size
      for (const child of fillChildren) {
        child.width = 1;
      }
    }

    // Pass 3: Calculate total content width for alignment
    let totalContentWidth = 0;
    for (const child of visibleChildren) {
      if (child.fixed) continue;
      const gap = resolveGap(child.gap);
      totalContentWidth += gap.left + child.width + gap.right;
    }

    // Pass 4: Calculate alignment offsets based on parent's align property
    const remainingWidthForAlign = innerWidth - totalContentWidth;

    let horizontalOffset = 0;
    let defaultVerticalAlignment: 'top' | 'center' | 'bottom' = 'top';

    if (parent.align) {
      // Expand shorthand alignment values
      let expandedAlign = parent.align;
      if (parent.align === 'left') expandedAlign = 'center-left';
      if (parent.align === 'right') expandedAlign = 'center-right';
      if (parent.align === 'top') expandedAlign = 'top-center';
      if (parent.align === 'bottom') expandedAlign = 'bottom-center';

      // Parse the align value into vertical and horizontal components
      const [vertical, horizontal] = expandedAlign.split('-').length === 2
        ? expandedAlign.split('-')
        : expandedAlign === 'center'
          ? ['center', 'center']
          : ['top', 'left']; // fallback

      // Calculate horizontal offset
      if (horizontal === 'center') {
        horizontalOffset = Math.floor(remainingWidthForAlign / 2);
      } else if (horizontal === 'right') {
        horizontalOffset = remainingWidthForAlign;
      }

      // Set default vertical alignment for children
      defaultVerticalAlignment = vertical as 'top' | 'center' | 'bottom';
    }

    // Pass 5: Position all children
    let currentX = borderPad + horizontalOffset;

    for (const child of visibleChildren) {
      if (child.fixed) continue; // Skip positioning - already positioned

      const gap = resolveGap(child.gap);

      // Apply left gap
      currentX += gap.left;

      // Calculate available height after accounting for top/bottom gaps
      const availableHeight = innerHeight - gap.top - gap.bottom;

      // For row layout, only fill height if explicitly requested
      const originalHeight = child.getOriginalHeight();
      if (originalHeight === 'fill') {
        child.height = Math.max(1, availableHeight);
      } else if (originalHeight === undefined) {
        // Let child auto-size its height based on content
        const context = createSizeContext(parent.width, parent.height, borderPad);
        child.resolveSize(context);
      }

      // Calculate vertical positioning using parent's default alignment
      let y = 0;
      if (defaultVerticalAlignment === 'center') {
        y = Math.floor((availableHeight - child.height) / 2);
      } else if (defaultVerticalAlignment === 'bottom') {
        y = availableHeight - child.height;
      }

      // Position child
      child.x = currentX;
      child.y = borderPad + gap.top + y;

      // Move to next position
      currentX += child.width + gap.right;
    }
  }

}