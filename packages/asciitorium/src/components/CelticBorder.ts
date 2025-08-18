import { Component, ComponentProps } from '../core/Component';

export type CelticEdge =
  | 'top-left'
  | 'top-right'
  | 'bottom-left'
  | 'bottom-right';

const borderPatterns: Record<CelticEdge, string[]> = {
  'top-left': ['╭⎯╮╭⎯⎯⎯⎯⎯', '⏐╭⎯⎯⎯⎯', '╰⎯⏐╯', '╭⏐╯', '⏐⏐', '⏐⏐', '⏐', '⏐'],
  'top-right': [
    '⎯⎯⎯⎯╮╭⎯╮',
    ' ⎯⎯⎯⎯⎯╮⏐',
    '    ╰⏐⎯╯',
    '     ╰⏐╮',
    '      ⏐⏐',
    '      ⏐⏐',
    '       ⏐',
    '       ⏐',
  ],
  'bottom-left': ['⏐', '⏐', '⏐⏐', '⏐⏐', '╰⏐╮', '╭⎯⏐╮', '⏐╰⎯⎯⎯⎯⎯', '╰⎯╯╰⎯⎯⎯⎯⎯'],
  'bottom-right': [
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
  edge: CelticEdge;
}

export class CelticBorder extends Component {
  private lines: string[][];

  constructor({ edge: edge, ...options }: CelticBorderOptions) {
    const pattern = borderPatterns[edge];
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
