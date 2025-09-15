import { Component, ComponentProps } from '../core/Component';

export interface ColumnProps extends Omit<ComponentProps, 'layout'> {
  // Column-specific props can be added here
}

export class Column extends Component {
  constructor(props: ColumnProps = {}) {
    // Width should auto-size to children unless explicitly set
    // Height should auto-size to children unless explicitly set
    super({
      ...props,
      width: props.width, // Don't default width - let auto-sizing calculate from children
      height: props.height, // Don't default height - let auto-sizing calculate from children  
      layout: 'column',
      layoutOptions: {}
    });
  }

}