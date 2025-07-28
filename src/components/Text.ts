import { Component, ComponentOptions } from '../core/Component';

export interface TextOptions
  extends Omit<ComponentOptions, 'height' | 'width'> {
  text: string;
}

export class Text extends Component {
  public text: string;

  constructor(options: TextOptions) {
    const textString = options.text;
    const width = textString.length;

    super({
      ...options,
      width,
      height: 1
    });

    this.text = textString;
  }

  draw(): string[][] {
    if (this.dirty) {
      super.draw(); // handles fill/border/etc.

      const text = this.text;
      for (let i = 0; i < text.length && i < this.width; i++) {
        this.buffer[0][i] = text[i];
      }

      this.dirty = false;
    }

    return this.buffer;
  }
}
