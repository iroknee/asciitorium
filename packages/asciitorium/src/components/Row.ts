import { Component, ComponentProps } from '../core/Component';

export interface RowProps extends Omit<ComponentProps, 'layout'> {
  // Row-specific props can be added here
}

export class Row extends Component {
  constructor(props: RowProps = {}) {
    // Set width to 'fill' only if explicitly needed, otherwise let auto-sizing work
    // Height should auto-size to children unless explicitly set
    super({
      ...props,
      width: props.width ?? 'fill', // Keep 'fill' for width as rows typically span horizontally
      height: props.height, // Don't default height - let auto-sizing calculate from children
      layout: 'row',
      layoutOptions: { align: props.align }
    });
  }

}