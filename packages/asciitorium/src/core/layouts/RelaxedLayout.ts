import type { Component } from '../Component';
import { Layout, LayoutOptions } from './Layout';
import type { Alignment } from '../types';

export class RelaxedLayout implements Layout {
  constructor(_options?: LayoutOptions) {
    // RelaxedLayout doesn't use any specific options currently
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
      const { x, y } = this.resolveAlignment(
        child.align,
        innerWidth,
        innerHeight,
        child.width,
        child.height
      );

      // Apply gap based on alignment direction
      const { gapX, gapY } = this.calculateGapOffset(child.align, child.gap);

      child.x = borderPad + x + gapX;
      child.y = borderPad + y + gapY;
    }
  }

  private resolveAlignment(
    align: Alignment | undefined,
    parentWidth: number,
    parentHeight: number,
    childWidth: number,
    childHeight: number
  ): { x: number; y: number } {
    let hAlign: 'left' | 'center' | 'right' | number = 'left';
    let vAlign: 'top' | 'middle' | 'bottom' | number = 'top';

    if (typeof align === 'string') {
      // Parse string alignment into horizontal and vertical components
      switch (align) {
        case 'top-left':
          hAlign = 'left';
          vAlign = 'top';
          break;
        case 'top':
          hAlign = 'center';
          vAlign = 'top';
          break;
        case 'top-right':
          hAlign = 'right';
          vAlign = 'top';
          break;
        case 'left':
          hAlign = 'left';
          vAlign = 'middle';
          break;
        case 'center':
          hAlign = 'center';
          vAlign = 'middle';
          break;
        case 'right':
          hAlign = 'right';
          vAlign = 'middle';
          break;
        case 'bottom-left':
          hAlign = 'left';
          vAlign = 'bottom';
          break;
        case 'bottom':
          hAlign = 'center';
          vAlign = 'bottom';
          break;
        case 'bottom-right':
          hAlign = 'right';
          vAlign = 'bottom';
          break;
        default:
          hAlign = 'left';
          vAlign = 'top';
          break;
      }
    } else if (typeof align === 'object' && align !== null) {
      hAlign = align.x ?? 'left';
      vAlign = align.y ?? 'top';
    }

    // Calculate horizontal position
    const padX = parentWidth - childWidth;
    let x: number;
    if (typeof hAlign === 'number') {
      x = hAlign;
    } else if (hAlign === 'center') {
      x = Math.floor(padX / 2);
    } else if (hAlign === 'right') {
      x = padX;
    } else {
      x = 0; // left
    }

    // Calculate vertical position
    const padY = parentHeight - childHeight;
    let y: number;
    if (typeof vAlign === 'number') {
      y = vAlign;
    } else if (vAlign === 'middle') {
      y = Math.floor(padY / 2);
    } else if (vAlign === 'bottom') {
      y = padY;
    } else {
      y = 0; // top
    }

    return { x, y };
  }

  private calculateGapOffset(
    align: Alignment | undefined,
    gap: number
  ): { gapX: number; gapY: number } {
    if (!gap || !align) {
      return { gapX: 0, gapY: 0 };
    }

    let gapX = 0;
    let gapY = 0;

    if (typeof align === 'string') {
      // Apply gap based on alignment direction
      switch (align) {
        case 'top':
          gapY = gap; // Gap above (push down)
          break;
        case 'top-left':
          gapY = gap; // Gap above
          gapX = gap; // Gap to the left (push right)
          break;
        case 'top-right':
          gapY = gap; // Gap above
          gapX = -gap; // Gap to the right (push left)
          break;
        case 'left':
          gapX = gap; // Gap to the left (push right)
          break;
        case 'right':
          gapX = -gap; // Gap to the right (push left)
          break;
        case 'bottom':
          gapY = -gap; // Gap below (push up)
          break;
        case 'bottom-left':
          gapY = -gap; // Gap below
          gapX = gap; // Gap to the left (push right)
          break;
        case 'bottom-right':
          gapY = -gap; // Gap below
          gapX = -gap; // Gap to the right (push left)
          break;
        case 'center':
          // No gap applied for center alignment
          break;
      }
    }
    // For object-based alignment, we could extend this if needed
    // but for now we'll only handle string-based alignments

    return { gapX, gapY };
  }
}
