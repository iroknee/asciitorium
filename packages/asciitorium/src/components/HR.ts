import { Component, ComponentProps } from '../core/Component';

export interface HROptions extends ComponentProps {
}

export class HR extends Component {

  constructor(options: HROptions = {}) {
    super({
      ...options,
      width: options.width ?? 12, // Default width if not specified
      height: 1, // Always one line tall
    });

  }

  draw(): string[][] {
    super.draw(); // Prepares buffer, border, label, etc.

    const lineChar = '―';
    const y = 0;
    const xStart = this.border ? 1 : 0;
    const xEnd = this.border ? this.width - 1 : this.width;

    for (let x = xStart; x < xEnd; x++) {
      this.buffer[y][x] = lineChar;
    }

    return this.buffer;
  }
}
