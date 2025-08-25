import { Component, ComponentProps } from '../core/Component';
import type { State } from '../core/State';
import { isState } from '../core/environment';
import { resolveAlignment } from '../core/utils/index';
import { Alignment, SizeValue } from 'core/types';

export interface TextOptions
  extends Omit<ComponentProps, 'children'> {
  content?: string | State<any>;
  value?: string | State<any>; // deprecated: use content instead
  align?: Alignment;
  children?: (string | State<any>) | (string | State<any>)[];
}

export class Text extends Component {
  private source: string | State<any>;

  constructor(options: TextOptions) {
    // Support both new content prop and legacy value prop
    // Also support JSX children syntax
    let actualContent = options.content || options.value;

    if (!actualContent && options.children) {
      const children = Array.isArray(options.children)
        ? options.children
        : [options.children];
      if (children.length > 0) {
        actualContent = children[0];
      }
    }

    if (!actualContent) {
      throw new Error(
        'Text component requires either content prop, value prop (deprecated), or children'
      );
    }

    const rawValue = isState(actualContent)
      ? (actualContent as State<any>).value
      : actualContent;

    const contentLength = Math.max(1, String(rawValue).length); // <- enforce min width
    const borderPadding = options.border ? 2 : 0;

    const { children, content, value, ...componentProps } = options;
    super({
      ...componentProps,
      width: options.width ?? contentLength + borderPadding,
      height: options.height ?? 1 + (options.border ? 2 : 0),
    });

    this.source = actualContent;
  }

  get value(): string {
    return isState(this.source)
      ? String((this.source as State<any>).value)
      : String(this.source);
  }

  draw(): string[][] {
    super.draw(); // fills buffer, draws borders, etc.

    const innerWidth = this.width - (this.border ? 2 : 0);
    const innerHeight = this.height - (this.border ? 2 : 0);

    // Wrap text if both width and height are explicitly set
    const wrappedLines = this.wrapText(this.value, innerWidth, innerHeight);

    const { x, y } = resolveAlignment(
      this.align,
      innerWidth,
      innerHeight,
      innerWidth,
      wrappedLines.length
    );

    const drawX = this.border ? x + 1 : x;
    const drawY = this.border ? y + 1 : y;

    // Draw each wrapped line
    for (
      let lineIndex = 0;
      lineIndex < wrappedLines.length && lineIndex < innerHeight;
      lineIndex++
    ) {
      const line = wrappedLines[lineIndex];
      const currentY = drawY + lineIndex;

      if (currentY >= this.height) break;

      for (
        let charIndex = 0;
        charIndex < line.length && charIndex < innerWidth;
        charIndex++
      ) {
        const currentX = drawX + charIndex;
        if (currentX < this.width) {
          this.buffer[currentY][currentX] = line[charIndex];
        }
      }
    }

    return this.buffer;
  }

  private wrapText(
    text: string,
    maxWidth: number,
    maxHeight: number
  ): string[] {
    if (maxWidth <= 0) return [];

    // First split by newlines to handle explicit line breaks
    const paragraphs = text.split('\n');
    const lines: string[] = [];

    for (const paragraph of paragraphs) {
      if (lines.length >= maxHeight) break;

      if (paragraph.trim() === '') {
        // Empty line
        lines.push('');
        continue;
      }

      const words = paragraph.split(' ');
      let currentLine = '';

      for (const word of words) {
        const testLine = currentLine ? `${currentLine} ${word}` : word;

        if (testLine.length <= maxWidth) {
          currentLine = testLine;
        } else {
          // If current line has content, push it and start new line
          if (currentLine) {
            lines.push(currentLine);
            if (lines.length >= maxHeight) break;
            currentLine = word;
          } else {
            // Word is longer than maxWidth, break it
            if (word.length > maxWidth) {
              let remainingWord = word;
              while (
                remainingWord.length > maxWidth &&
                lines.length < maxHeight
              ) {
                lines.push(remainingWord.substring(0, maxWidth));
                remainingWord = remainingWord.substring(maxWidth);
              }
              if (remainingWord.length > 0 && lines.length < maxHeight) {
                currentLine = remainingWord;
              }
            } else {
              currentLine = word;
            }
          }
        }

        // Stop if we've reached max height
        if (lines.length >= maxHeight) break;
      }

      // Add remaining content if there's space
      if (currentLine && lines.length < maxHeight) {
        lines.push(currentLine);
      }
    }

    return lines.slice(0, maxHeight);
  }
}
