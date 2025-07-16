
import { Component } from "./Component";

export type CelticCorner = 'upperLeft' | 'upperRight' | 'lowerLeft' | 'lowerRight';

const borderPatterns: Record<CelticCorner, string[]> = {
  upperLeft: [
    '╭⎯╮╭⎯⎯⎯⎯⎯',
    '⏐╭⎯⎯⎯⎯',
    '╰⎯⏐╯',
    '╭⏐╯',
    '⏐⏐',
    '⏐⏐',
    '⏐',
    '⏐'
  ],
  upperRight: [
    '⎯⎯⎯⎯╮╭⎯╮',
    ' ⎯⎯⎯⎯⎯╮⏐',
    '    ╰⏐⎯╯',
    '     ╰⏐╮',
    '      ⏐⏐',
    '      ⏐⏐',
    '       ⏐',
    '       ⏐'
  ],
  lowerLeft: [
    '⏐',
    '⏐',
    '⏐⏐',
    '⏐⏐',
    '╰⏐╮',
    '╭⎯⏐╮',
    '⏐╰⎯⎯⎯⎯⎯',
    '╰⎯╯╰⎯⎯⎯⎯⎯'
  ],
  lowerRight: [
    '       ⏐',
    '       ⏐',
    '      ⏐⏐',
    '      ⏐⏐',
    '     ╭⏐╯',
    '    ╭⏐⎯╮',
    '  ⎯⎯⎯⎯╯⏐',
    '⎯⎯⎯⎯╯╰⎯╯'
  ]
};

export class CelticBorder extends Component {
  constructor(
    public readonly corner: CelticCorner,
    public readonly width: number = 8,
    public readonly height: number = 8
  ) {
    super();
    if (!(corner in borderPatterns)) {
      throw new Error(`Invalid corner: ${corner}`);
    }
  }

  draw(): string {
    return borderPatterns[this.corner].join('\n');
  }
}

