import { Component, ComponentProps } from '../core/Component';
import { Alignment } from 'core/types';
import { resolveAlignment } from '../core/layoutUtils';

export interface TextOptions extends Omit<ComponentProps, 'height' | 'width'> {
  value: string;
  height?: number;
  width?: number;
  align?: Alignment;
}

export class Text extends Component {
  public value: string;

  constructor(options: TextOptions) {
    const textString = options.value;

    super({
      ...options,
      width: options.width || textString.length + (options.border ? 2 : 0),
      height: options.height || 1 + (options.border ? 2 : 0),
    });

    this.value = textString;
  }

  draw(): string[][] {
    if (this.dirty) {
      super.draw(); // fills buffer, draws borders, etc.

      const innerWidth = this.width - (this.border ? 2 : 0);
      const innerHeight = this.height - (this.border ? 2 : 0);

      const { x, y } = resolveAlignment(
        this.align,
        innerWidth,
        innerHeight,
        Math.min(this.value.length, innerWidth),
        1 // text is single line
      );

      const drawX = this.border ? x + 1 : x;
      const drawY = this.border ? y + 1 : y;

      for (let i = 0; i < this.value.length && i + drawX < this.width; i++) {
        this.buffer[drawY][drawX + i] = this.value[i];
      }

      this.dirty = false;
    }

    return this.buffer;
  }
}