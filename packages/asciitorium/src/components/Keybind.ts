import { Component, ComponentProps } from '../core/Component';
import { State } from '../core/State';

export interface KeybindOptions extends ComponentProps {
  keyBinding: string;    // e.g., "F12", "Ctrl+s", "Escape"
  action: () => void;    // Function to execute
  description?: string;  // Optional description for help
  disabled?: State<boolean> | boolean; // Reactive or static disable
}

export class Keybind extends Component {
  public readonly keyBinding: string;
  public readonly action: () => void;
  public readonly description?: string;
  private disabledState?: State<boolean>;
  private staticDisabled: boolean;
  private registrationAttempted = false;

  constructor(options: KeybindOptions) {
    super({
      ...options,
      width: 0,  // Invisible component
      height: 0,
      border: false,
      visible: new State(true) // Always visible to track component tree status
    });

    this.keyBinding = options.keyBinding;
    this.action = options.action;
    this.description = options.description;

    // Handle disabled state (reactive or static)
    if (options.disabled instanceof State) {
      this.disabledState = options.disabled;
      this.staticDisabled = false;
    } else {
      this.staticDisabled = options.disabled ?? false;
    }
  }

  get disabled(): boolean {
    return this.disabledState?.value ?? this.staticDisabled;
  }

  // Override setParent to register with App when added
  override setParent(parent: Component) {
    super.setParent(parent);
    this.registerWithApp();
  }

  private registerWithApp() {
    if (this.registrationAttempted) {
      return; // Prevent infinite loops
    }

    // Walk up parent chain to find App
    let current: Component | undefined = this.parent;
    while (current && !(current as any).isApp) {
      current = current.parent;
    }

    if (current && (current as any).registerKeybind) {
      (current as any).registerKeybind(this);
      this.registrationAttempted = true;
    } else {
      // Try again after a short delay in case the parent tree isn't fully built yet
      setTimeout(() => {
        this.registerWithApp();
      }, 0);
    }
  }

  // Called when component is removed
  override destroy() {
    this.unregisterWithApp();
    super.destroy();
  }

  private unregisterWithApp() {
    let current: Component | undefined = this.parent;
    while (current && !(current as any).isApp) {
      current = current.parent;
    }

    if (current && (current as any).unregisterKeybind) {
      (current as any).unregisterKeybind(this);
    }
  }

  override draw(): string[][] {
    return []; // Never renders
  }
}