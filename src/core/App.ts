// core/App.ts
import { VerticalLayout, VerticalLayoutProps } from './layouts/VerticalLayout';
import { FocusManager } from './FocusManager';
import type { Renderer } from './renderers/Renderer';
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
  const screenBuffer = Array.from({ length: this.height }, () =>
    Array.from({ length: this.width }, () => ' ')
  );

  // Flatten and sort components by z-index
  const allComponents = this.getAllDescendants().concat([this]);
  allComponents.sort((a, b) => (a.z ?? 0) - (b.z ?? 0));

  for (const component of allComponents) {
    const buffer = component.draw();
    const x = component.x;
    const y = component.y;
    const transparentChar = component.transparentChar;

    for (let row = 0; row < buffer.length; row++) {
      const globalY = y + row;
      if (globalY < 0 || globalY >= this.height) continue;

      for (let col = 0; col < buffer[row].length; col++) {
        const globalX = x + col;
        if (globalX < 0 || globalX >= this.width) continue;

        const char = buffer[row][col];
        if (char !== transparentChar) {
          screenBuffer[globalY][globalX] = char;
        }
      }
    }
  }

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
