import { Component, ComponentProps } from '../core/Component';
import { LayoutType } from '../core/layouts/Layout';

export interface BoxOptions extends Omit<ComponentProps, 'width' | 'height'> {
  layout?: LayoutType;
  width?: number;
  height?: number;
}

export class Box extends Component {
  constructor(options: BoxOptions) {
    // Calculate auto-dimensions from children if not provided
    const autoWidth =
      options.width ?? Box.calculateAutoWidth(options.children, options.layout);
    const autoHeight =
      options.height ??
      Box.calculateAutoHeight(options.children, options.layout);

    // Account for border if present (add 2 for left+right or top+bottom)
    const borderAdjustment = options.border ? 2 : 0;
    const finalWidth = options.width ?? autoWidth + borderAdjustment;
    const finalHeight = options.height ?? autoHeight + borderAdjustment;

    super({
      ...options,
      width: finalWidth,
      height: finalHeight,
      layout: options.layout ?? 'vertical', // Default to vertical layout
    });
  }

  private static calculateAutoWidth(
    children?: Component[],
    layout?: LayoutType
  ): number {
    if (!children || children.length === 0) return 1;

    if (layout === 'horizontal') {
      // Sum widths + gaps for horizontal layout
      return children.reduce((sum, child) => sum + child.width + child.gap, 0);
    } else {
      // Max width for vertical layout
      return Math.max(...children.map((child) => child.width));
    }
  }

  private static calculateAutoHeight(
    children?: Component[],
    layout?: LayoutType
  ): number {
    if (!children || children.length === 0) return 1;

    if (layout === 'vertical') {
      // Sum heights + gaps for vertical layout
      return children.reduce((sum, child) => sum + child.height + child.gap, 0);
    } else {
      // Max height for horizontal layout
      return Math.max(...children.map((child) => child.height));
    }
  }

  draw(): string[][] {
    return super.draw(); // Uses Component's built-in rendering with children support
  }
}
