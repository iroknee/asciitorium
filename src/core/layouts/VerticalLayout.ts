import { Layout, LayoutProps } from './Layout';
import { resolveAlignment } from '../utils';

export interface VerticalLayoutProps extends LayoutProps {
  fit?: boolean;
}

export class VerticalLayout extends Layout {
  private fit?: boolean;

  constructor(props: VerticalLayoutProps) {
    super(props);
    this.fit = props.fit;
  }

  protected override recalculateLayout(): void {
    const borderPad = this.border ? 1 : 0;
    const innerWidth = this.width - 2 * borderPad;
    const innerHeight = this.height - 2 * borderPad;
    const count = this.children.length;

    let currentY = borderPad;

    for (const child of this.children) {
      if (this.fit && count > 0) {
        child.height = Math.floor(innerHeight / count);
      }

      if (!child.width) {
        child.width = innerWidth;
      }

      const { x } = resolveAlignment(
        child.align,
        innerWidth,
        child.height,
        child.width,
        child.height
      );

      child.x = borderPad + x;
      child.y = currentY;

      currentY += child.height;
    }
  }
}
