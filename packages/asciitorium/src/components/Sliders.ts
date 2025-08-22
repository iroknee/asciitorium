import { Component, ComponentProps } from '../core/Component';
import { State } from '../core/State';

export interface SliderVariantOptions extends Omit<ComponentProps, 'height'> {
  value: State<number>;
  min?: number;
  max?: number;
  step?: number;
  width?: number;
  height?: number;
}

export class ProgressBarSlider extends Component {
  private readonly valueState: State<number>;
  private readonly min: number;
  private readonly max: number;
  private readonly step: number;

  focusable = true;
  hasFocus = false;

  constructor(options: SliderVariantOptions) {
    const width = options.width ?? 25;
    const height = options.height ?? 3;
    const border = options.border ?? false;

    super({ ...options, width, height, border });

    this.valueState = options.value;
    this.min = options.min ?? 0;
    this.max = options.max ?? 100;
    this.step = options.step ?? 1;

    this.bind(this.valueState, () => {});
  }

  private clampValue(value: number): number {
    return Math.max(this.min, Math.min(this.max, value));
  }

  private incrementValue(): void {
    const newValue = this.clampValue(this.valueState.value + this.step);
    this.valueState.value = newValue;
  }

  private decrementValue(): void {
    const newValue = this.clampValue(this.valueState.value - this.step);
    this.valueState.value = newValue;
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
    this.buffer = Array.from({ length: this.height }, () =>
      Array.from({ length: this.width }, () => this.transparentChar)
    );

    const drawChar = (x: number, y: number, char: string) => {
      if (x >= 0 && x < this.width && y >= 0 && y < this.height) {
        this.buffer[y][x] = char;
      }
    };

    const innerWidth = this.width - 2;
    const range = this.max - this.min;
    const normalizedValue = (this.valueState.value - this.min) / range;
    const filledLength = Math.round(normalizedValue * innerWidth);
    const emptyLength = Math.max(0, innerWidth - filledLength);

    let barContent = '█'.repeat(Math.max(0, filledLength)) + ' '.repeat(Math.max(0, emptyLength));

    // Top border
    const top = ' ⎽' + '⎽'.repeat(Math.max(0, this.width - 3));
    for (let x = 0; x < top.length && x < this.width; x++) {
      drawChar(x, 0, top[x]);
    }

    // Middle with content
    drawChar(0, 1, '⎹');
    for (let x = 0; x < barContent.length && x < innerWidth; x++) {
      const char = this.hasFocus && x === filledLength - 1 && filledLength > 0 ? '▓' : barContent[x];
      drawChar(x + 1, 1, char);
    }
    drawChar(this.width - 1, 1, '⎸');

    // Bottom border
    const bot = ' ' + '⎺'.repeat(Math.max(0, this.width - 2));
    for (let x = 0; x < bot.length && x < this.width; x++) {
      drawChar(x, 2, bot[x]);
    }

    return this.buffer;
  }
}

export class GaugeSlider extends Component {
  private readonly valueState: State<number>;
  private readonly min: number;
  private readonly max: number;
  private readonly step: number;

  focusable = true;
  hasFocus = false;

  constructor(options: SliderVariantOptions) {
    const width = options.width ?? 25;
    const height = options.height ?? 1;
    const border = options.border ?? false;

    super({ ...options, width, height, border });

    this.valueState = options.value;
    this.min = options.min ?? 0;
    this.max = options.max ?? 100;
    this.step = options.step ?? 1;

    this.bind(this.valueState, () => {});
  }

  private clampValue(value: number): number {
    return Math.max(this.min, Math.min(this.max, value));
  }

  private incrementValue(): void {
    const newValue = this.clampValue(this.valueState.value + this.step);
    this.valueState.value = newValue;
  }

  private decrementValue(): void {
    const newValue = this.clampValue(this.valueState.value - this.step);
    this.valueState.value = newValue;
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
    this.buffer = Array.from({ length: this.height }, () =>
      Array.from({ length: this.width }, () => this.transparentChar)
    );

    const drawChar = (x: number, y: number, char: string) => {
      if (x >= 0 && x < this.width && y >= 0 && y < this.height) {
        this.buffer[y][x] = char;
      }
    };

    const trackWidth = this.width - 2;
    const range = this.max - this.min;
    const normalizedValue = (this.valueState.value - this.min) / range;
    const indicatorPosition = Math.round(normalizedValue * (trackWidth - 1));
    const y = Math.floor(this.height / 2);

    drawChar(0, y, '├');

    for (let x = 1; x < this.width - 1; x++) {
      const trackPos = x - 1;
      if (trackPos === indicatorPosition) {
        drawChar(x, y, this.hasFocus ? '◆' : '◇');
      } else {
        drawChar(x, y, '─');
      }
    }

    drawChar(this.width - 1, y, '┤');

    return this.buffer;
  }
}

export class DotSlider extends Component {
  private readonly valueState: State<number>;
  private readonly min: number;
  private readonly max: number;
  private readonly step: number;

  focusable = true;
  hasFocus = false;

  constructor(options: SliderVariantOptions) {
    const width = options.width ?? 25;
    const height = options.height ?? 1;
    const border = options.border ?? false;

    super({ ...options, width, height, border });

    this.valueState = options.value;
    this.min = options.min ?? 0;
    this.max = options.max ?? 100;
    this.step = options.step ?? 1;

    this.bind(this.valueState, () => {});
  }

  private clampValue(value: number): number {
    return Math.max(this.min, Math.min(this.max, value));
  }

  private incrementValue(): void {
    const newValue = this.clampValue(this.valueState.value + this.step);
    this.valueState.value = newValue;
  }

  private decrementValue(): void {
    const newValue = this.clampValue(this.valueState.value - this.step);
    this.valueState.value = newValue;
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
    this.buffer = Array.from({ length: this.height }, () =>
      Array.from({ length: this.width }, () => this.transparentChar)
    );

    const drawChar = (x: number, y: number, char: string) => {
      if (x >= 0 && x < this.width && y >= 0 && y < this.height) {
        this.buffer[y][x] = char;
      }
    };

    const dotCount = Math.floor(this.width / 2);
    const range = this.max - this.min;
    const normalizedValue = (this.valueState.value - this.min) / range;
    const activeDots = Math.round(normalizedValue * dotCount);
    const y = Math.floor(this.height / 2);

    for (let i = 0; i < dotCount; i++) {
      const x = i * 2;
      if (i < activeDots) {
        drawChar(x, y, this.hasFocus ? '◆' : '◆');
      } else {
        drawChar(x, y, '◇');
      }
    }

    return this.buffer;
  }
}

export class VerticalSlider extends Component {
  private readonly valueState: State<number>;
  private readonly min: number;
  private readonly max: number;
  private readonly step: number;

  focusable = true;
  hasFocus = false;

  constructor(options: SliderVariantOptions) {
    const width = options.width ?? 3;
    const height = options.height ?? 10;
    const border = options.border ?? false;

    super({ ...options, width, height, border });

    this.valueState = options.value;
    this.min = options.min ?? 0;
    this.max = options.max ?? 100;
    this.step = options.step ?? 1;

    this.bind(this.valueState, () => {});
  }

  private clampValue(value: number): number {
    return Math.max(this.min, Math.min(this.max, value));
  }

  private incrementValue(): void {
    const newValue = this.clampValue(this.valueState.value + this.step);
    this.valueState.value = newValue;
  }

  private decrementValue(): void {
    const newValue = this.clampValue(this.valueState.value - this.step);
    this.valueState.value = newValue;
  }

  override handleEvent(event: string): boolean {
    const prevValue = this.valueState.value;

    if (event === 'ArrowUp' || event === 'w') {
      this.incrementValue();
    } else if (event === 'ArrowDown' || event === 's') {
      this.decrementValue();
    } else {
      return false;
    }

    return this.valueState.value !== prevValue;
  }

  override draw(): string[][] {
    this.buffer = Array.from({ length: this.height }, () =>
      Array.from({ length: this.width }, () => this.transparentChar)
    );

    const drawChar = (x: number, y: number, char: string) => {
      if (x >= 0 && x < this.width && y >= 0 && y < this.height) {
        this.buffer[y][x] = char;
      }
    };

    const trackHeight = this.height - 2;
    const range = this.max - this.min;
    const normalizedValue = (this.valueState.value - this.min) / range;
    const filledHeight = Math.round(normalizedValue * trackHeight);

    drawChar(0, 0, '┌');
    drawChar(1, 0, '─');
    drawChar(2, 0, '┐');

    for (let y = 1; y < this.height - 1; y++) {
      drawChar(0, y, '│');
      drawChar(2, y, '│');

      const trackPos = trackHeight - (y - 1);
      if (trackPos <= filledHeight) {
        drawChar(1, y, this.hasFocus ? '█' : '▓');
      } else {
        drawChar(1, y, '░');
      }
    }

    drawChar(0, this.height - 1, '└');
    drawChar(1, this.height - 1, '─');
    drawChar(2, this.height - 1, '┘');

    return this.buffer;
  }
}
