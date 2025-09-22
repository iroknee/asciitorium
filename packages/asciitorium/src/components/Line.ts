import { Component, ComponentProps } from '../core/Component';

export interface LineOptions extends ComponentProps {
  direction?: 'horizontal' | 'vertical';
  length?: number; // For backward compatibility, maps to width/height
  char?: string;   // Optional custom character
}

export class Line extends Component {
  private direction: 'horizontal' | 'vertical';
  private lineChar: string;

  constructor(options: LineOptions = {}) {
    const direction = options.direction ?? 'horizontal';
    const isHorizontal = direction === 'horizontal';

    // Determine dimensions based on direction
    const width = isHorizontal
      ? (options.width ?? options.style?.width ?? options.length ?? 'fill')
      : 1;
    const height = isHorizontal
      ? 1
      : (options.height ?? options.style?.height ?? options.length ?? 'fill');

    super({
      ...options,
      width,
      height,
    });

    this.direction = direction;
    this.lineChar = options.char ?? (isHorizontal ? '⎻' : '|');
  }

  draw(): string[][] {
    super.draw();

    if (this.direction === 'horizontal') {
      const y = 0;
      const xStart = this.border ? 1 : 0;
      const xEnd = this.border ? this.width - 1 : this.width;

      for (let x = xStart; x < xEnd; x++) {
        this.buffer[y][x] = this.lineChar;
      }
    } else {
      const x = 0;
      const yStart = this.border ? 1 : 0;
      const yEnd = this.border ? this.height - 1 : this.height;

      for (let y = yStart; y < yEnd; y++) {
        this.buffer[y][x] = this.lineChar;
      }
    }

    return this.buffer;
  }
}