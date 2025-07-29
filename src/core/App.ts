// core/App.ts
import { Component } from './Component';
import { Container } from './Container';
import { FocusManager } from './FocusManager';
import { AddComponentLayout } from './types';
import type { Renderer } from './Renderer';

export interface AppOptions {
  width: number;
  height: number;
  border?: boolean;
  fontFamily?: string;
  renderer: Renderer;
}

export default class App {
  readonly canvas: Container;
  readonly focus: FocusManager;
  readonly fontFamily: string;
  private readonly renderer: Renderer;

  constructor(options: AppOptions) {
    const { width, height, border = false, fontFamily = 'monospace', renderer } = options;

    this.fontFamily = fontFamily;
    this.renderer = renderer;
    this.canvas = new Container({ width, height, border });
    this.focus = new FocusManager();
    this.focus.getFocusableDescendants(this.canvas);
  }

  render() {
    const screenBuffer = this.canvas.draw();
    this.renderer.render(screenBuffer);
  }

  add(componentLayout: AddComponentLayout): void {
    this.canvas.add(componentLayout);
    this.focus.reset(this.canvas);
    this.render();
  }

  remove(component: Component): void {
    this.canvas.remove(component);
    this.focus.reset(this.canvas);
    this.render();
  }

  handleKey(key: string): void {
    if (key === 'Tab') {
      this.focus.focusNext();
      this.render();
      return;
    }

    if (this.focus.handleKey(key)) {
      this.render();
    }
  }
}