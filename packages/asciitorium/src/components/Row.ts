import { Component, ComponentProps } from '../core/Component';

export interface RowProps extends Omit<ComponentProps, 'layout'> {
  // Row-specific props can be added here
}

export class Row extends Component {
  constructor(props: RowProps = {}) {
    super({
      ...props,
      layout: 'row',
      layoutOptions: {}
    });
  }

  draw(): string[][] {
    super.draw();
    return this.buffer;
  }
}