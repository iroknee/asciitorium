import { Component, ComponentProps } from '../core/Component';

export interface ButtonOptions extends Omit<ComponentProps, 'width' | 'height'> {
  name: string;
  onClick?: () => void;
  width?: number;
  height?: number;
  labelAlign?: {
    hAlign?: 'left' | 'center' | 'right';
    vAlign?: 'top' | 'middle' | 'bottom';
  };
}

export class Button extends Component {
  public readonly name: string;
  public readonly onClick?: () => void;
  public readonly labelAlign: ButtonOptions['labelAlign'];

  focusable = true;
  hasFocus = false;

  constructor({ name, onClick, labelAlign, ...options }: ButtonOptions) {
    const width = options.width ?? name.length + 4; // padding
    const height = options.height ?? 3;
    const border = options.border ?? true;
    super({ ...options, width, height, border });

    this.name = name;
    this.onClick = onClick;
    this.labelAlign = labelAlign ?? { hAlign: 'center', vAlign: 'middle' };
  }

  handleEvent(event: string): boolean {
    console.log(`Button handling event: ${event}`);
    if (event === 'Enter' || event === ' ') {
      this.onClick?.();
      return true;
    }
    return false;
  }

  draw(): string[][] {
    const buffer = super.draw();
    const label = this.hasFocus ? `[${this.name}]` : ` ${this.name} `;

    const xOffset = this.border ? 1 : 0;
    const yOffset = this.border ? 1 : 0;
    const contentWidth = this.width - xOffset * 2;
    const contentHeight = this.height - yOffset * 2;

    // Horizontal alignment
    let labelX = xOffset;
    switch (this.labelAlign?.hAlign) {
      case 'right':
        labelX += Math.max(contentWidth - label.length, 0);
        break;
      case 'center':
        labelX += Math.max(Math.floor((contentWidth - label.length) / 2), 0);
        break;
      case 'left':
      default:
        labelX += 0;
        break;
    }

    // Vertical alignment
    let labelY = yOffset;
    switch (this.labelAlign?.vAlign) {
      case 'bottom':
        labelY += Math.max(contentHeight - 1, 0);
        break;
      case 'middle':
        labelY += Math.max(Math.floor(contentHeight / 2), 0);
        break;
      case 'top':
      default:
        labelY += 0;
        break;
    }

    for (let i = 0; i < label.length && labelX + i < this.width - xOffset; i++) {
      buffer[labelY][labelX + i] = label[i];
    }

    this.buffer = buffer;
    this.dirty = false;
    return buffer;
  }
}