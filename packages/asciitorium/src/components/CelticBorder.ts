import { Component, ComponentProps } from '../core/Component';

export type CelticCorner =
  | 'topLeft'
  | 'topRight'
  | 'bottomLeft'
  | 'bottomRight';

const borderPatterns: Record<CelticCorner, string[]> = {
  topLeft: ['╭⎯╮╭⎯⎯⎯⎯⎯', '⏐╭⎯⎯⎯⎯', '╰⎯⏐╯', '╭⏐╯', '⏐⏐', '⏐⏐', '⏐', '⏐'],
  topRight: [
    '⎯⎯⎯⎯╮╭⎯╮',
    ' ⎯⎯⎯⎯⎯╮⏐',
    '    ╰⏐⎯╯',
    '     ╰⏐╮',
    '      ⏐⏐',
    '      ⏐⏐',
    '       ⏐',
    '       ⏐',
  ],
  bottomLeft: ['⏐', '⏐', '⏐⏐', '⏐⏐', '╰⏐╮', '╭⎯⏐╮', '⏐╰⎯⎯⎯⎯⎯', '╰⎯╯╰⎯⎯⎯⎯⎯'],
  bottomRight: [
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

export interface CelticBorderOptions extends Partial<ComponentProps> {
  corner: CelticCorner;
}

export class CelticBorder extends Component {
  private lines: string[][];

  constructor({ corner, ...options }: CelticBorderOptions) {
    const pattern = borderPatterns[corner];
    const width = Math.max(...pattern.map((line) => line.length));
    const height = pattern.length;

    super({
      width,
      height,
      fill: ' ',
      border: false,
      ...options,
    });

    this.lines = pattern.map((line) => Array.from(line));
  }

  override draw(): string[][] {
    this.buffer = Array.from({ length: this.height }, (_, y) =>
      Array.from({ length: this.width }, (_, x) => this.lines[y]?.[x] ?? ' ')
    );
    return this.buffer;
  }
}
