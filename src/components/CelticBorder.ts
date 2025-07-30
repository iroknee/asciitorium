import { Component, ComponentProps } from '../core/Component';

export type CelticCorner =
  | 'upperLeft'
  | 'upperRight'
  | 'lowerLeft'
  | 'lowerRight';

const borderPatterns: Record<CelticCorner, string[]> = {
  upperLeft: ['╭⎯╮╭⎯⎯⎯⎯⎯', '⏐╭⎯⎯⎯⎯', '╰⎯⏐╯', '╭⏐╯', '⏐⏐', '⏐⏐', '⏐', '⏐'],
  upperRight: [
    '⎯⎯⎯⎯╮╭⎯╮',
    ' ⎯⎯⎯⎯⎯╮⏐',
    '    ╰⏐⎯╯',
    '     ╰⏐╮',
    '      ⏐⏐',
    '      ⏐⏐',
    '       ⏐',
    '       ⏐',
  ],
  lowerLeft: ['⏐', '⏐', '⏐⏐', '⏐⏐', '╰⏐╮', '╭⎯⏐╮', '⏐╰⎯⎯⎯⎯⎯', '╰⎯╯╰⎯⎯⎯⎯⎯'],
  lowerRight: [
    '       ⏐',
    '       ⏐',
    '      ⏐⏐',
    '      ⏐⏐',
    '     ╭⏐╯',
    '    ╭⏐⎯╮',
    '  ⎯⎯⎯⎯╯⏐',
    '⎯⎯⎯⎯╯╰⎯╯',
  ],
};

export class CelticBorder extends Component {
  private lines: string[][];

  constructor(corner: CelticCorner, options?: Partial<ComponentProps>) {
    const pattern = borderPatterns[corner];
    const width = Math.max(...pattern.map((line) => line.length));
    const height = pattern.length;

    super({
      width,
      height,
      border: false,
      fill: ' ',
      ...options,
    });

    this.lines = pattern.map((line) => Array.from(line));
  }

  draw(): string[][] {
    this.buffer = Array.from({ length: this.height }, (_, y) =>
      Array.from({ length: this.width }, (_, x) => this.lines[y]?.[x] ?? ' ')
    );
    this.dirty = false;
    return this.buffer;
  }
}
