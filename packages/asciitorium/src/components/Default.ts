import { Component, ComponentProps } from '../core/Component.js';

/**
 * Properties for Default component
 */
export type DefaultProps = ComponentProps;

/**
 * Default component for use within Switch as a fallback case.
 *
 * Example usage:
 * ```tsx
 * <Switch condition={userRole}>
 *   <Case when="admin"><AdminPanel /></Case>
 *   <Default><GuestPanel /></Default>
 * </Switch>
 * ```
 */
export class Default extends Component {
  constructor(props: DefaultProps) {
    super(props);
  }

  draw(): string[][] {
    // Default is a wrapper component - it doesn't render itself,
    // just its children
    return [[]];
  }
}
