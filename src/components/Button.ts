import { Component, ComponentOptions } from '../core/Component';

export interface ButtonOptions extends Omit<ComponentOptions, 'width' | 'height'> {
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
    const width = options.width ?? name.length + 4; // padding
    const height = options.height ?? 3;
    super({ ...options, width, height });
    this.name = name;
    this.onClick = onClick;
  }

  handleEvent(event: string): boolean {
    if (event === 'Enter' || event === ' ') {
      if (this.onClick) this.onClick();
      return true;
    }
    return false;
  }

  draw(): string[][] {
    const buffer = super.draw();
    const xOffset = this.border ? 1 : 0;
    const yOffset = this.border ? 1 : 0;
    
    const name = this.hasFocus
      ? `[${this.name}]`
      : ` ${this.name} `;

    const centeredX = Math.max(
      xOffset,
      Math.floor((this.width - name.length) / 2)
    );

    for (let i = 0; i < name.length && i + centeredX < this.width - xOffset; i++) {
      buffer[yOffset][centeredX + i] = name[i];
    }

    this.buffer = buffer;
    this.dirty = false;
    return buffer;
  }
}