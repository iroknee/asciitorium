import { Component, ComponentProps } from '../core/Component.js';
import { State } from '../core/State.js';

export type MobileButtonId =
  | 'btn-up'
  | 'btn-down'
  | 'btn-left'
  | 'btn-right'
  | 'btn-a'
  | 'btn-b'
  | 'btn-x'
  | 'btn-y'
  | 'btn-menu';

export interface MobileControllerProps extends ComponentProps {
  dpad?: {
    up?: () => void;
    down?: () => void;
    left?: () => void;
    right?: () => void;
  };
  buttons?: {
    a?: () => void;
    b?: () => void;
    x?: () => void;
    y?: () => void;
  };
  menu?: () => void;
  enabled?: State<boolean> | boolean;
  priority?: number;
}

export class MobileController extends Component {
  public readonly priority: number;
  private disabledState?: State<boolean>;
  private staticDisabled: boolean;
  private actionMap: Map<MobileButtonId, () => void>;
  private registrationAttempted = false;
  private timeoutId?: number;
  private destroyed = false;

  constructor(props: MobileControllerProps) {
    super({
      ...props,
      width: 0, // Non-visual component
      height: 0,
      border: false,
      visible: new State(false), // Explicitly invisible - not a visual component
    });

    this.priority = props.priority ?? 0;

    // Handle enabled/disabled state (reactive or static)
    if (props.enabled instanceof State) {
      // Store the State directly, we'll invert in the disabled getter
      this.disabledState = props.enabled;
      this.staticDisabled = false;
    } else {
      // Static enabled: invert to disabled
      this.staticDisabled = !(props.enabled ?? true); // Default enabled = not disabled
    }

    // Build action map from props
    this.actionMap = new Map();

    if (props.dpad) {
      if (props.dpad.up) this.actionMap.set('btn-up', props.dpad.up);
      if (props.dpad.down) this.actionMap.set('btn-down', props.dpad.down);
      if (props.dpad.left) this.actionMap.set('btn-left', props.dpad.left);
      if (props.dpad.right) this.actionMap.set('btn-right', props.dpad.right);
    }

    if (props.buttons) {
      if (props.buttons.a) this.actionMap.set('btn-a', props.buttons.a);
      if (props.buttons.b) this.actionMap.set('btn-b', props.buttons.b);
      if (props.buttons.x) this.actionMap.set('btn-x', props.buttons.x);
      if (props.buttons.y) this.actionMap.set('btn-y', props.buttons.y);
    }

    if (props.menu) {
      this.actionMap.set('btn-menu', props.menu);
    }
  }

  get disabled(): boolean {
    // If using reactive State, invert enabled to disabled
    if (this.disabledState) {
      return !this.disabledState.value; // enabled State -> invert to disabled
    }
    return this.staticDisabled;
  }

  /**
   * Handle a button press
   * @returns true if this controller handled the button, false otherwise
   */
  handleButton(buttonId: MobileButtonId): boolean {
    const action = this.actionMap.get(buttonId);
    if (action) {
      action();
      return true;
    }
    return false;
  }

  // Override setParent to register with App when added
  override setParent(parent: Component) {
    super.setParent(parent);
    this.registerWithApp();
  }

  private registerWithApp() {
    if (this.registrationAttempted || this.destroyed) {
      return; // Prevent infinite loops and registration after destruction
    }

    // Walk up parent chain to find App
    let current: Component | undefined = this.parent;
    while (current && !(current as any).isApp) {
      current = current.parent;
    }

    if (current && (current as any).registerMobileController) {
      (current as any).registerMobileController(this);
      this.registrationAttempted = true;
    } else {
      // Try again after a short delay in case the parent tree isn't fully built yet
      this.timeoutId = setTimeout(() => {
        if (!this.destroyed) {
          this.registerWithApp();
        }
      }, 0) as unknown as number;
    }
  }

  // Called when component is removed
  override destroy() {
    this.destroyed = true;

    // Clear any pending registration timeout
    if (this.timeoutId !== undefined) {
      clearTimeout(this.timeoutId);
      this.timeoutId = undefined;
    }

    this.unregisterWithApp();
    super.destroy();
  }

  private unregisterWithApp() {
    let current: Component | undefined = this.parent;
    while (current && !(current as any).isApp) {
      current = current.parent;
    }

    if (current && (current as any).unregisterMobileController) {
      (current as any).unregisterMobileController(this);
    }
  }

  override draw(): string[][] {
    return []; // Never renders
  }
}
