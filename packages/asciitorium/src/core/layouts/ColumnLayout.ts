import type { Component } from '../Component';
import { Layout, LayoutOptions } from './Layout';
import type { Alignment } from '../types';
import { resolveGap } from '../utils/gapUtils';
import { createSizeContext, resolveSize, calculateAvailableSpace } from '../utils/sizeUtils';

export class ColumnLayout implements Layout {
  private fit: boolean;

  constructor(options?: LayoutOptions) {
    this.fit = options?.fit ?? false;
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

    // Second pass: handle fit/flex sizing if enabled
    if (this.fit && children.length > 0) {
      const nonFixedChildren = children.filter(child => !child.fixed);
      const totalGapHeight = nonFixedChildren.reduce((sum, child) => {
        const gap = resolveGap(child.gap);
        return sum + gap.top + gap.bottom;
      }, 0);
      
      const availableHeight = innerHeight - totalGapHeight;
      const childHeight = Math.floor(availableHeight / nonFixedChildren.length);
      
      for (const child of nonFixedChildren) {
        child.height = Math.max(1, childHeight);
      }
    }

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
      if (originalWidth === undefined || originalWidth === 'fit') {
        child.width = Math.max(1, availableWidth);
      }

      // Handle height="fit" - fill remaining vertical space
      const originalHeight = child.getOriginalHeight();
      if (originalHeight === 'fit') {
        const remainingHeight = innerHeight - (currentY - borderPad) - gap.top - gap.bottom;
        child.height = Math.max(1, remainingHeight);
      }

      const { x } = this.resolveAlignment(
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

  private resolveAlignment(
    align: Alignment | undefined,
    parentWidth: number,
    _parentHeight: number,
    childWidth: number,
    _childHeight: number
  ): { x: number; y: number } {
    let hAlign: 'left' | 'center' | 'right' | number = 'left';

    if (typeof align === 'string') {
      // For column layout, alignment affects horizontal positioning
      switch (align) {
        case 'top-left':
        case 'left':
        case 'bottom-left':
          hAlign = 'left';
          break;
        case 'top':
        case 'center':
        case 'bottom':
          hAlign = 'center';
          break;
        case 'top-right':
        case 'right':
        case 'bottom-right':
          hAlign = 'right';
          break;
        default:
          hAlign = 'left';
          break;
      }
    } else if (typeof align === 'object' && align !== null) {
      hAlign = align.x ?? 'left';
    }

    const padX = parentWidth - childWidth;

    let x: number;
    if (typeof hAlign === 'number') x = hAlign;
    else if (hAlign === 'center') x = Math.floor(padX / 2);
    else if (hAlign === 'right') x = padX;
    else x = 0;

    return { x, y: 0 };
  }
}