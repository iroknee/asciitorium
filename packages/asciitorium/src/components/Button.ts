import { Component, ComponentProps } from '../core/Component';
import { requestRender } from '../core/RenderScheduler';

export interface ButtonOptions
  extends Omit<ComponentProps, 'children'> {
  content?: string;
  onClick?: () => void;
  children?: string | string[];
}

export class Button extends Component {
  public readonly onClick?: () => void;
  focusable = true;
  hasFocus = false;
  private isPressed = false;
  private pressTimer?: NodeJS.Timeout;

  constructor({ onClick, ...options }: ButtonOptions) {
    // Support both new content prop and JSX children
    let actualContent = options.content || options.label; // fallback to label for backward compatibility

    if (!actualContent && options.children) {
      const children = Array.isArray(options.children)
        ? options.children
        : [options.children];
      if (children.length > 0) {
        actualContent = children[0];
      }
    }

    const buttonText = actualContent ?? 'Button';
    const showLabel = false; // Buttons don't show label in border
    const width = options.width ?? buttonText.length + 7; // padding + shadow
    const height = options.height ?? 4; // height + shadow
    const border = options.border ?? true;
    const { children, content, ...componentProps } = options;
    super({
      ...componentProps,
      width,
      height,
      border,
      label: buttonText,
      showLabel,
    });

    this.onClick = onClick;
  }

  private press(): void {
    // Clear any existing timer
    if (this.pressTimer) {
      clearTimeout(this.pressTimer);
    }

    // Set pressed state
    this.isPressed = true;

    // Return to normal state after 250ms
    this.pressTimer = setTimeout(() => {
      this.isPressed = false;
      this.pressTimer = undefined;
      requestRender();
    }, 100);
  }

  handleEvent(event: string): boolean {
    if (event === 'Enter' || event === ' ') {
      this.press();
      this.onClick?.();
      return true;
    }
    return false;
  }
  override draw(): string[][] {
    // Create buffer filled with transparent chars
    this.buffer = Array.from({ length: this.height }, () =>
      Array.from({ length: this.width }, () => this.transparentChar)
    );

    const drawChar = (x: number, y: number, char: string) => {
      if (x >= 0 && x < this.width && y >= 0 && y < this.height) {
        this.buffer[y][x] = char;
      }
    };

    // Shadow dimensions (button area is 1 less in each dimension to make room for shadow)
    const buttonWidth = this.width - 1;
    const buttonHeight = this.height - 1;

    // Draw shadow based on press state
    if (this.isPressed) {
      // Pressed: shadow on top and left
      for (let x = 0; x < buttonWidth; x++) {
        drawChar(x, 0, ' '); // top shadow
      }
      for (let y = 0; y < buttonHeight; y++) {
        drawChar(0, y, ' '); // left shadow
      }
    } else {
      // Normal: shadow on bottom and right
      for (let x = 1; x < this.width - 1; x++) {
        drawChar(x, buttonHeight, '`'); // bottom shadow
      }
      for (let y = 1; y < this.height - 1; y++) {
        drawChar(buttonWidth, y, '`'); // right shadow
      }
      drawChar(buttonWidth, buttonHeight, '‛'); // bottom-right corner shadow
    }

    // Calculate button area offset based on press state
    const offsetX = this.isPressed ? 1 : 0;
    const offsetY = this.isPressed ? 1 : 0;

    // Draw button border
    if (this.border) {
      const bw = buttonWidth;
      const bh = buttonHeight;

      drawChar(offsetX + 0, offsetY + 0, '╭');
      drawChar(offsetX + bw - 1, offsetY + 0, '╮');
      drawChar(offsetX + 0, offsetY + bh - 1, '╰');
      drawChar(offsetX + bw - 1, offsetY + bh - 1, '╯');

      for (let x = 1; x < bw - 1; x++) {
        drawChar(offsetX + x, offsetY + 0, '─');
        drawChar(offsetX + x, offsetY + bh - 1, '─');
      }
      for (let y = 1; y < bh - 1; y++) {
        drawChar(offsetX + 0, offsetY + y, '│');
        drawChar(offsetX + bw - 1, offsetY + y, '│');
      }
    }

    // Draw button content
    const padX = this.border ? 1 : 0;
    const padY = this.border ? 1 : 0;
    const contentWidth = buttonWidth - padX * 2;
    const contentHeight = buttonHeight - padY * 2;

    // Calculate label placement (centered)
    const label = this.label ?? 'Button';
    const totalLabelWidth = label.length + 4; // label + 2 indicators + 2 spaces
    const labelStartX = offsetX + padX + Math.max(Math.floor((contentWidth - totalLabelWidth) / 2), 0);
    const labelX = labelStartX + 2; // space for left indicator + space
    const labelY = offsetY + padY + Math.floor(contentHeight / 2);

    // Write the label centered
    for (
      let i = 0;
      i < label.length && labelX + i < offsetX + buttonWidth - padX;
      i++
    ) {
      drawChar(labelX + i, labelY, label[i]);
    }

    // Draw focus indicator
    // Determine indicator characters based on state
    let leftIndicator: string, rightIndicator: string;
    if (this.isPressed) {
      leftIndicator = '◆';
      rightIndicator = '◆';
    } else if (this.hasFocus) {
      leftIndicator = '>';
      rightIndicator = '<';

    } else {
      leftIndicator = ' ';
      rightIndicator = ' ';
    }

    // Draw left indicator
    drawChar(labelStartX, labelY, leftIndicator);
    
    // Draw right indicator with space after label
    const rightIndicatorX = labelX + label.length + 1;
    if (rightIndicatorX < offsetX + buttonWidth - padX) {
      drawChar(rightIndicatorX, labelY, rightIndicator);
    }

    return this.buffer;
  }
}
