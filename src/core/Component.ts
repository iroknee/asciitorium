import { Alignment } from './types';
import type { State } from './State';
import type App from './App';

export interface ComponentProps {
  label?: string;
  width: number;
  height: number;
  border?: boolean;
  fill?: string;
  align?: Alignment;
  bind?: State<any> | ((state: State<any>) => void);
}

export abstract class Component {
  public label: string | undefined;
  public width: number;
  public height: number;
  public border: boolean;
  public fill: string;
  protected buffer: string[][];
  public dirty: boolean;
  public align?: Alignment;

  focusable = false;
  hasFocus = false;

  constructor(props: ComponentProps) {
    if (props.width < 1)
      throw new Error('Component width must be greater than zero.');
    if (props.height < 1)
      throw new Error('Component height must be greater than zero.');

    this.width = props.width;
    this.height = props.height;
    this.label = props.label;
    this.border = props.border || false;
    this.fill = props.fill || ' ';
    this.align = props.align;
    this.buffer = [];
    this.dirty = true;
  }

  private unbindFns: (() => void)[] = [];
  protected app?: App;

  setApp(app: App) {
    this.app = app;
  }

  bind<T>(state: State<T>, apply: (val: T) => void): void {
    const listener = (val: T) => {
      apply(val);
      this.markDirty();
      this.app?.render();
    };

    state.subscribe(listener);
    this.unbindFns.push(() => state.unsubscribe(listener));
  }

  destroy(): void {
    for (const unbind of this.unbindFns) unbind();
    this.unbindFns = [];
  }

  markDirty(): void {
    this.dirty = true;
  }

  // later consumers can call:
  // const { x, y } = resolveAlignment(child.align, containerWidth, containerHeight, child.width, child.height)

  handleEvent(event: string): boolean {
    return false;
  }

  draw(): string[][] {
    if (this.dirty) {
      this.buffer = Array.from({ length: this.height }, () =>
        Array(this.width).fill(this.fill)
      );

      const drawChar = (x: number, y: number, char: string) => {
        if (x >= 0 && x < this.width && y >= 0 && y < this.height) {
          this.buffer[y][x] = char;
        }
      };

      if (this.border) {
        const w = this.width;
        const h = this.height;

        drawChar(0, 0, this.hasFocus ? '◆' : '╭');
        drawChar(w - 1, 0, '╮');
        drawChar(0, h - 1, '╰');
        drawChar(w - 1, h - 1, '╯');

        for (let x = 1; x < w - 1; x++) {
          drawChar(x, 0, '─');
          drawChar(x, h - 1, '─');
        }
        for (let y = 1; y < h - 1; y++) {
          drawChar(0, y, '│');
          drawChar(w - 1, y, '│');
        }
      }

      if (this.label) {
        const label = ` ${this.label} `;
        const start = 2;
        for (let i = 0; i < label.length && i + start < this.width - 1; i++) {
          drawChar(i + start, 0, label[i]);
        }
      }

      this.dirty = false;
    }

    return this.buffer;
  }
}
