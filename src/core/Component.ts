
export interface ComponentOptions {
  label?: string,
  width: number,
  height: number,
  border?: boolean,
  fill?: string
}

export abstract class Component {
  public label: string | undefined;
  public width: number;
  public height: number;
  public border: boolean;
  public fill: string;
  protected buffer: string[][];
  public dirty: boolean;

  focusable: boolean = false;
  hasFocus: boolean = false;

  constructor(options: ComponentOptions) {
    if (options.width < 1) throw new Error('Component width must be greater than zero.');
    if (options.height < 1) throw new Error('Component height must be greater than zero.');
    this.width = options.width;
    this.height = options.height;
    this.label = options.label;
    this.border = options.border || false;
    this.fill = options.fill || ' ';
    this.buffer = new Array();
    this.dirty = true;
  }

  handleEvent(event: string): boolean {
    return false;
  }

  draw(): string[][] {

    if (this.dirty) {
      // 0. Build 2d array with fill char
      this.buffer = Array.from({ length: this.height }, () =>
        Array(this.width).fill(this.fill)
      );

      const drawChar = (x: number, y: number, char: string) => {
        if (x >= 0 && x < this.width && y >= 0 && y < this.height) {
          this.buffer[y][x] = char;
        }
      };

      // 1. Draw border if enabled
      if (this.border) {
        const w = this.width;
        const h = this.height;

        if (this.hasFocus) {
          drawChar(0, 0, '◆');
        } else {
          drawChar(0, 0, '╭');
        } 
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

      // 2. Draw label (overrides border top row if needed)
      if (this.label) {
        const label = this.hasFocus ? ` ${this.label} ` : ` ${this.label} `;
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
