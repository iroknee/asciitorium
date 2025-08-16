import { Component, ComponentProps } from '../core/Component';
import { LayoutType } from '../core/layouts/LayoutStrategy';

export interface BoxOptions extends ComponentProps {
  layout?: LayoutType;
}

export class Box extends Component {
  constructor(options: BoxOptions) {
    super({
      ...options,
      layout: options.layout ?? 'vertical', // Default to vertical layout
    });
  }

  draw(): string[][] {
    return super.draw(); // Uses Component's built-in rendering with children support
  }
}