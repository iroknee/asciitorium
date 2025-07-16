import { Component } from "./Component";

export interface ButtonOptions {
  label: string;
  width?: number;
  height?: number;
  onClick?: () => void;
}

export class Button extends Component {
  public readonly label: string;
  public readonly width: number;
  public readonly height: number;
  public readonly onClick?: () => void;
  public hasFocus = false;

  constructor({ label, width, height, onClick }: ButtonOptions) {
    super();
    this.label = label;
    this.width = width ?? label.length + 4;
    this.height = height ?? 3;
    this.onClick = onClick;
  }

  handleEvent(event: string): boolean {
    if ((event === 'Enter' || event === ' ') && this.hasFocus) {
      if (this.onClick) this.onClick();
      return true;
    }
    return false;
  }

  draw(): string {
    const top = '┌' + '─'.repeat(this.width - 2) + '┐';
    const labelLine = this.hasFocus
      ? `│[${this.label.padEnd(this.width - 4)}]│`
      : `│ ${this.label.padEnd(this.width - 4)} │`;
    const bottom = '└' + '─'.repeat(this.width - 2) + '┘';
    return [top, labelLine, bottom].join('\n');
  }
}