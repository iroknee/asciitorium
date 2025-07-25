import { Component } from '../core/Component';

export interface MarkdownViewerOptions {
  markdown: string;
  visibleIndex?: number;
  width: number;
  height: number;
  border?: boolean;
  fill?: string;
  label?: string;
}

export class MarkdownViewer extends Component {
  markdown: string[];
  visibleIndex: number = 0;
  hasFocus = false;
  readonly width: number;
  readonly height: number;
  readonly border: boolean;
  readonly fill: string;
  readonly focusable: boolean = true;
  readonly label?: string;

  constructor({
    markdown,
    width,
    height,
    border = true,
    fill = ' ',
    label,
  }: MarkdownViewerOptions) {
    super();
    this.width = width;
    this.height = height;
    this.border = border;
    this.fill = fill;
    this.label = label;

    // temp, need to change this later...
    // let lines = wrapText(markdown, this.width - 4)
    let md = [];
    let lines = markdown.split(/\r?\n/);
    for (let i = 0; i < lines.length; i++) {
      let underline = false;
      let line = lines[i];
      // if (line.trim() === '') {
      //   md.push('');
      //   continue;
      // }
      if (line.startsWith('# ')) {
        line = line.substring(2, lines[i].length);
        line = line.toUpperCase();
        underline = true;
      } else if (line.startsWith('## ')) {
        md.push('');
        line = line.substring(3, lines[i].length);
        underline = true;
      } else if (line.startsWith('### ')) {
        md.push('');
        line = line.substring(4, lines[i].length);
        underline = true;
      } else if (line.startsWith('* ') || line.startsWith('- ')) {
        line = ' ◊ ' + line.substring(2, line.length);
      } else if (line.trim().startsWith('```')) {
        continue;
      } else if (line === '---' || line === '===') {
        md.push('―'.repeat(width - 6));
      }
      const wrappedLines = wrapText(line, this.width - 4);
      for (let j = 0; j < wrappedLines.length; j++) {
        md.push(wrappedLines[j]);
      }
      if (underline) {
        md.push('⎺'.repeat(width - 6));
      }
    }

    this.markdown = md;
  }

  setMarkdown(markdown: string, visibleIndex: number = 0): void {
    this.markdown = markdown.split(/\r?\n/);
    this.visibleIndex = visibleIndex;
  }

  handleEvent(event: string): boolean {
    if ((event === 'ArrowUp' || event === 'w') && this.visibleIndex > 0) {
      this.visibleIndex--;
      return true;
    }
    if (
      (event === 'ArrowDown' || event === 's') &&
      this.visibleIndex < this.markdown.length - 1
    ) {
      this.visibleIndex++;
      return true;
    }
    return false;
  }

  draw(): string[][] {
    console.log(this.focusable);
    const rows: string[][] = [];

    // Fill background
    for (let y = 0; y < this.height; y++) {
      rows[y] = [];
      for (let x = 0; x < this.width; x++) {
        rows[y][x] = this.fill;
      }
    }

    // Border rendering
    if (this.border) {
      const horizontal = '─';
      const vertical = '│';
      const tl = '╭';
      const tr = '╮';
      const bl = '╰';
      const br = '╯';

      for (let x = 0; x < this.width; x++) {
        rows[0][x] = horizontal;
        rows[this.height - 1][x] = horizontal;
      }
      for (let y = 0; y < this.height; y++) {
        rows[y][0] = vertical;
        rows[y][this.width - 1] = vertical;
      }
      rows[0][0] = tl;
      rows[0][this.width - 1] = tr;
      rows[this.height - 1][0] = bl;
      rows[this.height - 1][this.width - 1] = br;
    }

    // Draw label if present
    if (this.label) {
      const label = this.hasFocus ? `◆─ ${this.label} ` : `◇─ ${this.label} `;

      const maxLabelWidth = this.width - 2;
      const truncatedLabel =
        label.length > maxLabelWidth ? label.slice(0, maxLabelWidth) : label;

      for (let i = 0; i < truncatedLabel.length; i++) {
        rows[0][i + 1] = truncatedLabel[i];
      }
    }

    // Content rendering with spacing
    const paddingTop = 2;
    const borderPad = this.border ? 1 : 0;
    const lineHeight = 2; // 1 line for item, 1 line blank
    const availableLines = this.height - 2 * borderPad - paddingTop;
    const maxVisibleItems = Math.floor(availableLines / lineHeight);

    const startIdx = Math.max(
      0,
      Math.min(
        this.visibleIndex - Math.floor(maxVisibleItems / 2),
        this.markdown.length - maxVisibleItems
      )
    );

    const visibleItems = this.markdown.slice(
      startIdx,
      startIdx + maxVisibleItems
    );

    // Draw scroll up indicator (if needed)
    if (startIdx > 0) {
      const rowIdx = borderPad;
      const colIdx = Math.floor(this.width - 2);
      if (rowIdx >= 0 && rowIdx < this.height) rows[rowIdx][colIdx] = '↑';
    }

    visibleItems.forEach((item, i) => {
      const rowIdx = borderPad + paddingTop + i * lineHeight;
      if (rowIdx >= this.height - borderPad) return;

      let prefix = startIdx + i === this.visibleIndex ? ' ◇' : '  ';
      if (prefix === ' ◇' && this.hasFocus) prefix = ' ◆';
      const line = (prefix + ' ' + item)
        .slice(0, this.width - 2 * borderPad)
        .padEnd(this.width - 2 * borderPad, ' ');

      for (let j = 0; j < line.length; j++) {
        const colIdx = j + borderPad;
        if (colIdx >= this.width - borderPad) break;
        rows[rowIdx][colIdx] = line[j];
      }
    });

    // Draw scroll down indicator (if needed)
    if (startIdx + maxVisibleItems < this.markdown.length) {
      const rowIdx = this.height - 1 - borderPad;
      const colIdx = Math.floor(this.width - 2);
      if (rowIdx >= 0 && rowIdx < this.height) rows[rowIdx][colIdx] = '↓';
    }

    return rows;
  }
}

// this should account for splitting on \r and \n as well.
function wrapText(text: string, width: number): string[] {
  const words = text.split(/\s+/);
  const lines: string[] = [];
  let current: string = '';
  let len = 0;

  for (const word of words) {
    if (len + word.length + (current.length ? 1 : 0) > width) {
      lines.push(current);
      current = word;
      len = word.length;
    } else {
      if (current.length) current = current + ' ';
      current = current + word;
      len += word.length + (current.length ? 1 : 0);
    }
  }
  if (current.length) lines.push(current);
  return lines;
}
