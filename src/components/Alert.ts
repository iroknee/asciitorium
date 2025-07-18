import { Component } from './Component';
import { Button } from './Button';
import { Container } from './Container';
import { Label } from './Label';

export interface AlertOptions {
  message: string;
  width?: number;
  durationMs?: number;
  onDismiss?: () => void;
}

export class Alert extends Container {
  readonly message: string;
  private timerId?: ReturnType<typeof setTimeout>;
  private dismissed = false;
  private onDismiss?: () => void;

  private okButton: Button;

  constructor({
    message,
    width = message.length + 6,
    durationMs,
    onDismiss,
  }: AlertOptions) {
    super({ width, height: 6, border: true });
    this.message = message;
    this.onDismiss = onDismiss;

    // Create dismissible OK button
    this.okButton = new Button({
      label: ' OK ',
      onClick: () => this.dismiss(),
    });

    this.add({ component: new Label(message), alignX: 'center', alignY: 1 });
    this.add({ component: this.okButton, alignX: 'right', alignY: 'bottom' });

    // Auto-dismiss timer (optional)
    if (durationMs !== undefined) {
      this.timerId = setTimeout(() => this.dismiss(), durationMs);
    }
  }

  dismiss(): void {
    if (this.dismissed) return;
    this.dismissed = true;
    if (this.timerId) clearTimeout(this.timerId);
    this.onDismiss?.();
  }

  getFocusableDescendants(): Component[] {
    return [this.okButton];
  }

  draw(): string[][] {
    const top = '╭' + '─'.repeat(this.width - 2) + '╮';
    const msgLine = `│ ${this.message.padEnd(this.width - 4)} │`;
    const spacer = `│${' '.repeat(this.width - 2)}│`;
    const buttonLine = `│${' '.repeat(Math.floor((this.width - this.okButton.width) / 2) - 1)}${this.okButton.draw()}${' '.repeat(Math.ceil((this.width - this.okButton.width) / 2) - 1)}│`;
    const bottom = '╰' + '─'.repeat(this.width - 2) + '╯';
    return [[...top], [...msgLine], [...spacer], [...buttonLine], [...bottom]];
  }
}
