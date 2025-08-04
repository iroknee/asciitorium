import { Alignment } from './types';
import type { State } from './State';
import type { Asciitorium } from './Asciitorium';

export interface ComponentProps {
  label?: string;
  width: number;
  height: number;
  border?: boolean;
  fill?: string;
  align?: Alignment;
  bind?: State<any> | ((state: State<any>) => void);
  fixed?: boolean;
  x?: number;
  y?: number;
  z?: number;
}

export abstract class Component {
  public label: string | undefined;
  public width: number;
  public height: number;
  public border: boolean;
  public fill: string;
  public align?: Alignment;
  public fixed: boolean = false;
  public x = 0;
  public y = 0;
  public z = 0;

  public focusable: boolean = false;
  public hasFocus: boolean = false;
  public dirty: boolean = true;
  public transparentChar = '‽'; // ‽ = transparent character

  protected buffer: string[][];
  private unbindFns: (() => void)[] = [];
  protected app?: Asciitorium;

  constructor(props: ComponentProps) {
    if (props.width < 1) throw new Error('Component width must be > 0');
    if (props.height < 1) throw new Error('Component height must be > 0');

    this.width = props.width;
    this.height = props.height;
    this.label = props.label;
    this.border = props.border ?? false;
    this.fill = props.fill ?? ' ';
    this.align = props.align;
    this.fixed = props.fixed ?? false;
    this.x = props.x ?? 0;
    this.y = props.y ?? 0;
    this.z = props.z ?? 0;
    this.buffer = [];
  }

  setApp(app: Asciitorium) {
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

    // Bubble up to parent app/layout if available
    if (this.app && typeof this.app.markDirty === 'function') {
      this.app.markDirty();
    }
  }

  handleEvent(event: string): boolean {
    return false;
  }

  draw(): string[][] {
    if (!this.dirty) return this.buffer;

    // Create buffer and fill only if not transparent
    this.buffer = Array.from({ length: this.height }, () =>
      Array.from({ length: this.width }, () =>
        this.fill === this.transparentChar ? '‽' : this.fill
      )
    );

    const drawChar = (x: number, y: number, char: string) => {
      if (x >= 0 && x < this.width && y >= 0 && y < this.height) {
        this.buffer[y][x] = char;
      }
    };

    if (this.border) {
      const w = this.width;
      const h = this.height;

      drawChar(0, 0, '╭');
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
      const start = 1;
      for (let i = 0; i < label.length && i + start < this.width - 1; i++) {
        drawChar(i + start, 0, label[i]);
      }
    }

    this.dirty = false;
    return this.buffer;
  }
}
