import type { Component } from '../Component';
import { Layout, LayoutOptions } from './Layout';
import type { Alignment } from '../types';
import { resolveGap } from '../utils/gapUtils';

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
      const { x, y } = this.resolveAlignment(
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

}