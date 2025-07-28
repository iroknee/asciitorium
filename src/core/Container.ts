import { Component, ComponentOptions } from './Component';
import {
  FixedPositionComponent,
  AddComponentLayout,
  HorizontalAlign,
  VerticalAlign,
} from './types';

export class Container extends Component {
  children: FixedPositionComponent[] = [];

  constructor(options: ComponentOptions) {
    super(options);
  }

  add({
    component,
    alignX = 'center',
    alignY = 'center',
    alignZ = 0,
  }: AddComponentLayout): void {
    const borderPad = this.border ? 1 : 0;

    const resolveAlign = (
      align: HorizontalAlign | VerticalAlign,
      containerSize: number,
      itemSize: number
    ): number => {
      if (typeof align === 'number') return borderPad + align;
      switch (align) {
        case 'left':
        case 'top':
          return borderPad;
        case 'right':
        case 'bottom':
          return containerSize - itemSize - borderPad;
        case 'center':
        default:
          return Math.floor((containerSize - itemSize) / 2);
      }
    };

    const x = resolveAlign(alignX, this.width, component.width);
    const y = resolveAlign(alignY, this.height, component.height);

    if (
      component.width > this.width - 2 * borderPad ||
      component.height > this.height - 2 * borderPad
    ) {
      throw new Error(`Component does not fit within layout '${this.label}'`);
    }

    this.children.push({ component, x, y, z: alignZ });
    this.dirty = true;
  }

  remove(component: Component): void {
    const originalLength = this.children.length;
    this.children = this.children.filter(
      (child) => child.component !== component
    );
    if (this.children.length !== originalLength) {
      this.dirty = true;
    }
  }

  draw(): string[][] {
    // Check if any child is dirty
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
      // Base rendering: fill, border, label
      super.draw();

      // Draw children
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

        this.dirty = false;
      }
      return this.buffer;
    }
  }
}
