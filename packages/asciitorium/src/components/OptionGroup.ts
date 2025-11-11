import { Component, ComponentProps } from '../core/Component.js';
import { State } from '../core/State.js';
import { Option } from './Option.js';

export interface OptionGroupProps<T = any> extends Omit<ComponentProps, 'children'> {
  label: string;
  children?: Option<T>[];
}

export class OptionGroup<T = any> extends Component {
  public readonly label: string;
  public readonly children: Option<T>[];

  constructor(props: OptionGroupProps<T>) {
    const { children, label, ...componentProps } = props;
    super({
      ...componentProps,
      width: 0,
      height: 0,
      visible: new State(false), // Data-only component, not visual
    });
    this.label = label;
    this.children = children || [];
  }

  override draw(): string[][] {
    // OptionGroup is not rendered directly, it's just a container
    return [[]];
  }
}
