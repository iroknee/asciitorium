import { Component, ComponentProps } from '../core/Component.js';
import type { State } from '../core/State.js';
import { isState } from '../core/environment.js';
import { resolveTextAlignment } from '../core/utils/textAlignmentUtils.js';
import { SizeContext } from '../core/types.js';
import { ScrollableViewport } from '../core/ScrollableViewport.js';
import { requestRender } from '../core/RenderScheduler.js';

// Text-specific alignment supporting 9 positions within the text box
export type TextAlignment =
  | 'top-left' | 'top' | 'top-right'
  | 'left' | 'center' | 'right'
  | 'bottom-left' | 'bottom' | 'bottom-right';

export interface TextOptions
  extends Omit<ComponentProps, 'children'> {
  content?: string | State<any> | (string | State<any>)[];
  textAlign?: TextAlignment;
  children?: (string | State<any>) | (string | State<any>)[];
  scrollable?: boolean;
  wrap?: boolean;
  typewriter?: boolean;
  typewriterSpeed?: number;
  typewriterPauseFactor?: number;
}

export class Text extends Component {
  private source: string | State<any> | (string | State<any>)[];
  private textAlign?: TextAlignment;
  private scrollableViewport = new ScrollableViewport();
  private totalLines: string[] = [];
  private scrollOffset: number = 0;
  private isScrollable: boolean = false;
  private shouldWrap: boolean = true;
  private stateUnsubscribers: (() => void)[] = [];

  // Typewriter effect properties
  private isTypewriter: boolean = false;
  private typewriterSpeed: number = 20; // characters per second
  private typewriterPauseFactor: number = 10; // multiplier for pause after periods
  private visibleCharCount: number = 0;
  private typewriterIntervalId?: number;
  private fullContent: string = '';
  private isPaused: boolean = false;
  private pauseTimeoutId?: number;

  focusable = false;
  hasFocus = false;

  constructor(options: TextOptions) {
    // Also support JSX children syntax
    let actualContent = options.content;

    if (!actualContent && options.children) {
      const children = Array.isArray(options.children)
        ? options.children
        : [options.children];

      // Process all children
      if (children.length > 0) {
        // If there's only one child, use it directly (preserves State objects)
        if (children.length === 1) {
          actualContent = children[0];
        } else {
          // Multiple children: store the array for dynamic concatenation
          actualContent = children;
        }
      }
    }

    // Default to empty string if no content provided
    if (!actualContent) {
      actualContent = '';
    }

    const { children, content, scrollable, wrap, textAlign, typewriter, typewriterSpeed, typewriterPauseFactor, ...componentProps } = options;
    super({
      ...componentProps,
      width: options.width, // Don't default to fill - let resolveSize handle it
      height: options.height, // Let auto-sizing calculate height based on wrapped content
    });

    this.source = actualContent;
    this.textAlign = textAlign;
    this.isScrollable = scrollable ?? false;
    this.shouldWrap = wrap ?? true;
    this.focusable = this.isScrollable;

    // Initialize typewriter settings
    this.isTypewriter = typewriter ?? false;
    this.typewriterSpeed = typewriterSpeed ?? 20;
    this.typewriterPauseFactor = typewriterPauseFactor ?? 10;

    // Subscribe to any State objects in the source
    this.subscribeToStates();

    // Start typewriter effect if enabled
    if (this.isTypewriter) {
      this.startTypewriter();
    }
  }

  private startTypewriter(): void {
    this.visibleCharCount = 0;
    this.isPaused = false;

    // Calculate interval in milliseconds from characters per second
    const intervalMs = 1000 / this.typewriterSpeed;

    this.typewriterIntervalId = globalThis.setInterval(() => {
      // Skip if we're currently paused
      if (this.isPaused) {
        return;
      }

      // Get full content length (we'll cache it in getContentAsString)
      const fullLength = this.fullContent.length;

      if (this.visibleCharCount < fullLength) {
        this.visibleCharCount++;
        requestRender();

        // Check if we just typed a period followed by a space or end of content
        const currentChar = this.fullContent[this.visibleCharCount - 1];
        const nextChar = this.visibleCharCount < fullLength ? this.fullContent[this.visibleCharCount] : null;

        if (currentChar === '.' && (nextChar === ' ' || nextChar === null)) {
          // Pause after periods for more natural reading pace
          this.isPaused = true;
          this.pauseTimeoutId = globalThis.setTimeout(() => {
            this.isPaused = false;
            this.pauseTimeoutId = undefined;
          }, intervalMs * this.typewriterPauseFactor) as unknown as number;
        }
      } else {
        // Typewriter complete, stop the interval
        this.stopTypewriter();
      }
    }, intervalMs) as unknown as number;
  }

  private stopTypewriter(): void {
    if (this.typewriterIntervalId !== undefined) {
      globalThis.clearInterval(this.typewriterIntervalId);
      this.typewriterIntervalId = undefined;
    }
    if (this.pauseTimeoutId !== undefined) {
      globalThis.clearTimeout(this.pauseTimeoutId);
      this.pauseTimeoutId = undefined;
    }
    this.isPaused = false;
  }

  private subscribeToStates(): void {
    const statesToSubscribe: State<any>[] = [];

    // Collect all State objects
    if (Array.isArray(this.source)) {
      for (const child of this.source) {
        if (isState(child)) {
          statesToSubscribe.push(child);
        }
      }
    } else if (isState(this.source)) {
      statesToSubscribe.push(this.source);
    }

    // Subscribe to each State object
    for (const state of statesToSubscribe) {
      const listener = () => {
        // If typewriter is enabled, restart it when content changes
        if (this.isTypewriter) {
          this.stopTypewriter();
          this.startTypewriter();
        }
        requestRender();
      };
      state.subscribe(listener);
      this.stateUnsubscribers.push(() => state.unsubscribe(listener));
    }
  }

  override destroy(): void {
    // Stop typewriter effect if active
    this.stopTypewriter();

    // Unsubscribe from all State objects
    for (const unsubscribe of this.stateUnsubscribers) {
      unsubscribe();
    }
    this.stateUnsubscribers = [];
    super.destroy();
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
    let result: string;

    if (Array.isArray(this.source)) {
      // Multiple children: concatenate them dynamically
      result = this.source.map(child => {
        if (typeof child === 'string') {
          return child;
        } else if (isState(child)) {
          const value = child.value;
          return value == null ? '' : String(value);
        } else {
          return String(child);
        }
      }).join('');
    } else if (isState(this.source)) {
      const value = (this.source as State<any>).value;
      result = value == null ? '' : String(value);
    } else {
      result = this.source == null ? '' : String(this.source);
    }

    // Convert ¶ (pilcrow) to newline for text wrapping, but allow escaping with backslash
    result = result.replace(/\\¶/g, '\u0000').replace(/¶/g, '\n').replace(/\u0000/g, '¶');

    // Cache the full content for typewriter effect
    this.fullContent = result;

    // If typewriter is enabled and not complete, return truncated content
    if (this.isTypewriter && this.visibleCharCount < result.length) {
      return result.substring(0, this.visibleCharCount);
    }

    return result;
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

    // Calculate the maximum line width for alignment purposes
    const maxLineWidth = Math.max(...linesToDraw.map(line => line.length), 0);

    // Use textAlign for positioning text within the component
    const { x, y } = resolveTextAlignment(
      this.textAlign,
      innerWidth,
      innerHeight,
      maxLineWidth,
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

      // Calculate per-line horizontal alignment offset
      const lineWidth = line.length;
      let lineX = drawX;

      // Apply horizontal alignment for each line
      if (this.textAlign) {
        if (this.textAlign.includes('right')) {
          lineX = drawX + (maxLineWidth - lineWidth);
        } else if (this.textAlign === 'center' || this.textAlign === 'top' || this.textAlign === 'bottom') {
          lineX = drawX + Math.floor((maxLineWidth - lineWidth) / 2);
        }
      }

      for (
        let charIndex = 0;
        charIndex < line.length && charIndex < innerWidth;
        charIndex++
      ) {
        const currentX = lineX + charIndex;
        if (currentX < this.width) {
          this.buffer[currentY][currentX] = line[charIndex];
        }
      }
    }

    // Draw focus indicator for scrollable text with border
    if (this.hasFocus && this.border && this.isScrollable) {
      // Draw ' > ' at positions (1, 0), (2, 0), (3, 0)
      if (this.buffer.length > 0 && this.buffer[0].length > 3) {
        this.buffer[0][2] = ' ';
        this.buffer[0][3] = '>';
        this.buffer[0][4] = ' ';
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

    // If wrapping is disabled, just split by newlines and truncate
    if (!this.shouldWrap) {
      const lines = text.split('\n');
      return lines.slice(0, maxHeight).map(line =>
        line.length > maxWidth ? line.substring(0, maxWidth) : line
      );
    }

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
