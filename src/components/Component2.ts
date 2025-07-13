type ComponentContent = string | string[] | (() => string[]);
type HorizontalAlign = 'left' | 'center' | 'right' | number;
type VerticalAlign = 'top' | 'center' | 'bottom' | number;
type ContentAlignment = HorizontalAlign | { alignX: HorizontalAlign; alignY: VerticalAlign };

interface ComponentOptions {
  label?: string;
  width: number;
  height: number;
  border?: boolean;
  fill?: string;
  content?: ComponentContent;
  contentAlign?: ContentAlignment;
  focusable?: boolean;
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

export class Component {
  label?: string;
  readonly width: number;
  readonly height: number;
  readonly border: boolean;
  readonly fill: string;
  readonly focusable: boolean;
  private content?: ComponentContent;
  readonly contentAlign: ContentAlignment;

  hasFocus = false;
  children: PositionedComponent[] = [];

  constructor({
    label,
    width,
    height,
    border = true,
    fill = ' ',
    content,
    contentAlign = 'center',
    focusable = false
  }: ComponentOptions) {
    this.label = label;
    this.width = width;
    this.height = height;
    this.border = border;
    this.fill = fill;
    this.content = content;
    this.contentAlign = contentAlign;
    this.focusable = focusable;
    if (this.focusable) this.hasFocus = true;
  }

  setContent(content: ComponentContent): void {
    this.content = content;
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
      throw new Error(`Component ${component.label} does not fit within parent ${this.label}`);
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

    // Border rendering
    if (this.border) {
      const isFocused = this.hasFocus;
      const horizontal = isFocused ? '═' : '─';
      const vertical = isFocused ? '║' : '│';
      const tl = isFocused ? '╔' : '╭';
      const tr = isFocused ? '╗' : '╮';
      const bl = isFocused ? '╚' : '╰';
      const br = isFocused ? '╝' : '╯';

      for (let x = 0; x < this.width; x++) {
        rows[0][x] = horizontal;
        rows[this.height - 1][x] = horizontal;
      }
      for (let y = 0; y < this.height; y++) {
        rows[y][0] = vertical;
        rows[y][this.width - 1] = vertical;
      }
      rows[0][0] = tl;
      rows[0][this.width - 1] = tr;
      rows[this.height - 1][0] = bl;
      rows[this.height - 1][this.width - 1] = br;
    }

    // Draw label if present
    if (this.label) {
      const label = ` ${this.label} `;
      for (let i = 0; i < label.length && i + 1 < this.width - 1; i++) {
        rows[0][i + 1] = label[i];
      }
    }

    // Render content
    if (this.content) {
      const lines = typeof this.content === 'function'
        ? this.content()
        : typeof this.content === 'string'
          ? [this.content]
          : this.content;

      const borderPad = this.border ? 1 : 0;
      const usableWidth = this.width - 2 * borderPad;

      const alignX = typeof this.contentAlign === 'object' ? this.contentAlign.alignX : this.contentAlign;
      const alignY = typeof this.contentAlign === 'object' ? this.contentAlign.alignY : 'center';

      const resolveAlign = (
        align: HorizontalAlign | VerticalAlign,
        containerSize: number,
        contentSize: number
      ): number => {
        if (typeof align === 'number') return borderPad + align;
        switch (align) {
          case 'left':
          case 'top':
            return borderPad;
          case 'right':
          case 'bottom':
            return containerSize - contentSize - borderPad;
          case 'center':
          default:
            return Math.floor((containerSize - contentSize) / 2);
        }
      };

      const startY = resolveAlign(alignY, this.height, lines.length);
      for (let i = 0; i < lines.length; i++) {
        const line = lines[i].slice(0, usableWidth);
        const rowIdx = startY + i;
        if (rowIdx < 0 || rowIdx >= this.height) continue;

        const startX = resolveAlign(alignX, this.width, line.length);
        for (let j = 0; j < line.length && startX + j < this.width; j++) {
          const colIdx = startX + j;
          if (colIdx >= 0 && colIdx < this.width) {
            rows[rowIdx][colIdx] = line[j];
          }
        }
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