import { Component, ComponentProps } from '../core/Component';

export interface RowProps extends Omit<ComponentProps, 'layout'> {
  // Row-specific props can be added here
}

export class Row extends Component {
  constructor(props: RowProps = {}) {
    if (props.width === undefined) props.width = 'fill';
    super({
      ...props,
      layout: 'row',
      layoutOptions: { align: props.align }
    });
  }

  draw(): string[][] {
    super.draw();
    return this.buffer;
  }
}