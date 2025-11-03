import { Component, ComponentProps } from '../core/Component.js';

export interface RowProps extends Omit<ComponentProps, 'layout'> {
  // Row-specific props can be added here
}

export class Row extends Component {
  constructor(props: RowProps = {}) {
    super({
      ...props,
      width: props.width ?? props.style?.width ?? 'fill', // Keep 'fill' for width as rows typically span horizontally
      layout: 'row',
      layoutOptions: {}
    });
  }

}