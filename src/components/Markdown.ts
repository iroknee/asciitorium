// Markdown.ts
import { Component } from '../core/Component';

export class Markdown extends Component {
  readonly lines: string[];

  constructor(
    markdown: string,
    public readonly width: number,
    public readonly height: number
  ) {
    super();
    this.lines = markdown.split(/\r?\n/);
    // const blocks = parseMarkdown(this.lines);
    // this.height = blocks.reduce(
    //   (acc, b) => acc + renderBlock(b, width).length + 1,
    //   0
    // );
  }

  draw(): string[][] {
    const blocks = parseMarkdown(this.lines);
    const rendered: string[][] = [];

    for (const block of blocks) {
      const rows = renderBlock(block, this.width);
      rendered.push(...rows, []); // space between blocks
    }

    return rendered;
  }
}

// Intermediate Representation Types
type MarkdownBlock =
  | { type: 'header'; level: 1 | 2 | 3; text: string }
  | { type: 'horizontalRule'; strong?: boolean }
  | { type: 'paragraph'; lines: string[] }
  | { type: 'list'; items: string[] }
  | { type: 'blockquote'; lines: string[] }
  | { type: 'table'; rows: string[][] };

function parseMarkdown(lines: string[]): MarkdownBlock[] {
  const blocks: MarkdownBlock[] = [];
  let buffer: string[] = [];

  const flushParagraph = () => {
    if (buffer.length > 0) {
      blocks.push({ type: 'paragraph', lines: buffer });
      buffer = [];
    }
  };

  for (let i = 0; i < lines.length; i++) {
    let line = lines[i];
    line = line.trim();

    // Match empty lines (paragraph separator)
    // ^\s*$ : line contains only whitespace
    if (line === '') {
      flushParagraph();
      continue;
    }

    // Match ATX-style headers (e.g. # Header)
    // ^# +[A-Z ]+$ : line starts with # and a space, followed by uppercase letters and spaces
    if (line.startsWith('# ')) {
      blocks.push({
        type: 'header',
        level: 1,
        text: line.substring(2, line.length).trim(),
      });
      continue;
    }
    if (line.startsWith('## ')) {
      blocks.push({
        type: 'header',
        level: 2,
        text: line.substring(3, line.length).trim(),
      });
      continue;
    }
    if (line.startsWith('### ')) {
      blocks.push({
        type: 'header',
        level: 3,
        text: line.substring(4, line.length).trim(),
      });
      continue;
    }

    // Match horizontal rules
    // ^(-{3,}|={3,})$ : line is only --- or === (3 or more)
    if (line === '---' || line === '===') {
      blocks.push({ type: 'horizontalRule', strong: line === '===' });
      continue;
    }

    // Match blockquotes
    // ^> : line starts with >
    if (line.startsWith('>')) {
      blocks.push({ type: 'blockquote', lines: quoteLines });
    }
    if (/^> /.test(line)) {
      flushParagraph();
      const quoteLines: string[] = [line.replace(/^> /, '')];
      // Collect consecutive blockquote lines
      while (i + 1 < lines.length && /^> /.test(lines[i + 1])) {
        quoteLines.push(lines[++i].replace(/^> /, ''));
      }
      blocks.push({ type: 'blockquote', lines: quoteLines });
      continue;
    }

    // Match unordered list items
    // ^[-*+] : line starts with -, *, or + followed by space
    if (/^[-*+] /.test(line)) {
      flushParagraph();
      const items: string[] = [line.slice(2)];
      // Collect consecutive list items
      while (i + 1 < lines.length && /^[-*+] /.test(lines[i + 1])) {
        items.push(lines[++i].slice(2));
      }
      blocks.push({ type: 'list', items });
      continue;
    }

    // Match table rows
    // /\|/ : line contains |
    if (/\|/.test(line)) {
      flushParagraph();
      const rows: string[][] = [];
      // Split line into cells by |
      rows.push(line.split('|').map((cell) => cell.trim()));
      // Collect consecutive table rows
      while (i + 1 < lines.length && /\|/.test(lines[i + 1])) {
        rows.push(lines[++i].split('|').map((cell) => cell.trim()));
      }
      blocks.push({ type: 'table', rows });
      continue;
    }

    // Otherwise, treat as paragraph text
    buffer.push(line);
  }

  flushParagraph();
  return blocks;
}

function renderBlock(block: MarkdownBlock, width: number): string[][] {
  switch (block.type) {
    case 'spacedHeader': {
      const line = block.text.split('').join(' ');
      const underline = '='.repeat(width);
      return [center(line, width), underline.split(''), underline.split('')];
    }
    case 'header': {
      const line = block.text;
      if (block.level === 1) return [center(line.toUpperCase(), width)];
      if (block.level === 2)
        return [center(line, width), '-'.repeat(width).split('')];
      return [line.split('')];
    }
    case 'horizontalRule': {
      const char = block.strong ? '=' : '-';
      return [char.repeat(width).split('')];
    }
    case 'paragraph': {
      const lines: string[][] = [];
      for (const para of block.lines.join(' ').split(/(?<=\S)\s+(?=\S)/)) {
        const row = wrapText(para, width);
        lines.push(...row);
      }
      return lines;
    }
    case 'list': {
      return block.items.flatMap((item) => wrapText(`• ${item}`, width));
    }
    case 'blockquote': {
      return block.lines.flatMap((line) => wrapText(`> ${line}`, width));
    }
    case 'table': {
      const colWidths = block.rows[0].map((_, i) =>
        Math.max(...block.rows.map((r) => r[i]?.length || 0))
      );
      const renderRow = (row: string[]) => {
        return ['|', ...row.map((cell, i) => ` ${cell.padEnd(colWidths[i])} |`)]
          .join('')
          .split('');
      };
      return block.rows.map(renderRow);
    }
  }
}

function center(text: string, width: number): string[] {
  const pad = Math.floor((width - text.length) / 2);
  return (' '.repeat(pad) + text.padEnd(width - pad)).split('');
}

function wrapText(text: string, width: number): string[][] {
  const words = text.split(/\s+/);
  const lines: string[][] = [];
  let current: string[] = [];
  let len = 0;

  for (const word of words) {
    if (len + word.length + (current.length ? 1 : 0) > width) {
      lines.push(current);
      current = [word];
      len = word.length;
    } else {
      if (current.length) current.push(' ');
      current.push(...word.split(''));
      len += word.length + (current.length ? 1 : 0);
    }
  }
  if (current.length) lines.push(current);
  return lines;
}
