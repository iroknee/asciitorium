import type { Component } from '../Component';
import { Layout } from './Layout';
import type { Alignment } from '../types';

export class FixedLayout implements Layout {
  layout(parent: Component, children: Component[]): void {
    const borderPad = parent.border ? 1 : 0;
    const innerWidth = parent.width - 2 * borderPad;
    const innerHeight = parent.height - 2 * borderPad;

    for (const child of children) {
      if (child.fixed) continue; // Skip positioning if component is fixed

      // Apply alignment within the parent's inner area
      const { x, y } = this.resolveAlignment(
        child.align,
        innerWidth,
        innerHeight,
        child.width,
        child.height
      );

      child.x = borderPad + x;
      child.y = borderPad + y;
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
      // Handle compound alignments like "top-left"
      switch (align) {
        case 'top-left':
          vAlign = 'top';
          hAlign = 'left';
          break;
        case 'top':
          vAlign = 'top';
          hAlign = 'center';
          break;
        case 'top-right':
          vAlign = 'top';
          hAlign = 'right';
          break;
        case 'left':
          vAlign = 'middle';
          hAlign = 'left';
          break;
        case 'center':
          vAlign = 'middle';
          hAlign = 'center';
          break;
        case 'right':
          vAlign = 'middle';
          hAlign = 'right';
          break;
        case 'bottom-left':
          vAlign = 'bottom';
          hAlign = 'left';
          break;
        case 'bottom':
          vAlign = 'bottom';
          hAlign = 'center';
          break;
        case 'bottom-right':
          vAlign = 'bottom';
          hAlign = 'right';
          break;
        default:
          vAlign = 'top';
          hAlign = 'left';
          break;
      }
    } else if (typeof align === 'object' && align !== null) {
      hAlign = align.x ?? 'left';
      vAlign = align.y ?? 'top';
    }

    const padX = parentWidth - childWidth;
    const padY = parentHeight - childHeight;

    let x: number;
    if (typeof hAlign === 'number') x = hAlign;
    else if (hAlign === 'center') x = Math.floor(padX / 2);
    else if (hAlign === 'right') x = padX;
    else x = 0;

    let y: number;
    if (typeof vAlign === 'number') y = vAlign;
    else if (vAlign === 'middle') y = Math.floor(padY / 2);
    else if (vAlign === 'bottom') y = padY;
    else y = 0;

    return { x, y };
  }
}