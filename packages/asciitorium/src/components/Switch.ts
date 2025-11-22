import { Component, ComponentProps } from '../core/Component.js';
import type { State } from '../core/State.js';
import { Case } from './Case.js';
import { Default } from './Default.js';

/**
 * Properties for Switch component
 */
export interface SwitchProps extends ComponentProps {
  /** State that holds a factory function returning the component to display */
  component?: State<() => Component>;
  /** State that holds the condition string to match against Case components */
  condition?: State<string> | State<number>;
}

/**
 * Creates a Component instance from a factory function.
 *
 * @param factory The factory function that returns a Component instance
 * @returns Component instance or undefined if creation fails
 */
function makeComponent(factory: () => Component): Component | undefined {
  if (typeof factory !== 'function') {
    return undefined;
  }

  const result = factory();

  if (result instanceof Component) {
    return result;
  }

  return undefined;
}

/**
 * Switch component that displays a child component based on a reactive state.
 *
 * Inspired by React's conditional rendering patterns, this component provides
 * a clean way to dynamically switch between different components based on state.
 *
 * Two usage modes:
 *
 * 1. Factory function mode:
 * ```tsx
 * const currentView = new State(() => new DashboardView({ width: 100 }));
 * <Switch component={currentView} />
 * ```
 *
 * 2. Condition-based mode with Case/Default children (recommended):
 * ```tsx
 * const userRole = new State<string>("admin");
 * <Switch condition={userRole}>
 *   <Case when="admin"><AdminPanel /></Case>
 *   <Case when="user"><UserPanel /></Case>
 *   <Default><GuestPanel /></Default>
 * </Switch>
 * ```
 */
export class Switch extends Component {
  private componentState?: State<any>;
  private conditionState?: State<string> | State<number>;
  private cases: Case[] = [];
  private defaultCase?: Default;

  constructor(props: SwitchProps) {
    // Validation
    if (props.component && props.condition) {
      throw new Error('Switch cannot have both component and condition props');
    }

    if (!props.component && !props.condition) {
      throw new Error('Switch must have either component or condition prop');
    }

    // Prepare props: if condition mode, extract and remove children
    let processedProps = props;
    let extractedCases: Case[] = [];
    let extractedDefault: Default | undefined;

    if (props.condition) {
      // Extract Case and Default components from props.children
      const children = props.children ? (Array.isArray(props.children) ? props.children : [props.children]) : [];
      extractedCases = children.filter((c): c is Case => c instanceof Case);
      extractedDefault = children.find((c): c is Default => c instanceof Default);

      // Remove children from props so super() doesn't add them
      processedProps = { ...props, children: undefined };
    }

    // Call super with processed props
    super(processedProps);

    // Set up based on mode
    if (props.condition) {
      // Condition mode
      this.cases = extractedCases;
      this.defaultCase = extractedDefault;
      this.conditionState = props.condition;
      this.bind(this.conditionState as State<any>, () => this.updateContent());
    } else {
      // Legacy component mode
      this.componentState = props.component!;
      this.bind(this.componentState, () => this.updateContent());
    }

    // Set initial content
    this.updateContent();
  }

  /**
   * Override setChildren to capture Case and Default components in condition mode
   */
  setChildren(children: Component[]): void {
    if (this.conditionState) {
      // Extract Case and Default components
      this.cases = children.filter((c): c is Case => c instanceof Case);
      this.defaultCase = children.find((c): c is Default => c instanceof Default);

      // Update content based on current condition
      this.updateContent();
    } else {
      // Legacy component mode: just set children normally
      super.setChildren(children);
    }
  }

  /**
   * Updates the displayed content based on the current state value.
   * Clears existing children and creates the appropriate component.
   */
  private updateContent(): void {
    // Remove all existing children from Switch
    const childrenToRemove = [...this.children];
    for (const child of childrenToRemove) {
      child.destroy();
      this.removeChild(child);
    }

    // Condition mode: find matching Case or Default
    if (this.conditionState) {
      const currentCondition = this.conditionState.value;
      const matchingCase = this.cases.find(c => c.when === currentCondition);

      if (matchingCase) {
        // Check if Case has a component factory
        const factory = matchingCase.getComponentFactory();
        if (factory) {
          // Create new instance from factory
          const component = makeComponent(factory);
          if (component) {
            this.addChild(component);
          }
        } else {
          // Fallback: reuse existing children (NOT RECOMMENDED - components stay alive)
          for (const child of matchingCase.getChildren()) {

          console.warn('Switch: Case component missing create prop. Components will persist in memory and continue running. Use: <Case when="' + matchingCase.when + '" create={' + child.constructor.name + '} />');
            this.addChild(child);
          }
        }
      } else if (this.defaultCase) {
        // Check if Default has a component factory
        const factory = this.defaultCase.getComponentFactory();
        if (factory) {
          // Create new instance from factory
          const component = makeComponent(factory);
          if (component) {
            this.addChild(component);
          }
        } else {
          // Fallback: reuse existing children (NOT RECOMMENDED - components stay alive)
          console.error('Switch: Default component missing create prop. Components will persist in memory and continue running. Use: <Default create={YourComponent} />');
          for (const child of this.defaultCase.getChildren()) {
            this.addChild(child);
          }
        }
      }
    }
    // Legacy component mode
    else if (this.componentState) {
      const entry = this.componentState.value;

      if (entry) {
        const component = makeComponent(entry);
        if (component) {
          this.addChild(component);
        }
      }
    }

    // Notify the app that the focus tree has changed and needs reset
    this.notifyAppOfFocusReset();
  }

}