import { Component, ComponentProps } from '../core/Component.js';
import type { State } from '../core/State.js';

/**
 * Properties for Switch component
 */
export interface SwitchProps extends ComponentProps {
  /** State that holds the component to display (instance, class, or factory) */
  component: State<Component | (() => Component) | (new (...args: any[]) => Component)>;
}

/**
 * Type guard to check if a value is a Component constructor.
 */
function isComponentCtor(v: any): v is new (...args: any[]) => Component {
  return (
    typeof v === 'function' && v.prototype && v.prototype instanceof Component
  );
}

/**
 * Type guard to check if an object implements the Component interface
 * using duck typing for cross-bundle compatibility.
 */
function isComponentLike(obj: any): obj is Component {
  return obj &&
         typeof obj === 'object' &&
         typeof obj.draw === 'function' &&
         typeof obj.setParent === 'function' &&
         typeof obj.handleEvent === 'function';
}

/**
 * Creates a Component instance from various input types:
 * - Component instance (returned as-is)
 * - Component-like object (duck-typed compatibility)
 * - Component constructor (instantiated with empty props)
 * - Factory function (called and result validated)
 *
 * @param entry The component source (instance, constructor, or factory)
 * @returns Component instance or undefined if creation fails
 */
function makeComponent(entry: any): Component | undefined {
  if (entry instanceof Component) return entry;

  if (isComponentLike(entry)) return entry;

  if (isComponentCtor(entry)) return new entry({});

  if (typeof entry === 'function') {
    const result = entry();
    if (result instanceof Component) return result;
    if (isComponentLike(result)) return result;
  }

  return undefined;
}

/**
 * Switch component that displays a child component based on a reactive state.
 *
 * Inspired by React's conditional rendering patterns, this component provides
 * a clean way to dynamically switch between different components based on state.
 *
 * Example usage:
 * ```tsx
 * const currentView = new State<any>(DashboardComponent);
 *
 * <Switch component={currentView} />
 * ```
 */
export class Switch extends Component {
  private componentState: State<any>;

  constructor(props: SwitchProps) {
    super(props);

    this.componentState = props.component;
    this.bind(this.componentState, () => this.updateContent());

    // Set initial content
    this.updateContent();
  }

  /**
   * Updates the displayed content based on the current state value.
   * Clears existing children and creates the appropriate component.
   */
  private updateContent(): void {
    // Remove all existing children
    const childrenToRemove = [...this.children];
    for (const child of childrenToRemove) {
      child.destroy();
      this.removeChild(child);
    }

    const entry = this.componentState.value;

    if (entry) {
      const component = makeComponent(entry);
      if (component) {
        this.addChild(component);
      }
    }

    // Notify the app that the focus tree has changed and needs reset
    this.notifyAppOfFocusReset();
  }

}