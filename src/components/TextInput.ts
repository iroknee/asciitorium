import { Component, ComponentProps } from '../core/Component';
import { State } from '../core/State';

export interface TextInputOptions extends ComponentProps {
  state?: State<string>;
  placeholder?: string;
}

export class TextInput extends Component {
  private internalState = new State('');
  private externalState?: State<string>;
  private placeholder: string;
  private cursorIndex: number = 0;

  focusable = true;
  hasFocus = false;

  constructor(options: TextInputOptions) {
    super(options);
    this.externalState = options.state;
    this.placeholder = options.placeholder ?? '';

    if (this.externalState) {
      this.externalState.subscribe((value) => {
        this.internalState.value = value;
        this.cursorIndex = value.length;
        this.dirty = true;
      });
    }
  }

  handleEvent(event: string): boolean {
    let updated = false;

    if (event.length === 1 && event >= ' ') {
      const val = this.internalState.value;
      const left = val.slice(0, this.cursorIndex);
      const right = val.slice(this.cursorIndex);
      this.internalState.value = left + event + right;
      this.cursorIndex++;
      updated = true;
    } else if (event === 'Backspace') {
      if (this.cursorIndex > 0) {
        const val = this.internalState.value;
        const left = val.slice(0, this.cursorIndex - 1);
        const right = val.slice(this.cursorIndex);
        this.internalState.value = left + right;
        this.cursorIndex--;
        updated = true;
      }
    } else if (event === 'ArrowLeft') {
      this.cursorIndex = Math.max(0, this.cursorIndex - 1);
      updated = true;
    } else if (event === 'ArrowRight') {
      this.cursorIndex = Math.min(
        this.internalState.value.length,
        this.cursorIndex + 1
      );
      updated = true;
    }

    if (updated) {
      if (this.externalState) {
        this.externalState.value = this.internalState.value;
      }
      this.dirty = true;
      return true;
    }

    return false;
  }

  draw(): string[][] {
    const buffer = super.draw(); // creates fill, border, label if needed
    const innerWidth = this.border ? this.width - 2 : this.width;
    const xOffset = this.border ? 3 : 2;
    const yOffset = this.border ? 1 : 0;

    const content = this.internalState.value || this.placeholder;
    const visible = content.slice(0, innerWidth);

    // draw > to indicate input field
    if (this.border) {
      buffer[yOffset][1] = '>';
      buffer[yOffset][2] = ' ';
    } else {
      buffer[yOffset][0] = '>';
      buffer[yOffset][1] = ' ';
    }

    // Draw input characters
    for (let i = 0; i < visible.length && i < innerWidth; i++) {
      buffer[yOffset][xOffset + i] = visible[i];
    }

    // Draw cursor if focused and within bounds
    const cursorPos = Math.min(this.cursorIndex, innerWidth - 1);
    if (this.hasFocus) {
      buffer[yOffset][xOffset + cursorPos] = '▉';
    }

    this.buffer = buffer;
    this.dirty = false;
    return buffer;
  }
}
