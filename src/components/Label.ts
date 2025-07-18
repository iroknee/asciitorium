import { Component } from './Component';

export class Label extends Component {
  constructor(
    public readonly label: string,
    public readonly width: number = label.length,
    public readonly height: number = 1
  ) {
    super();
  }

  draw(): string[][] {
    return [[...this.label]];
  }
}
