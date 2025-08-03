// core/App.ts
import { VerticalLayout, VerticalLayoutProps } from './layouts/VerticalLayout';
import { FocusManager } from './FocusManager';
import type { Renderer } from './Renderer';
import { Component } from './Component';

export interface AppProps extends VerticalLayoutProps {
  renderer: Renderer;
}

export class App extends VerticalLayout {
  readonly focus: FocusManager;
  private readonly renderer: Renderer;

  constructor(props: AppProps) {
    super(props);

    this.renderer = props.renderer;
    this.focus = new FocusManager();

    const list = Array.isArray(props.children)
      ? props.children
      : props.children
        ? [props.children]
        : [];

    for (const child of list) {
      this._registerAndAdd(child);
    }

    this.focus.reset(this);
    this.render();
  }

  render(): void {
    const screenBuffer = this.draw();
    this.renderer.render(screenBuffer);
  }

  addChild(component: Component): void {
    this._registerAndAdd(component);
    this.focus?.reset(this); // avoid crashing
    this.render();
  }

  removeChild(component: Component): void {
    super.removeChild(component);
    this.focus.reset(this);
    this.render();
  }

  handleKey(key: string): void {
    if (key === 'Tab') {
      this.focus.focusNext();
      this.render();
      event?.preventDefault();
      return;
    }

    if (key === 'Shift+Tab') {
      this.focus.focusPrevious();
      this.render();
      event?.preventDefault();
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
