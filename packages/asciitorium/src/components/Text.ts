import { Component, ComponentProps } from '../core/Component';
import type { State } from '../core/State';
import { isState, resolveAlignment } from '../core/utils';
import { Alignment } from 'core/types';

export interface TextOptions extends Omit<ComponentProps, 'height' | 'width' | 'children'> {
  content?: string | State<any>;
  value?: string | State<any>; // deprecated: use content instead
  height?: number;
  width?: number;
  align?: Alignment;
  children?: (string | State<any>) | (string | State<any>)[];
}

export class Text extends Component {
  private source: string | State<any>;

  constructor(options: TextOptions) {
    // Support both new content prop and legacy value prop
    // Also support JSX children syntax
    let actualContent = options.content || options.value;
    
    if (!actualContent && options.children) {
      const children = Array.isArray(options.children) ? options.children : [options.children];
      if (children.length > 0) {
        actualContent = children[0];
      }
    }
    
    if (!actualContent) {
      throw new Error('Text component requires either content prop, value prop (deprecated), or children');
    }

    const rawValue = isState(actualContent)
      ? (actualContent as State<any>).value
      : actualContent;

    const contentLength = Math.max(1, String(rawValue).length); // <- enforce min width
    const borderPadding = options.border ? 2 : 0;

    const { children, content, value, ...componentProps } = options;
    super({
      ...componentProps,
      width: options.width ?? contentLength + borderPadding,
      height: options.height ?? 1 + (options.border ? 2 : 0),
    });

    this.source = actualContent;

    // If reactive, subscribe to changes
    if (isState(this.source)) {
      (this.source as State<any>).subscribe(() => {
        //this.markDirty();
      });
    }
  }

  get value(): string {
    return isState(this.source)
      ? String((this.source as State<any>).value)
      : String(this.source);
  }

  draw(): string[][] {
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

    return this.buffer;
  }
}
