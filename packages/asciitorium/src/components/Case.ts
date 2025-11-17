import { Component, ComponentProps } from '../core/Component.js';

/**
 * Properties for Case component
 */
export interface CaseProps extends ComponentProps {
  /** The value to match against Switch condition */
  when: string | number;
}

/**
 * Case component for use within Switch.
 *
 * Example usage:
 * ```tsx
 * <Switch condition={userRole}>
 *   <Case when="admin"><AdminPanel /></Case>
 *   <Case when="user"><UserPanel /></Case>
 * </Switch>
 * ```
 */
export class Case extends Component {
  public readonly when: string | number;

  constructor(props: CaseProps) {
    super(props);
    this.when = props.when;
  }

  draw(): string[][] {
    // Case is a wrapper component - it doesn't render itself,
    // just its children
    return [[]];
  }
}
