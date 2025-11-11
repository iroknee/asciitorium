import { Component, ComponentProps } from '../core/Component.js';
import { State } from '../core/State.js';

export interface OptionProps<T = any> extends Omit<ComponentProps, 'children'> {
  value: T;
  children?: string;
}

export class Option<T = any> extends Component {
  public readonly value: T;
  public readonly label: string;

  constructor(props: OptionProps<T>) {
    const { children: childrenString, ...componentProps } = props;
    super({
      ...componentProps,
      width: 0,
      height: 0,
      visible: new State(false), // Data-only component, not visual
    });
    this.value = props.value;
    this.label = childrenString || String(props.value);
  }

  override draw(): string[][] {
    // Option is not rendered directly, it's just a data container
    return [[]];
  }
}
