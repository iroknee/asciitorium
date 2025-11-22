import { Component, ComponentProps } from '../core/Component.js';
import { jsx } from '../jsx/jsx-runtime.js';

/**
 * Properties for Default component
 */
export interface DefaultProps extends ComponentProps {
  /** Component class or function to instantiate as fallback */
  create?: any;
  /** Optional props to pass to the component */
  with?: any;
}

/**
 * Default component for use within Switch as a fallback case.
 *
 * Creates a new component instance when no Case matches,
 * ensuring proper lifecycle management and clean state.
 *
 * Usage:
 * ```tsx
 * <Default create={GuestPanel} />
 * <Default create={GuestPanel} with={{ width: 50 }} />
 * ```
 *
 * WARNING: Do not use JSX children syntax - components will persist in memory!
 */
export class Default extends Component {
  private readonly componentFactory?: () => Component;

  constructor(props: DefaultProps) {
    super(props);

    if (props.create) {
      // Create factory from create + with
      const componentType = props.create;
      const componentProps = props.with || {};
      this.componentFactory = () => jsx(componentType, componentProps);
    } else if (props.children && props.children.length > 0) {
      // Warn about using children
      console.error('Default: Using JSX children is not supported. Components will persist in memory and continue running. Use create prop instead: <Default create={YourComponent} />');
    }
  }

  /**
   * Returns the component factory function if provided.
   */
  getComponentFactory(): (() => Component) | undefined {
    return this.componentFactory;
  }

  draw(): string[][] {
    // Default is a wrapper component - it doesn't render itself,
    // just its children
    return [[]];
  }
}
