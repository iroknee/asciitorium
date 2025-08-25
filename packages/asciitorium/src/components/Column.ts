import { Component, ComponentProps } from '../core/Component';

export interface ColumnProps extends Omit<ComponentProps, 'layout'> {
  // Column-specific props can be added here
}

export class Column extends Component {
  constructor(props: ColumnProps = {}) {
    super({
      ...props,
      layout: 'column',
      layoutOptions: {}
    });
  }

  draw(): string[][] {
    super.draw();
    return this.buffer;
  }
}