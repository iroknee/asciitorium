import { Component, ComponentProps } from '../core/Component';
import { State } from '../core/State';
import { SizeValue } from '../core/types';

export interface SliderVariantOptions extends ComponentProps {
  value: State<number>;
  min?: number;
  max?: number;
  step?: number;
  readonly?: boolean;
}

abstract class SliderBase extends Component {
  protected readonly valueState: State<number>;
  protected readonly min: number;
  protected readonly max: number;
  protected readonly step: number;

  focusable = true;
  hasFocus = false;

  constructor(options: SliderVariantOptions, defaultWidth: SizeValue, defaultHeight: SizeValue) {
    super({
      ...options,
      width: options.width ?? options.style?.width ?? defaultWidth,
      height: options.height ?? options.style?.height ?? defaultHeight,
      border: options.border ?? options.style?.border ?? false
    });

    this.valueState = options.value;
    this.min = options.min ?? 0;
    this.max = options.max ?? 100;
    this.step = options.step ?? 1;
    this.focusable = !options.readonly;

    this.bind(this.valueState, () => {});
  }

  protected clampValue(value: number): number {
    return Math.max(this.min, Math.min(this.max, value));
  }

  protected incrementValue(): void {
    const newValue = this.clampValue(this.valueState.value + this.step);
    this.valueState.value = newValue;
  }

  protected decrementValue(): void {
    const newValue = this.clampValue(this.valueState.value - this.step);
    this.valueState.value = newValue;
  }

  protected initializeBuffer(): void {
    this.buffer = Array.from({ length: this.height }, () =>
      Array.from({ length: this.width }, () => this.transparentChar)
    );
  }

  protected drawChar(x: number, y: number, char: string): void {
    if (x >= 0 && x < this.width && y >= 0 && y < this.height) {
      this.buffer[y][x] = char;
    }
  }

  protected calculateNormalizedValue(): number {
    const range = this.max - this.min;
    return (this.valueState.value - this.min) / range;
  }
}

export class ProgressBarSlider extends SliderBase {
  constructor(options: SliderVariantOptions) {
    super(options, 'fill', 3);
  }

  override handleEvent(event: string): boolean {
    const prevValue = this.valueState.value;

    if (event === 'ArrowRight' || event === 'd') {
      this.incrementValue();
    } else if (event === 'ArrowLeft' || event === 'a') {
      this.decrementValue();
    } else {
      return false;
    }

    return this.valueState.value !== prevValue;
  }

  override draw(): string[][] {
    this.initializeBuffer();

    const innerWidth = this.width - 2;
    const normalizedValue = this.calculateNormalizedValue();
    const filledLength = Math.round(normalizedValue * innerWidth);
    const emptyLength = Math.max(0, innerWidth - filledLength);

    let barContent = '█'.repeat(Math.max(0, filledLength)) + ' '.repeat(Math.max(0, emptyLength));

    // Top border
    this.drawChar(0, 0, '┌');
    for (let x = 1; x < this.width - 1; x++) {
      this.drawChar(x, 0, '─');
    }
    this.drawChar(this.width - 1, 0, '┐');

    // Middle with content
    this.drawChar(0, 1, '│');
    for (let x = 0; x < barContent.length && x < innerWidth; x++) {
      const char = this.hasFocus && x === filledLength - 1 && filledLength > 0 ? '▓' : barContent[x];
      this.drawChar(x + 1, 1, char);
    }
    this.drawChar(this.width - 1, 1, '│');

    // Bottom border
    this.drawChar(0, 2, '└');
    for (let x = 1; x < this.width - 1; x++) {
      this.drawChar(x, 2, '─');
    }
    this.drawChar(this.width - 1, 2, '┘');

    // Draw hotkey indicator at position (1, 0) if hotkey visibility is on
    if (this.hotkey && this.isHotkeyVisibilityEnabled()) {
      const hotkeyDisplay = `[${this.hotkey.toUpperCase()}]`;
      for (let i = 0; i < hotkeyDisplay.length && i + 1 < this.width - 1; i++) {
        this.drawChar(i + 1, 0, hotkeyDisplay[i]);
      }
    }

    return this.buffer;
  }
}

export class GaugeSlider extends SliderBase {
  constructor(options: SliderVariantOptions) {
    super(options, 'fill', 1);
  }

  override handleEvent(event: string): boolean {
    const prevValue = this.valueState.value;

    if (event === 'ArrowRight' || event === 'd') {
      this.incrementValue();
    } else if (event === 'ArrowLeft' || event === 'a') {
      this.decrementValue();
    } else {
      return false;
    }

    return this.valueState.value !== prevValue;
  }

  override draw(): string[][] {
    this.initializeBuffer();

    const trackWidth = this.width - 2;
    const normalizedValue = this.calculateNormalizedValue();
    const indicatorPosition = Math.round(normalizedValue * (trackWidth - 1));
    const y = Math.floor(this.height / 2);

    this.drawChar(0, y, '├');

    for (let x = 1; x < this.width - 1; x++) {
      const trackPos = x - 1;
      if (trackPos === indicatorPosition) {
        this.drawChar(x, y, this.hasFocus ? '◆' : '◇');
      } else {
        this.drawChar(x, y, '─');
      }
    }

    this.drawChar(this.width - 1, y, '┤');

    // Draw hotkey indicator at position (1, 0) if hotkey visibility is on
    if (this.hotkey && this.isHotkeyVisibilityEnabled()) {
      const hotkeyDisplay = `[${this.hotkey.toUpperCase()}]`;
      for (let i = 0; i < hotkeyDisplay.length && i + 1 < this.width - 1; i++) {
        this.drawChar(i, 0, hotkeyDisplay[i]);
      }
    }

    return this.buffer;
  }
}

export class DotSlider extends SliderBase {
  constructor(options: SliderVariantOptions) {
    super(options, 'fill', 1);
  }

  override handleEvent(event: string): boolean {
    const prevValue = this.valueState.value;

    if (event === 'ArrowRight' || event === 'd') {
      this.incrementValue();
    } else if (event === 'ArrowLeft' || event === 'a') {
      this.decrementValue();
    } else {
      return false;
    }

    return this.valueState.value !== prevValue;
  }

  override draw(): string[][] {
    this.initializeBuffer();

    const dotCount = Math.floor(this.width / 2);
    const normalizedValue = this.calculateNormalizedValue();
    const activeDots = Math.round(normalizedValue * dotCount);
    const y = Math.floor(this.height / 2);

    for (let i = 0; i < dotCount; i++) {
      const x = i * 2;
      if (i < activeDots) {
        this.drawChar(x, y, this.hasFocus ? '◆' : '◆');
      } else {
        this.drawChar(x, y, '◇');
      }
    }

    // Draw hotkey indicator at position (1, 0) if hotkey visibility is on
    if (this.hotkey && this.isHotkeyVisibilityEnabled()) {
      const hotkeyDisplay = `[${this.hotkey.toUpperCase()}]`;
      for (let i = 0; i < hotkeyDisplay.length && i + 1 < this.width - 1; i++) {
        this.drawChar(i, 0, hotkeyDisplay[i]);
      }
    }

    return this.buffer;
  }
}

export class VerticalSlider extends SliderBase {
  constructor(options: SliderVariantOptions) {
    super(options, 3, 'fill');
  }

  override handleEvent(event: string): boolean {
    const prevValue = this.valueState.value;

    if (event === 'ArrowUp') {
      this.incrementValue();
    } else if (event === 'ArrowDown') {
      this.decrementValue();
    } else {
      return false;
    }

    return this.valueState.value !== prevValue;
  }

  override draw(): string[][] {
    this.initializeBuffer();

    const trackHeight = this.height - 2;
    const normalizedValue = this.calculateNormalizedValue();
    const filledHeight = Math.round(normalizedValue * trackHeight);

    this.drawChar(0, 0, '┌');
    this.drawChar(1, 0, '─');
    this.drawChar(2, 0, '┐');

    for (let y = 1; y < this.height - 1; y++) {
      this.drawChar(0, y, '│');
      this.drawChar(2, y, '│');

      const trackPos = trackHeight - (y - 1);
      if (trackPos <= filledHeight) {
        this.drawChar(1, y, this.hasFocus ? '█' : '▓');
      } else {
        this.drawChar(1, y, '░');
      }
    }

    this.drawChar(0, this.height - 1, '└');
    this.drawChar(1, this.height - 1, '─');
    this.drawChar(2, this.height - 1, '┘');

    // Draw hotkey indicator at position (0, 0) if hotkey visibility is on
    if (this.hotkey && this.isHotkeyVisibilityEnabled()) {
      const hotkeyDisplay = `[${this.hotkey.toUpperCase()}]`;
      for (let i = 0; i < hotkeyDisplay.length && i < this.width; i++) {
        this.drawChar(i, 0, hotkeyDisplay[i]);
      }
    }

    return this.buffer;
  }
}
