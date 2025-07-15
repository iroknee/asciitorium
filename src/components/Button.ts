import { Component } from "./Component";

export class Button extends Component {
  constructor(
    public readonly label: string,
    public readonly width: number = label.length + 4,
    public readonly height: number = 3
  ) {
    super();
  }

  draw(): string {
    const top = '┌' + '─'.repeat(this.width - 2) + '┐';
    const label = `│ ${this.label.padEnd(this.width - 4)} │`;
    const bottom = '└' + '─'.repeat(this.width - 2) + '┘';
    return [top, label, bottom].join('\n');
  }
}