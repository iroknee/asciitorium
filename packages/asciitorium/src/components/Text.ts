import { Component, ComponentProps } from '../core/Component';
import type { State } from '../core/State';
import { isState } from '../core/environment';
import { resolveAlignment } from '../core/utils/index';
import { Alignment, SizeContext } from '../core/types';

export interface TextOptions
  extends Omit<ComponentProps, 'children'> {
  content?: string | State<any>;
  align?: Alignment;
  children?: (string | State<any>) | (string | State<any>)[];
}

export class Text extends Component {
  private source: string | State<any>;

  constructor(options: TextOptions) {
    // Also support JSX children syntax
    let actualContent = options.content;

    if (!actualContent && options.children) {
      const children = Array.isArray(options.children)
        ? options.children
        : [options.children];
      if (children.length > 0) {
        actualContent = children[0];
      }
    }

    // Default to empty string if no content provided
    if (!actualContent) {
      actualContent = '';
    }

    const { children, content, ...componentProps } = options;
    super({
      ...componentProps,
      width: options.width, // Don't default to fill - let resolveSize handle it
      height: options.height, // Let auto-sizing calculate height based on wrapped content
    });

    this.source = actualContent;
    // Don't override align - let the Component base class handle it through mergeStyles
  }

  // Override resolveSize to handle width and height auto-sizing
  public resolveSize(context: SizeContext): void {
    // First, let the base class resolve any explicitly set dimensions
    super.resolveSize(context);
    
    // Handle width auto-sizing if not explicitly set
    if (this.getOriginalWidth() === undefined) {
      const contentLength = this.getContentAsString().length;
      const borderAdjustment = this.border ? 2 : 0;
      
      // Always use content-based sizing for Text components unless width is explicitly set
      // This prevents unwanted fill behavior in layout contexts
      this.width = Math.max(1, contentLength + borderAdjustment);
    }
    
    // Then calculate height based on the resolved width if height is not explicitly set
    if (this.getOriginalHeight() === undefined) {
      const innerWidth = this.width - (this.border ? 2 : 0);
      
      if (innerWidth > 0) {
        const wrappedLines = this.wrapText(this.getContentAsString(), innerWidth, Infinity);
        const borderAdjustment = this.border ? 2 : 0;
        const newHeight = Math.max(1, wrappedLines.length + borderAdjustment);
        this.height = newHeight;
      }
    }
  }

  getContentAsString(): string {
    if (isState(this.source)) {
      const value = (this.source as State<any>).value;
      return value == null ? '' : String(value);
    }
    return this.source == null ? '' : String(this.source);
  }

  draw(): string[][] {
    super.draw(); // fills buffer, draws borders, etc.

    const innerWidth = this.width - (this.border ? 2 : 0);
    const innerHeight = this.height - (this.border ? 2 : 0);

    const wrappedLines = this.wrapText(this.getContentAsString(), innerWidth, innerHeight);

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
