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
  edge?: CelticEdge;
}

export class CelticBorder extends Component {
  private lines: string[][];

  constructor({ edge, ...options }: CelticBorderOptions) {
    // Use edge if provided, otherwise use align if it's a valid CelticEdge
    let selectedEdge: CelticEdge;
    if (edge) {
      selectedEdge = edge;
    } else if (options.align && typeof options.align === 'string' && options.align in borderPatterns) {
      selectedEdge = options.align as CelticEdge;
    } else {
      throw new Error('CelticBorder requires either an "edge" property or an "align" property that is one of: top-left, top-right, bottom-left, bottom-right');
    }

    const pattern = borderPatterns[selectedEdge];
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
