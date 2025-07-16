import { Component } from './Component';

// Types for component layout and alignment
export type HorizontalAlign = 'left' | 'center' | 'right' | number;
export type VerticalAlign = 'top' | 'center' | 'bottom' | number;

export interface LayoutOptions {
  label?: string;
  width: number;
  height: number;
  border?: boolean;
  fill?: string;
}

interface AddComponentOptions {
  component: Component;
  alignX: HorizontalAlign;
  alignY: VerticalAlign;
}

interface PositionedComponent {
  component: Component;
  x: number;
  y: number;
}

export class Layout extends Component {
  label?: string;
  readonly width: number;
  readonly height: number;
  readonly border: boolean;
  readonly fill: string;
  private hasFocus = false;
  children: PositionedComponent[] = [];

  constructor({
    label,
    width,
    height,
    border = false,
    fill = ' ',
  }: LayoutOptions) {
    super();
    this.label = label;
    this.width = width;
    this.height = height;
    this.border = border;
    this.fill = fill;
  }

  add({
    component,
    alignX,
    alignY
  }: AddComponentOptions): void {
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
      throw new Error(`Component ${'label' in component ? component['label'] : 'unknown'} does not fit within parent ${this.label}`);
    }

    this.children.push({ component, x, y });
  }

  remove(component: Component): void {
    this.children = this.children.filter(child => child.component !== component);
  }

  draw(): string {
    const rows: string[][] = [];

    // Fill with base fill character
    for (let y = 0; y < this.height; y++) {
      rows[y] = [];
      for (let x = 0; x < this.width; x++) {
        rows[y][x] = this.fill;
      }
    }

    // Draw label if present
    if (this.label) {
      const label = this.hasFocus
        ? `[* ${this.label} *]`
        : ` ${this.label} `;

      const maxLabelWidth = this.width - 2;
      const truncatedLabel = label.length > maxLabelWidth
        ? label.slice(0, maxLabelWidth)
        : label;

      for (let i = 0; i < truncatedLabel.length; i++) {
        rows[0][i + 1] = truncatedLabel[i];
      }
    }

    // Draw label if present
    if (this.label) {
      const isFocused = this.hasFocus;
      const label = isFocused ? `< ${this.label} >` : ` ${this.label} `;
      for (let i = 0; i < label.length && i + 1 < this.width - 1; i++) {
        rows[0][i + 1] = label[i];
      }
    }
    // Draw children
    for (const { component, x, y } of this.children) {
      const childLines = component.draw().split('\n');
      for (let j = 0; j < childLines.length; j++) {
        const line = childLines[j];
        for (let i = 0; i < line.length; i++) {
          const targetX = x + i;
          const targetY = y + j;
          if (
            targetX >= 0 && targetX < this.width &&
            targetY >= 0 && targetY < this.height
          ) {
            rows[targetY][targetX] = line[i];
          }
        }
      }
    }

    return rows.map(row => row.join('')).join('\n');
  }
}
