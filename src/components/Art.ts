import { Component } from '../core/Component';

export class Art extends Component {
  public readonly width: number;
  public readonly height: number;
  private readonly content: string[][];

  constructor(art: string) {
    super();

    const lines = art.split('\n');
    this.height = lines.length;
    this.width = Math.max(...lines.map(line => line.length));
    this.content = lines.map(line => [...line.padEnd(this.width)]);
  }

  draw(): string[][] {
    return this.content;
  }
}