import { Component, ComponentProps } from '../core/Component';
import { State } from '../core/State';
import { requestRender } from '../core/RenderScheduler';

export interface TextInputOptions extends ComponentProps {
  /** Accepts string OR number state */
  value?: State<string> | State<number>;
  /** Shown when empty (string or number ok) */
  placeholder?: string | number;
  /** If true, restricts typing to numeric characters (0-9, one '.', leading '-') */
  numeric?: boolean;
  /** Callback function called when Enter key is pressed */
  onEnter?: () => void;
}

function isNumberState(s: any): s is State<number> {
  return s && typeof s.value === 'number';
}

export class TextInput extends Component {
  /** Internal editable string state (always string) */
  private readonly valueStr: State<string>;
  /** Optional backing number state we mirror into/out of */
  private readonly valueNum?: State<number>;

  private readonly placeholder: string;
  private readonly numericMode: boolean;
  private readonly fixedHeight?: number; // Store original height for fixed height behavior
  private readonly onEnter?: () => void; // Callback for Enter key press
  private initialHeightCalculated = false; // Track if we've done the initial height calculation

  private cursorIndex = 0;
  private suppressCursorSync = false;

  focusable = true;
  hasFocus = false;

  constructor(options: TextInputOptions) {
    const height = options.height ?? 3; // Default to 3 for dynamic behavior
    const border = options.border ?? true;
    super({ ...options, height, border });

    this.fixedHeight = typeof options.height === 'number' ? options.height : undefined;

    this.numericMode = options.numeric === true || isNumberState(options.value);
    this.placeholder = String(options.placeholder ?? '');
    this.onEnter = options.onEnter;

    // Wire up states
    if (isNumberState(options.value)) {
      this.valueNum = options.value;
      this.valueStr = new State(String(options.value.value ?? ''));
      // when external number changes, reflect into the visible string
      this.bind(this.valueNum, (n) => {
        if (!this.suppressCursorSync) this.cursorIndex = String(n ?? '').length;
        // Don't thrash on NaN; just render empty
        this.valueStr.value = Number.isFinite(n) ? String(n) : '';
      });
    } else {
      // string mode
      this.valueStr = (options.value as State<string>) ?? new State('');
      this.valueNum = undefined;
      this.bind(this.valueStr, (v) => {
        if (!this.suppressCursorSync) this.cursorIndex = v.length;
        this.updateHeight(); // Update height when value changes
      });
    }

    // Don't do initial height calculation here - wait until first render when width is properly resolved
  }

  private setString(next: string) {
    this.suppressCursorSync = true;
    this.valueStr.value = next;
    this.suppressCursorSync = false;

    // Update height based on content if not fixed height
    this.updateHeight();

    // If we have a backing number, try to parse and propagate
    if (this.valueNum) {
      const parsed = Number(next.trim());
      if (next.trim() === '' || Number.isNaN(parsed)) {
        // empty or invalid -> don't push NaN; leave numeric as-is
        return;
      }
      this.valueNum.value = parsed;
    }
  }

  private updateHeight(): void {
    // Only adjust height if no explicit height was set
    if (this.fixedHeight !== undefined) {
      return;
    }

    const newHeight = this.calculateRequiredHeight();
    if (newHeight !== this.height) {
      this.height = newHeight;
      // Trigger layout recalculation by calling protected method from this context
      this.invalidateLayout();
      // Request a full re-render to update parent layouts
      requestRender();
    }
  }

  private calculateRequiredHeight(): number {
    const borderPad = this.border ? 2 : 0;
    const innerWidth = this.width - borderPad;
    const prefixLength = 2; // "> " prefix
    const usableWidth = Math.max(1, innerWidth - prefixLength);

    const content = this.valueStr.value.length > 0 ? this.valueStr.value : this.placeholder;
    const lines = this.wrapText(content, usableWidth);
    
    // Calculate required height: actual lines needed + border padding
    const requiredLines = Math.max(1, lines.length);
    const totalHeight = requiredLines + borderPad;
    
    // For dynamic height: start at 3 (1 line + border), grow as needed
    // So: 1 line = height 3, 2 lines = height 4, 3 lines = height 5, etc.
    return Math.max(3, totalHeight);
  }

  private wrapText(text: string, maxWidth: number): string[] {
    if (maxWidth <= 0) return [text];
    
    const lines: string[] = [];
    let currentLine = '';
    
    for (let i = 0; i < text.length; i++) {
      const char = text[i];
      if (char === '\n') {
        lines.push(currentLine);
        currentLine = '';
      } else if (currentLine.length >= maxWidth) {
        lines.push(currentLine);
        currentLine = char;
      } else {
        currentLine += char;
      }
    }
    
    if (currentLine.length > 0 || lines.length === 0) {
      lines.push(currentLine);
    }
    
    return lines;
  }

  private allowChar(ch: string, current: string): boolean {
    if (!this.numericMode) return true;
    // numeric guard: digits; one '.'; leading '-'
    if (/[0-9]/.test(ch)) return true;
    if (ch === '.' && !current.includes('.')) return true;
    if (ch === '-' && this.cursorIndex === 0 && !current.startsWith('-'))
      return true;
    return false;
  }

  override handleEvent(event: string): boolean {
    let updated = false;
    const val = this.valueStr.value;

    if (event.length === 1 && event >= ' ') {
      if (!this.allowChar(event, val)) return false;

      const left = val.slice(0, this.cursorIndex);
      const right = val.slice(this.cursorIndex);
      this.setString(left + event + right);
      this.cursorIndex++;
      updated = true;
    } else if (event === 'Backspace') {
      if (this.cursorIndex > 0) { 
        const left = val.slice(0, this.cursorIndex - 1);
        const right = val.slice(this.cursorIndex);
        this.setString(left + right);
        this.cursorIndex--;
        updated = true;
      }
    } else if (event === 'Delete') {
      if (this.cursorIndex < val.length) {
        const left = val.slice(0, this.cursorIndex);
        const right = val.slice(this.cursorIndex + 1);
        this.setString(left + right);
        updated = true;
      }
    } else if (event === 'ArrowLeft') {
      this.cursorIndex = Math.max(0, this.cursorIndex - 1);
      updated = true;
    } else if (event === 'ArrowRight') {
      this.cursorIndex = Math.min(val.length, this.cursorIndex + 1);
      updated = true;
    } else if (event === 'Home') {
      this.cursorIndex = 0;
      updated = true;
    } else if (event === 'End') {
      this.cursorIndex = val.length;
      updated = true;
    } else if (event === 'Enter') {
      // Commit: in numeric mode, try to coerce one last time
      if (this.valueNum) {
        const parsed = Number(this.valueStr.value.trim());
        if (Number.isFinite(parsed)) this.valueNum.value = parsed;
      }
      // Call the onEnter callback if provided
      if (this.onEnter) {
        this.onEnter();
      }
      updated = true;
    }

    return updated;
  }

  override draw(): string[][] {
    // Do initial height calculation on first draw when width is properly resolved
    if (!this.initialHeightCalculated) {
      this.updateHeight();
      this.initialHeightCalculated = true;
    }

    const buffer = super.draw();

    const prefix = this.hasFocus ? ' > ' : ' > ';
    const prefixLength = prefix.length;
    const startY = this.border ? 1 : 0;
    const startX = this.border ? 1 : 0;
    const innerWidth = this.width - (this.border ? 2 : 0);
    const usableWidth = Math.max(0, innerWidth - prefixLength);

    const raw = this.valueStr.value.length > 0 ? this.valueStr.value : this.placeholder;
    const lines = this.wrapText(raw, usableWidth);

    // Render each line
    for (let lineIndex = 0; lineIndex < lines.length; lineIndex++) {
      const y = startY + lineIndex;
      if (y >= this.height - (this.border ? 1 : 0)) break; // Don't draw outside buffer

      const line = lines[lineIndex];

      // prefix (only on first line)
      if (lineIndex === 0) {
        for (let i = 0; i < prefixLength && i < innerWidth; i++) {
          if (y < buffer.length && startX + i < buffer[y].length) {
            buffer[y][startX + i] = prefix[i];
          }
        }
      }

      // text
      const textStartX = lineIndex === 0 ? startX + prefixLength : startX;
      for (let i = 0; i < line.length; i++) {
        const x = textStartX + i;
        if (y < buffer.length && x < buffer[y].length) {
          buffer[y][x] = line[i];
        }
      }
    }

    // cursor
    if (this.hasFocus && usableWidth > 0) {
      const { line: cursorLine, pos: cursorPos } = this.getCursorPosition(lines);
      const y = startY + cursorLine;
      const x = (cursorLine === 0 ? startX + prefixLength : startX) + cursorPos;
      
      if (y < buffer.length && x < buffer[y].length) {
        buffer[y][x] = '▉';
      }
    }
    
    this.buffer = buffer;
    return buffer;
  }

  private getCursorPosition(lines: string[]): { line: number, pos: number } {
    let charCount = 0;
    
    for (let lineIndex = 0; lineIndex < lines.length; lineIndex++) {
      const lineLength = lines[lineIndex].length;
      
      if (this.cursorIndex <= charCount + lineLength) {
        return {
          line: lineIndex,
          pos: Math.min(this.cursorIndex - charCount, lineLength)
        };
      }
      
      charCount += lineLength;
    }
    
    // Cursor at end
    const lastLineIndex = lines.length - 1;
    return {
      line: Math.max(0, lastLineIndex),
      pos: lines[lastLineIndex]?.length || 0
    };
  }
}
