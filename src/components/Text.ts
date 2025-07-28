import { Component, ComponentOptions } from '../core/Component';

export interface TextOptions
  extends Omit<ComponentOptions, 'height' | 'width'> {
  value: string;
}

export class Text extends Component {
  public value: string;

  constructor(options: TextOptions) {
    const textString = options.value;
    const width = textString.length;

    super({
      ...options,
      width,
      height: 1,
    });

    this.value = textString;
  }

  draw(): string[][] {
    if (this.dirty) {
      super.draw(); // handles fill/border/etc.

      const value = this.value;
      for (let i = 0; i < value.length && i < this.width; i++) {
        this.buffer[0][i] = value[i];
      }

      this.dirty = false;
    }

    return this.buffer;
  }
}
