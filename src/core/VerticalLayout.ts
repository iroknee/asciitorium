import { Component, ComponentProps } from './Component';
import { FixedPositionComponent } from './types';
import { resolveAlignment } from './layoutUtils';

export interface VerticalLayoutProps extends ComponentProps {
  fit?: boolean;
  children?: Component[];
}

export class VerticalLayout extends Component {
  children: FixedPositionComponent[] = [];
  fit?: boolean;

  constructor(props: VerticalLayoutProps) {
    super(props);
    this.fit = props.fit;

    if (props.children) {
      const list = Array.isArray(props.children) ? props.children : [props.children];
      for (const child of list) {
        this.addChild(child);
      }
    }
  }

  public addChild(child: Component): void {
    const borderPad = this.border ? 1 : 0;

    // Default width if not provided
    if (!child.width) {
      child.width = this.width - 2 * borderPad;
    }

    // Add placeholder, positions will be recalculated
    this.children.push({ component: child, x: 0, y: 0, z: 0 });
    this.recalculateLayout();
    this.dirty = true;
  }

  public removeChild(child: Component): void {
    const index = this.children.findIndex((c) => c.component === child);
    if (index !== -1) {
      this.children.splice(index, 1);
      this.recalculateLayout();
      this.dirty = true;
    }
  }

  private recalculateLayout(): void {
    const borderPad = this.border ? 1 : 0;
    const innerWidth = this.width - 2 * borderPad;
    const innerHeight = this.height - 2 * borderPad;
    const count = this.children.length;

    let currentY = borderPad;

    for (const entry of this.children) {
      const child = entry.component;

      // Fit mode: force equal height
      if (this.fit && count > 0) {
        child.height = Math.floor(innerHeight / count);
      }

      // Default width if missing
      if (!child.width) {
        child.width = innerWidth;
      }

      // Resolve alignment (x is aligned horizontally within innerWidth)
      const { x } = resolveAlignment(child.align, innerWidth, child.height, child.width, child.height);

      entry.x = borderPad + x;
      entry.y = currentY;

      currentY += child.height;
    }
  }

  draw(): string[][] {
    const needsRedraw = this.children.some((c) => c.component.dirty);
    if (needsRedraw) this.dirty = true;

    if (this.dirty) {
      this.recalculateLayout();
      super.draw();

      const sortedChildren = [...this.children].sort((a, b) => a.z - b.z);
      for (const { component, x, y } of sortedChildren) {
        const childBuffer = component.draw();
        for (let j = 0; j < childBuffer.length; j++) {
          for (let i = 0; i < childBuffer[j].length; i++) {
            const px = x + i;
            const py = y + j;
            if (px >= 0 && px < this.width && py >= 0 && py < this.height) {
              this.buffer[py][px] = childBuffer[j][i];
            }
          }
        }
      }

      this.dirty = false;
    }

    return this.buffer;
  }
}