// core/App.ts
import { VerticalLayout } from './layouts/VerticalLayout';
import { FocusManager } from './FocusManager';
import type { Renderer } from './Renderer';
import { Component } from './Component';

export interface AppProps {
  width: number;
  height: number;
  border?: boolean;
  fit?: boolean;
  renderer: Renderer;
  children?: Component | Component[];
}

export default class App extends VerticalLayout {
  readonly focus: FocusManager;
  private readonly renderer: Renderer;

  constructor(props: AppProps) {
    super({
      width: props.width,
      height: props.height,
      border: props.border,
      fit: props.fit ?? true,
    });

    this.renderer = props.renderer;
    this.focus = new FocusManager();

    // Add children
    if (props.children) {
      const list = Array.isArray(props.children)
        ? props.children
        : [props.children];
      for (const child of list) {
        this._registerAndAdd(child);
      }
    }

    this.focus.reset(this);
    this.render();

    // Global key listener
    window.addEventListener('keydown', (event) => {
      this.handleKey(event.key);
    });
  }

  render(): void {
    const screenBuffer = this.draw();
    this.renderer.render(screenBuffer);
  }

  addChild(component: Component): void {
    this._registerAndAdd(component);
    this.focus.reset(this);
    this.render();
  }

  removeChild(component: Component): void {
    super.removeChild(component);
    this.focus.reset(this);
    this.render();
  }

  handleKey(key: string): void {
    console.log(`App handling key: ${key}`);
    if (key === 'Tab') {
      event?.preventDefault();
      this.focus.focusNext();
      this.render();
      return;
    }

    if (this.focus.handleKey(key)) {
      this.render();
    }
  }

  private _registerAndAdd(component: Component) {
    component.setApp?.(this); // Inject app reference for reactivity
    super.addChild(component);
  }
}
