import { Component, ComponentOptions } from '../core/Component';

export interface MarkdownViewerOptions extends ComponentOptions {
  markdown?: string;
}

export class MarkdownViewer extends Component {
  markdown: string[];
  visibleIndex: number = 0;

  constructor(options: MarkdownViewerOptions) {
    super(options);
    this.focusable = true;
    if (options.markdown) {
      this.setMarkdown(options.markdown);
    } else {
      this.markdown = [];
    }
  }

  setMarkdown(markdown: string): void {
    let md = [];
    let lines = markdown.split(/\r?\n/);
    for (let i = 0; i < lines.length; i++) {
      let underline = false;
      let line = lines[i];
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
        md.push('―'.repeat(this.width - 6));
      }
      const wrappedLines = wrapText(line, this.width - 4);
      for (let j = 0; j < wrappedLines.length; j++) {
        md.push(wrappedLines[j]);
      }
      if (underline) {
        md.push('⎺'.repeat(this.width - 6));
      }
    }

    this.markdown = md;
    this.visibleIndex = 0;
    this.dirty = true;
  }

  handleEvent(event: string): boolean {
    if ((event === 'ArrowUp' || event === 'w') && this.visibleIndex > 0) {
      this.visibleIndex--;
      this.dirty = true;
      return true;
    }
    if (
      (event === 'ArrowDown' || event === 's') &&
      this.visibleIndex < this.markdown.length - 1
    ) {
      this.visibleIndex++;
      this.dirty = true;
      return true;
    }
    return false;
  }

  draw(): string[][] {
    if (this.dirty) {
      super.draw(); // fill, border, label

      const borderPad = this.border ? 1 : 0;
      const paddingTop = 2;
      const lineHeight = 2;
      const availableLines = this.height - 2 * borderPad - paddingTop;
      const maxVisibleItems = Math.floor(availableLines / lineHeight);

      const startIdx = Math.max(
        0,
        Math.min(
          this.visibleIndex - Math.floor(maxVisibleItems / 2),
          Math.max(0, this.markdown.length - maxVisibleItems)
        )
      );

      const visibleItems = this.markdown.slice(
        startIdx,
        startIdx + maxVisibleItems
      );

      // Scroll up indicator
      if (startIdx > 0) {
        const rowIdx = borderPad;
        const colIdx = this.width - 2;
        this.buffer[rowIdx][colIdx] = '↑';
      }

      visibleItems.forEach((item, i) => {
        const rowIdx = borderPad + paddingTop + i * lineHeight;
        if (rowIdx >= this.height - borderPad) return;

        let prefix = startIdx + i === this.visibleIndex ? '◇' : ' ';
        if (prefix === '◇' && this.hasFocus) prefix = '◆';

        const line = ` ${prefix} ${item}`
          .slice(0, this.width - 2 * borderPad)
          .padEnd(this.width - 2 * borderPad, ' ');

        for (let j = 0; j < line.length; j++) {
          const colIdx = j + borderPad;
          if (colIdx >= this.width - borderPad) break;
          this.buffer[rowIdx][colIdx] = line[j];
        }
      });

      // Scroll down indicator
      if (startIdx + maxVisibleItems < this.markdown.length) {
        const rowIdx = this.height - 1 - borderPad;
        const colIdx = this.width - 2;
        this.buffer[rowIdx][colIdx] = '↓';
      }

      this.dirty = false;
    }

    return this.buffer;
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
