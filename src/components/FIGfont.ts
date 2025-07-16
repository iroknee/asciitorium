import { Component } from './Component';

export class FIGfont extends Component {
  public readonly width: number;
  public readonly height: number;
  private readonly lines: string[];

  constructor(text: string, fontData: string) {
    super();

    this.lines = renderFigletLines(text, fontData);
    this.height = this.lines.length;
    this.width = Math.max(...this.lines.map(line => line.length));
  }

  draw(): string {
    return this.lines.join('\n');
  }
}

function renderFigletLines(text: string, fontData: string): string[] {
  const lines = fontData.split('\n');

  // Parse header
  const header = lines[0];
  const [signature, heightStr, , , , commentLinesStr] = header.split(' ');
  const hardblank = signature[signature.length - 1];
  const height = parseInt(heightStr, 10);
  const commentLines = parseInt(commentLinesStr, 10);

  const glyphLines = lines.slice(commentLines + 1);

  // Build character map
  const glyphMap = new Map<number, string[]>();
  let i = 0;
  for (let ascii = 32; i < glyphLines.length; ascii++) {
    const glyph = glyphLines.slice(i, i + height).map(line =>
      line
        .replace(new RegExp(`\\${hardblank}`, 'g'), ' ') // hardblank -> space
        .replace(/\r/g, '')                               // remove carriage return
        .replace(/@+$/, '')                               // strip trailing @s
    );
    glyphMap.set(ascii, glyph);
    i += height;
  }

  const output = Array.from({ length: height }, () => '');

  for (const char of text) {
    const code = char.charCodeAt(0);
    const glyph = glyphMap.get(code) || glyphMap.get(63); // fallback to '?'
    if (!glyph) continue;
    for (let row = 0; row < height; row++) {
      output[row] += glyph[row];
    }
  }

  return output;
}