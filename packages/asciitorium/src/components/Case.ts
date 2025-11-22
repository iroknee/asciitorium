import { Component, ComponentProps } from '../core/Component.js';
import { jsx } from '../jsx/jsx-runtime.js';

/**
 * Properties for Case component
 */
export interface CaseProps extends ComponentProps {
  /** The value to match against Switch condition */
  when: string | number;
  /** Component class or function to instantiate when this case matches */
  create?: any;
  /** Optional props to pass to the component */
  with?: any;
}

/**
 * Case component for use within Switch.
 *
 * Creates a new component instance every time this case is matched,
 * ensuring proper lifecycle management and clean state.
 *
 * Usage:
 * ```tsx
 * <Case when="admin" create={AdminPanel} />
 * <Case when="user" create={UserPanel} with={{ width: 50 }} />
 * ```
 *
 * WARNING: Do not use JSX children syntax - components will persist in memory!
 */
export class Case extends Component {
  public readonly when: string | number;
  private readonly componentFactory?: () => Component;

  constructor(props: CaseProps) {
    super(props);
    this.when = props.when;

    if (props.create) {
      // Create factory from create + with
      const componentType = props.create;
      const componentProps = props.with || {};
      this.componentFactory = () => jsx(componentType, componentProps);
    } else if (props.children && props.children.length > 0) {
      // Warn about using children
      console.error('Case: Using JSX children is not supported. Components will persist in memory and continue running. Use create prop instead: <Case when="' + props.when + '" create={YourComponent} />');
    }
  }

  /**
   * Returns the component factory function if provided.
   */
  getComponentFactory(): (() => Component) | undefined {
    return this.componentFactory;
  }

  draw(): string[][] {
    // Case is a wrapper component - it doesn't render itself,
    // just its children
    return [[]];
  }
}
