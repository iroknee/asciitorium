import { Component, ComponentProps } from '../core/Component';

export interface HorizontalLineOptions
  extends Omit<ComponentProps, 'width' | 'height'> {
  length?: number;
}

export class HorizontalLine extends Component {
  constructor(options: HorizontalLineOptions) {
    const resolvedOptions: ComponentProps = {
      ...options,
      width: options.length ?? 12,
      height: 1,
    };

    super(resolvedOptions);
  }

  draw(): string[][] {
    if (this.dirty) {
      super.draw(); // builds buffer and handles border/label/fill

      // Draw line inside buffer (not overriding border if present)
      const xOffset = this.border ? 1 : 0;
      const maxX = this.width - (this.border ? 1 : 0);

      for (let x = xOffset; x < maxX; x++) {
        this.buffer[0][x] = '⎺';
      }

      this.dirty = false;
    }

    return this.buffer;
  }
}
