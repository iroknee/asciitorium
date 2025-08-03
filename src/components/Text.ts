import { Component, ComponentProps } from '../core/Component';
import type { State } from '../core/State';
import { isState, resolveAlignment } from '../core/utils';
import { Alignment } from 'core/types';

export interface TextOptions extends Omit<ComponentProps, 'height' | 'width'> {
  value: string | State<string>;
  height?: number;
  width?: number;
  align?: Alignment;
}

export class Text extends Component {
  private source: string | State<string>;

  constructor(options: TextOptions) {
    const rawValue = isState(options.value)
      ? (options.value as State<string>).value
      : options.value;

    const contentLength = Math.max(1, String(rawValue).length); // <- enforce min width
    const borderPadding = options.border ? 2 : 0;

    super({
      ...options,
      width: options.width ?? contentLength + borderPadding,
      height: options.height ?? 1 + (options.border ? 2 : 0),
    });

    this.source = options.value;

    // If reactive, subscribe to changes
    if (isState(this.source)) {
      (this.source as State<string>).subscribe(() => {
        this.markDirty();
      });
    }
  }

  get value(): string {
    return isState(this.source)
      ? String((this.source as State<string>).value)
      : String(this.source);
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
        1
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
