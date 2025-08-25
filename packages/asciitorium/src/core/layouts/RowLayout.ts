import type { Component } from '../Component';
import { Layout, LayoutOptions } from './Layout';
import type { Alignment } from '../types';
import { resolveGap } from '../utils/gapUtils';
import { createSizeContext, resolveSize, calculateAvailableSpace } from '../utils/sizeUtils';

export class RowLayout implements Layout {
  private fit: boolean;

  constructor(options?: LayoutOptions) {
    this.fit = options?.fit ?? false;
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

    // Second pass: handle fit/flex sizing if enabled
    if (this.fit && children.length > 0) {
      const nonFixedChildren = children.filter(child => !child.fixed);
      const totalGapWidth = nonFixedChildren.reduce((sum, child) => {
        const gap = resolveGap(child.gap);
        return sum + gap.left + gap.right;
      }, 0);
      
      const availableWidth = innerWidth - totalGapWidth;
      const childWidth = Math.floor(availableWidth / nonFixedChildren.length);
      
      for (const child of nonFixedChildren) {
        child.width = Math.max(1, childWidth);
      }
    }

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
      if (originalHeight === undefined || originalHeight === 'fit') {
        child.height = Math.max(1, availableHeight);
      }

      // Handle width="fit" - fill remaining horizontal space
      const originalWidth = child.getOriginalWidth();
      if (originalWidth === 'fit') {
        const remainingWidth = innerWidth - (currentX - borderPad) - gap.left - gap.right;
        child.width = Math.max(1, remainingWidth);
      }

      const { y } = this.resolveAlignment(
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

  private resolveAlignment(
    align: Alignment | undefined,
    _parentWidth: number,
    parentHeight: number,
    _childWidth: number,
    childHeight: number
  ): { x: number; y: number } {
    let vAlign: 'top' | 'middle' | 'bottom' | number = 'top';

    if (typeof align === 'string') {
      // For row layout, alignment affects vertical positioning
      switch (align) {
        case 'top-left':
        case 'top':
        case 'top-right':
          vAlign = 'top';
          break;
        case 'left':
        case 'center':
        case 'right':
          vAlign = 'middle';
          break;
        case 'bottom-left':
        case 'bottom':
        case 'bottom-right':
          vAlign = 'bottom';
          break;
        default:
          vAlign = 'top';
          break;
      }
    } else if (typeof align === 'object' && align !== null) {
      vAlign = align.y ?? 'top';
    }

    const padY = parentHeight - childHeight;

    let y: number;
    if (typeof vAlign === 'number') y = vAlign;
    else if (vAlign === 'middle') y = Math.floor(padY / 2);
    else if (vAlign === 'bottom') y = padY;
    else y = 0;

    return { x: 0, y };
  }
}