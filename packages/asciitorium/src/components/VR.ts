import { Component, ComponentProps } from '../core/Component';

export interface VROptions extends Omit<ComponentProps, 'width'> {
  length?: number; // optional alias for height (deprecated, use height instead)
}

export class VR extends Component {
  constructor(options: VROptions) {
    // Extract height from style object if present, with precedence order:
    // 1. Direct height prop 2. Style height 3. Legacy length prop 4. Default value
    const resolvedHeight = options.height ?? options.style?.height ?? 'fill';

    super({
      ...options,
      width: 1, // Always one character wide
      height: resolvedHeight,
    });
  }

  draw(): string[][] {
    super.draw(); // Prepares buffer, border, label, etc.

    const lineChar = '|';
    const x = 0;
    const yStart = this.border ? 1 : 0;
    const yEnd = this.border ? this.height - 1 : this.height;

    for (let y = yStart; y < yEnd; y++) {
      this.buffer[y][x] = lineChar;
    }

    return this.buffer;
  }
}
