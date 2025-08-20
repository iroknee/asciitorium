import { Component, ComponentProps } from '../core/Component';

export interface VROptions extends Omit<ComponentProps, 'width' | 'height'> {
  length?: number; // optional alias for height
}

export class VR extends Component {
  constructor(options: VROptions) {
    const resolvedHeight = options.length ?? 12;

    super({
      ...options,
      width: 1, // Always one character wide
      height: resolvedHeight,
    });
  }

  draw(): string[][] {
    super.draw(); // Prepares buffer, border, label, etc.

    const lineChar = '│';
    const x = 0;
    const yStart = this.border ? 1 : 0;
    const yEnd = this.border ? this.height - 1 : this.height;

    for (let y = yStart; y < yEnd; y++) {
      this.buffer[y][x] = lineChar;
    }

    return this.buffer;
  }
}
