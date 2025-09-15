import { Component, ComponentProps } from '../core/Component';
import type { State } from '../core/State';

/**
 * Properties for ConditionalRenderer component
 */
export interface ConditionalRendererProps extends ComponentProps {
  /** State that determines which component to display */
  selectedKey: State<string>;

  /** Map of keys to components (instances, classes, or factory functions) */
  componentMap: Record<
    string,
    Component | (() => Component) | (new (...args: any[]) => Component)
  >;

  /** Optional fallback component when selectedKey doesn't match any map entry */
  fallback?:
    | Component
    | (() => Component)
    | (new (...args: any[]) => Component);
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
 * ConditionalRenderer component that displays different child components
 * based on a reactive state key, inspired by React's conditional rendering patterns.
 *
 * This component follows React conventions:
 * - Uses conditional rendering instead of configuration
 * - Separates "what to render" from "how to render"
 * - Provides a declarative API for dynamic content switching
 *
 * Example usage:
 * ```tsx
 * const selectedView = new State('home');
 *
 * <ConditionalRenderer
 *   selectedKey={selectedView}
 *   componentMap={{
 *     'home': HomeComponent,
 *     'settings': () => new SettingsComponent({}),
 *     'about': new AboutComponent({})
 *   }}
 *   fallback={NotFoundComponent}
 * />
 * ```
 */
export class ConditionalRenderer extends Component {
  private selectedKey: State<string>;
  private componentMap: Record<string, any>;
  private fallbackComponent?: any;

  constructor(props: ConditionalRendererProps) {
    super(props);

    this.selectedKey = props.selectedKey;
    this.componentMap = props.componentMap;
    this.fallbackComponent = props.fallback;

    // Subscribe to state changes and update content
    this.bind(this.selectedKey, () => this.updateContent());

    // Set initial content
    this.updateContent();
  }

  /**
   * Updates the displayed content based on the current selectedKey value.
   * Clears existing children and creates the appropriate component.
   */
  private updateContent(): void {
    // Remove all existing children
    const childrenToRemove = [...this.children];
    for (const child of childrenToRemove) {
      child.destroy();
      this.removeChild(child);
    }

    // Get the current component entry
    const key = this.selectedKey.value;
    const entry = this.componentMap[key];

    if (entry) {
      const component = makeComponent(entry);
      if (component) {
        this.addChild(component);
      }
    } else if (this.fallbackComponent) {
      const fallbackComponent = makeComponent(this.fallbackComponent);
      if (fallbackComponent) {
        this.addChild(fallbackComponent);
      }
    }

    // Notify the app that the focus tree has changed and needs reset
    this.notifyAppOfFocusReset();
  }

}