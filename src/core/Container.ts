import { Component } from './Component';
import {
  FixedPositionComponent,
  AddComponentLayout,
  HorizontalAlign,
  VerticalAlign,
} from '../components/types';

export interface ContainerOptions {
  label?: string;
  width: number;
  height: number;
  border?: boolean;
  fill?: string;
}

export class Container extends Component {
  label?: string;
  readonly width: number;
  readonly height: number;
  readonly border: boolean;
  readonly fill: string;
  children: FixedPositionComponent[] = [];

  constructor({
    label,
    width,
    height,
    border = false,
    fill = ' ',
  }: ContainerOptions) {
    super();
    this.label = label;
    this.width = width;
    this.height = height;
    this.border = border;
    this.fill = fill;
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
  }

  remove(component: Component): void {
    this.children = this.children.filter(
      (child) => child.component !== component
    );
  }

  draw(): string[][] {
    const buffer: string[][] = Array.from({ length: this.height }, () =>
      Array(this.width).fill(this.fill)
    );

    const drawChar = (x: number, y: number, char: string) => {
      if (x >= 0 && x < this.width && y >= 0 && y < this.height) {
        buffer[y][x] = char;
      }
    };

    // 1. Draw border if enabled
    if (this.border) {
      const w = this.width;
      const h = this.height;

      drawChar(0, 0, '╭');
      drawChar(w - 1, 0, '╮');
      drawChar(0, h - 1, '╰');
      drawChar(w - 1, h - 1, '╯');

      for (let x = 1; x < w - 1; x++) {
        drawChar(x, 0, '─');
        drawChar(x, h - 1, '─');
      }
      for (let y = 1; y < h - 1; y++) {
        drawChar(0, y, '│');
        drawChar(w - 1, y, '│');
      }
    }

    // 2. Draw label (overrides border top row if needed)
    if (this.label) {
      const label = this.hasFocus ? `< ${this.label} >` : ` ${this.label} `;
      const start = 1;
      for (let i = 0; i < label.length && i + start < this.width - 1; i++) {
        drawChar(i + start, 0, label[i]);
      }
    }

    // 3. Draw children (sorted by z-index)
    const sortedChildren = [...this.children].sort((a, b) => a.z - b.z);
    const offset = this.border ? 1 : 0;

    for (const { component, x, y } of sortedChildren) {
      const childBuffer = component.draw();
      for (let j = 0; j < childBuffer.length; j++) {
        for (let i = 0; i < childBuffer[j].length; i++) {
          const px = x + i;
          const py = y + j;
          drawChar(px, py, childBuffer[j][i]);
        }
      }
    }

    return buffer;
  }
}
