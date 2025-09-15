import { Component, ComponentProps } from '../core/Component';

export interface HROptions extends ComponentProps {
}

export class HR extends Component {

  constructor(options: HROptions = {}) {
    // Extract width from style object if present, with precedence order:
    // 1. Direct width prop 2. Style width 3. Default value
    const resolvedWidth = options.width ?? options.style?.width ?? 'fill';
    
    super({
      ...options,
      width: resolvedWidth,
      height: 1, // Always one line tall
    });

  }

  draw(): string[][] {
    super.draw(); // Prepares buffer, border, label, etc.

    const lineChar = '⎻'; // Unicode character for horizontal line
    const y = 0;
    const xStart = this.border ? 1 : 0;
    const xEnd = this.border ? this.width - 1 : this.width;

    for (let x = xStart; x < xEnd; x++) {
      this.buffer[y][x] = lineChar;
    }

    return this.buffer;
  }
}
