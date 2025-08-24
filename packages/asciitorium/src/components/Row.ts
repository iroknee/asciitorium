import { Component, ComponentProps } from '../core/Component';

export interface RowProps extends Omit<ComponentProps, 'layout'> {
  fit?: boolean;
}

export class Row extends Component {
  constructor(props: RowProps = {}) {
    super({
      ...props,
      layout: 'row',
      layoutOptions: { fit: props.fit }
    });
  }

  draw(): string[][] {
    super.draw();
    return this.buffer;
  }
}