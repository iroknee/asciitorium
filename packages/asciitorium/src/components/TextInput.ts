import { Component, ComponentProps } from '../core/Component';
import { State } from '../core/State';

export interface TextInputOptions extends Omit<ComponentProps, 'height'> {
  /** Accepts string OR number state */
  value?: State<string> | State<number>;
  /** Shown when empty (string or number ok) */
  placeholder?: string | number;
  /** Fixed height (defaults 3) */
  height?: number;
  /** If true, restricts typing to numeric characters (0-9, one '.', leading '-') */
  numeric?: boolean;
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

  private cursorIndex = 0;
  private suppressCursorSync = false;

  focusable = true;
  hasFocus = false;

  constructor(options: TextInputOptions) {
    const height = options.height ?? 3;
    const border = options.border ?? true;
    super({ ...options, height, border });

    this.numericMode = options.numeric === true || isNumberState(options.value);
    this.placeholder = String(options.placeholder ?? '');

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
      });
    }
  }

  private setString(next: string) {
    this.suppressCursorSync = true;
    this.valueStr.value = next;
    this.suppressCursorSync = false;

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
      updated = true;
    }

    return updated;
  }

  override draw(): string[][] {
    const buffer = super.draw();

    const prefix = this.hasFocus ? '◆ > ' : '◇ > ';
    const prefixLength = prefix.length;
    const y = this.border ? 1 : 0;
    const x = this.border ? 1 : 0;
    const innerWidth = this.width - (this.border ? 2 : 0);
    const usableWidth = Math.max(0, innerWidth - prefixLength);

    const raw =
      this.valueStr.value.length > 0 ? this.valueStr.value : this.placeholder;
    const visible = raw.slice(0, usableWidth);

    // prefix
    for (let i = 0; i < prefixLength && i < innerWidth; i++) {
      buffer[y][x + i] = prefix[i];
    }

    // text
    for (let i = 0; i < visible.length && i < usableWidth; i++) {
      buffer[y][x + prefixLength + i] = visible[i];
    }

    // cursor
    if (this.hasFocus && usableWidth > 0) {
      const safeCursor = Math.min(
        this.cursorIndex,
        visible.length,
        usableWidth - 1
      );
      buffer[y][x + prefixLength + safeCursor] = '▉';
    }
    this.buffer = buffer;
    return buffer;
  }
}
