import { Component, ComponentProps } from '../core/Component';
import type { State } from '../core/State';
import { isState } from '../core/environment';
import { resolveAlignment } from '../core/utils/index';
import { Alignment, SizeContext } from '../core/types';
import { ScrollableViewport } from '../core/ScrollableViewport';

export interface TextOptions
  extends Omit<ComponentProps, 'children'> {
  content?: string | State<any>;
  align?: Alignment;
  children?: (string | State<any>) | (string | State<any>)[];
  scrollable?: boolean;
}

export class Text extends Component {
  private source: string | State<any>;
  private scrollableViewport = new ScrollableViewport();
  private totalLines: string[] = [];
  private scrollOffset: number = 0;
  private isScrollable: boolean = false;

  focusable = false;
  hasFocus = false;

  constructor(options: TextOptions) {
    // Also support JSX children syntax
    let actualContent = options.content;

    if (!actualContent && options.children) {
      const children = Array.isArray(options.children)
        ? options.children
        : [options.children];

      // Process all children and concatenate them
      if (children.length > 0) {
        // If there's only one child, use it directly (preserves State objects)
        if (children.length === 1) {
          actualContent = children[0];
        } else {
          // Multiple children: create a computed string by concatenating
          // For now, concatenate at construction time (static)
          actualContent = children.map(child => {
            if (typeof child === 'string') {
              return child;
            } else if (isState(child)) {
              return child.value;
            } else {
              return String(child);
            }
          }).join('');
        }
      }
    }

    // Default to empty string if no content provided
    if (!actualContent) {
      actualContent = '';
    }

    const { children, content, scrollable, ...componentProps } = options;
    super({
      ...componentProps,
      width: options.width, // Don't default to fill - let resolveSize handle it
      height: options.height, // Let auto-sizing calculate height based on wrapped content
    });

    this.source = actualContent;
    this.isScrollable = scrollable ?? false;
    this.focusable = this.isScrollable;
    // Don't override align - let the Component base class handle it through mergeStyles
  }

  override handleEvent(event: string): boolean {
    if (!this.isScrollable || this.totalLines.length === 0) {
      return false;
    }

    const innerHeight = this.height - (this.border ? 2 : 0);
    const maxVisible = Math.max(1, innerHeight);

    // Only handle scroll events if content exceeds viewport
    if (this.totalLines.length <= maxVisible) {
      return false;
    }

    const prevScrollOffset = this.scrollOffset;
    const newScrollOffset = this.scrollableViewport.handleScrollEvent(
      event,
      this.scrollOffset,
      this.totalLines.length
    );
    this.scrollOffset = newScrollOffset;

    return this.scrollOffset !== prevScrollOffset;
  }

  // Override resolveSize to handle width and height auto-sizing
  public resolveSize(context: SizeContext): void {
    // First, let the base class resolve any explicitly set dimensions
    super.resolveSize(context);

    // Handle width auto-sizing if not explicitly set
    if (this.getOriginalWidth() === undefined) {
      const contentLength = this.getContentAsString().length;
      const borderAdjustment = this.border ? 2 : 0;

      // Account for this component's own left/right gaps when calculating max width
      let gapLeft = 0;
      let gapRight = 0;
      if (this.gap) {
        if (Array.isArray(this.gap)) {
          // Array format: [top, right, bottom, left] or [vertical, horizontal]
          if (this.gap.length === 4) {
            gapLeft = this.gap[3];
            gapRight = this.gap[1];
          } else if (this.gap.length === 2) {
            gapLeft = gapRight = this.gap[1];
          }
        } else if (typeof this.gap === 'object') {
          // Object format: { left, right, ... }
          gapLeft = this.gap.left || 0;
          gapRight = this.gap.right || 0;
        } else if (typeof this.gap === 'number') {
          // Single number: applies to all sides
          gapLeft = gapRight = this.gap;
        }
      }
      const gapAdjustment = gapLeft + gapRight;

      // Size based on content, but respect parent's available width minus our gaps
      const contentBasedWidth = contentLength + borderAdjustment;
      const maxWidth = Math.max(1, context.availableWidth - gapAdjustment);

      // Use the smaller of content width or available width
      this.width = Math.max(1, Math.min(contentBasedWidth, maxWidth));
    }
    
    // Then calculate height based on the resolved width if height is not explicitly set
    if (this.getOriginalHeight() === undefined) {
      const innerWidth = this.width - (this.border ? 2 : 0);

      if (innerWidth > 0) {
        const wrappedLines = this.wrapText(this.getContentAsString(), innerWidth, Infinity);

        // Store total lines for scrollable text
        if (this.isScrollable) {
          this.totalLines = wrappedLines;
        }

        const borderAdjustment = this.border ? 2 : 0;

        // For scrollable text, don't auto-expand height - keep it constrained if set
        if (this.isScrollable && this.getOriginalHeight() !== undefined) {
          // Height was explicitly set, use it
        } else {
          // Non-scrollable or no height set, use content-based sizing
          const newHeight = Math.max(1, wrappedLines.length + borderAdjustment);
          this.height = newHeight;
        }
      }
    } else if (this.isScrollable) {
      // Height is explicitly set and scrollable - store total lines
      const innerWidth = this.width - (this.border ? 2 : 0);
      if (innerWidth > 0) {
        this.totalLines = this.wrapText(this.getContentAsString(), innerWidth, Infinity);
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

    let linesToDraw: string[];

    if (this.isScrollable && this.totalLines.length > 0) {
      // For scrollable text, use stored total lines and apply scrolling
      const maxVisible = Math.max(1, innerHeight);

      if (this.totalLines.length > maxVisible) {
        // Use ScrollableViewport to calculate what to show
        const scrollWindow = this.scrollableViewport.calculateScrollWindow({
          items: this.totalLines,
          totalCount: this.totalLines.length,
          maxVisible,
          focusedIndex: this.scrollOffset
        });

        linesToDraw = scrollWindow.visibleItems;

        // Draw scroll indicators
        const borderPad = this.border ? 1 : 0;
        this.scrollableViewport.drawScrollIndicators(
          this.buffer,
          this.width,
          this.height,
          borderPad,
          scrollWindow.showUpArrow,
          scrollWindow.showDownArrow
        );
      } else {
        // Content fits in viewport, show all
        linesToDraw = this.totalLines;
      }
    } else {
      // Non-scrollable text, use traditional wrapping with height constraint
      linesToDraw = this.wrapText(this.getContentAsString(), innerWidth, innerHeight);
    }

    const { x, y } = resolveAlignment(
      this.align,
      innerWidth,
      innerHeight,
      innerWidth,
      linesToDraw.length
    );

    const drawX = this.border ? x + 1 : x;
    const drawY = this.border ? y + 1 : y;

    // Draw each line
    for (
      let lineIndex = 0;
      lineIndex < linesToDraw.length && lineIndex < innerHeight;
      lineIndex++
    ) {
      const line = linesToDraw[lineIndex];
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
