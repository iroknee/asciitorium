import { Component, ComponentProps } from '../core/Component';

export interface ColumnProps extends Omit<ComponentProps, 'layout'> {
  fit?: boolean;
}

export class Column extends Component {
  constructor(props: ColumnProps = {}) {
    super({
      ...props,
      layout: 'column',
      layoutOptions: { fit: props.fit }
    });
  }

  draw(): string[][] {
    super.draw();
    return this.buffer;
  }
}