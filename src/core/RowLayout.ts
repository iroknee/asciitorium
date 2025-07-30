import { Component, ComponentProps } from './Component';
import { FixedPositionComponent } from './types';

export interface RowLayoutProps extends ComponentProps {
  fit?: boolean;
  children?: Component[];
}

export class RowLayout extends Component {
  children: FixedPositionComponent[] = [];
  fit?: boolean;

  constructor(props: RowLayoutProps) {
    super(props);
    this.fit = props.fit;

    if (props.children) {
      const list = Array.isArray(props.children)
        ? props.children
        : [props.children];
      for (const child of list) {
        this.addChild(child);
      }
    }
  }

  public addChild(child: Component): void {
    const borderPad = this.border ? 1 : 0;

    let x = borderPad;
    let y = borderPad;

    x = borderPad + this.children.reduce((sum, c) => sum + c.component.width, 0);
    if (!child.height) child.height = this.height - 2 * borderPad;

    // Update container size if fit mode is enabled
    if (this.fit) {
      this.width = x + child.width + borderPad;
    }

    if (
      child.width > this.width - 2 * borderPad ||
      child.height > this.height - 2 * borderPad
    ) {
      throw new Error(`Component does not fit within layout '${this.label}'`);
    }

    this.children.push({ component: child, x, y, z: 0 });
    this.dirty = true;
  }

  // Removes a child component
  public removeChild(child: Component): void {
    const index = this.children.findIndex((c) => c.component === child);
    if (index !== -1) {
      this.children.splice(index, 1);
      this.dirty = true;
    }
  }

  draw(): string[][] {
    let anyChildDirty = false;
    for (const { component } of this.children) {
      if (component.dirty) {
        anyChildDirty = true;
        break;
      }
    }
    if (anyChildDirty) {
      this.dirty = true;
    }

    if (this.dirty) {
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
