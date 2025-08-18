import type { Component } from '../Component';
import { Layout, LayoutOptions } from './Layout';
import type { Alignment } from '../types';

export class HorizontalLayout implements Layout {
  private fit: boolean;

  constructor(options?: LayoutOptions) {
    this.fit = options?.fit ?? false;
  }

  layout(parent: Component, children: Component[]): void {
    const borderPad = parent.border ? 1 : 0;
    const innerHeight = parent.height - 2 * borderPad;
    const innerWidth = parent.width - 2 * borderPad;
    const count = children.length;

    let currentX = borderPad;

    for (const child of children) {
      if (child.fixed) continue; // Skip positioning if component is fixed

      if (this.fit && count > 0) {
        child.width = Math.floor(innerWidth / count);
      }

      if (!child.height) {
        child.height = innerHeight;
      }

      const { y } = this.resolveAlignment(
        child.align,
        child.width,
        innerHeight,
        child.width,
        child.height
      );

      child.x = currentX;
      child.y = borderPad + y;

      currentX += child.width + child.gap;
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
      // For horizontal layout, alignment affects vertical positioning
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
