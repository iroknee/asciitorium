import { Component } from './Component';

export interface AlertOptions {
  message: string;
  width?: number;
  durationMs?: number;
  onDismiss?: () => void;
}

export class Alert extends Component {
  readonly message: string;
  readonly width: number;
  readonly height: number = 4;
  private timerId?: ReturnType<typeof setTimeout>;
  private dismissed = false;
  private onDismiss?: () => void;

  constructor({ message, width = message.length + 4, durationMs = 3000, onDismiss }: AlertOptions) {
    super();
    this.message = message;
    this.width = width;
    this.onDismiss = onDismiss;

    this.timerId = setTimeout(() => this.dismiss(), durationMs);
  }

  dismiss(): void {
    if (this.dismissed) return;
    this.dismissed = true;
    if (this.onDismiss) this.onDismiss();
  }

  draw(): string {
    const top = '╭' + '─'.repeat(this.width - 2) + '╮';
    const content = `│ ${this.message.padEnd(this.width - 4)} │\``;
    const bottom = '╰' + '─'.repeat(this.width - 2) + '╯`';
    const shadow = ' `' + '`'.repeat(this.width - 2) + '`';
    return [top, content, bottom, shadow].join('\n');
  }
}