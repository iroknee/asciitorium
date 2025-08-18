import type { Component } from '../Component';
import { Layout, LayoutOptions } from './Layout';
import type { Alignment } from '../types';

export class VerticalLayout implements Layout {
  private fit: boolean;

  constructor(options?: LayoutOptions) {
    this.fit = options?.fit ?? false;
  }

  layout(parent: Component, children: Component[]): void {
    const borderPad = parent.border ? 1 : 0;
    const innerWidth = parent.width - 2 * borderPad;
    const innerHeight = parent.height - 2 * borderPad;
    const count = children.length;

    let currentY = borderPad;

    for (const child of children) {
      if (child.fixed) {
        continue; // Skip positioning if component is fixed
      }

      if (this.fit && count > 0) {
        child.height = Math.floor(innerHeight / count);
      }

      if (!child.width) {
        child.width = innerWidth;
      }

      const { x } = this.resolveAlignment(
        child.align,
        innerWidth,
        child.height,
        child.width,
        child.height
      );

      child.x = borderPad + x;
      child.y = currentY;

      currentY += child.height + child.gap;
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
      // For vertical layout, alignment affects horizontal positioning
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
