import { Component, ComponentProps } from '../core/Component';

export interface ButtonOptions
  extends Omit<ComponentProps, 'width' | 'height'> {
  name: string;
  onClick?: () => void;
  width?: number;
  height?: number;
}

export class Button extends Component {
  public readonly name: string;
  public readonly onClick?: () => void;

  focusable = true;
  hasFocus = false;

  constructor({ name, onClick, ...options }: ButtonOptions) {
    const width = options.width ?? name.length + 6; // padding
    const height = options.height ?? 3;
    const border = options.border ?? true;
    super({ ...options, width, height, border });

    this.name = name;
    this.onClick = onClick;
  }

  handleEvent(event: string): boolean {
    if (event === 'Enter' || event === ' ') {
      this.onClick?.();
      return true;
    }
    return false;
  }
  override draw(): string[][] {
    const buffer = super.draw();

    const padX = this.border ? 1 : 0;
    const padY = this.border ? 1 : 0;

    const contentWidth = this.width - padX * 2;
    const contentHeight = this.height - padY * 2;

    // Calculate label placement (centered)
    const label = this.name;
    const labelX =
      padX + Math.max(Math.floor((contentWidth - label.length) / 2), 0);
    const labelY = padY + Math.floor(contentHeight / 2);

    // Write the label centered
    for (let i = 0; i < label.length && labelX + i < this.width - padX; i++) {
      buffer[labelY][labelX + i] = label[i];
    }

    // If focused, draw '>' in first visible column of content area
    if (this.hasFocus) {
      const indicatorX = padX; // 1st char inside content
      buffer[labelY][indicatorX] = '>';
    }

    this.buffer = buffer;
    this.dirty = false;
    return buffer;
  }
}
