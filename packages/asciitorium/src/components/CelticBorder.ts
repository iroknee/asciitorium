import { Component, ComponentProps } from '../core/Component';

export type CelticEdge =
  | 'top-left'
  | 'top-right'
  | 'bottom-left'
  | 'bottom-right';

// Base pattern to rotate from
const basePattern = [
  '╭⎯╮╭⎯⎯⎯⎯⎯', 
  '⏐╭⎯⎯⎯⎯', 
  '╰⎯⏐╯', 
  '╭⏐╯', 
  '⏐⏐', 
  '⏐⏐', 
  '⏐', 
  '⏐',
  '⏐'
];

// Rotation functions
function rotatePattern90(pattern: string[]): string[] {
  const maxLen = Math.max(...pattern.map(line => line.length));
  const result: string[] = [];
  
  for (let x = 0; x < maxLen; x++) {
    let newLine = '';
    for (let y = pattern.length - 1; y >= 0; y--) {
      const char = pattern[y][x] || ' ';
      newLine += rotateChar90(char);
    }
    result.push(newLine);
  }
  
  // Remove trailing empty/whitespace-only lines
  while (result.length > 0 && result[result.length - 1].trim() === '') {
    result.pop();
  }
  
  return result;
}

function rotateChar90(char: string): string {
  const rotationMap: Record<string, string> = {
    '╭': '╮',
    '╮': '╯',
    '╯': '╰',
    '╰': '╭',
    '─': '│',
    '│': '─',
    '⎯': '⏐',
    '⏐': '⎯',
    ' ': ' '
  };
  return rotationMap[char] || char;
}

// Generate all patterns from base
const topRight = rotatePattern90(basePattern);
const bottomRight = rotatePattern90(rotatePattern90(basePattern));
const bottomLeft = rotatePattern90(rotatePattern90(rotatePattern90(basePattern)));


const borderPatterns: Record<CelticEdge, string[]> = {
  'top-left': basePattern,
  'top-right': topRight,
  'bottom-right': bottomRight,
  'bottom-left': bottomLeft,
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
    } else if (
      options.align &&
      typeof options.align === 'string' &&
      options.align in borderPatterns
    ) {
      selectedEdge = options.align as CelticEdge;
    } else {
      throw new Error(
        'CelticBorder requires either an "edge" property or an "align" property that is one of: top-left, top-right, bottom-left, bottom-right'
      );
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
