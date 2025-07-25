import { Component } from '../core/Component';

export class HorizontalLine extends Component {
  readonly width: number;
  readonly height: number = 1;

  constructor(width: number) {
    super();
    this.width = width;
  }

  draw(): string[][] {
    return [Array.from('⎺'.repeat(this.width))];
  }
}
