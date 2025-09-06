import { Component, ComponentProps } from '../core/Component';

export interface TabOptions extends ComponentProps {
  label: string;
}

export class Tab extends Component {
  readonly label: string;

  constructor(options: TabOptions) {
    super({
      ...options,
      width: options.width || 'fill',
      height: options.height || 'fill',
      gap: options.gap || { top: 3 },
      showLabel: false,
    });
    
    this.label = options.label;
  }
}
