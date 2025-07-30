// core/App.ts
import { Component } from './Component';
import { Container } from './Container';
import { FocusManager } from './FocusManager';
import { AddComponentLayout } from './types';
import type { Renderer } from './Renderer';

export interface AppProps {
  width: number;
  height: number;
  border?: boolean;
  fontFamily?: string;
  renderer: Renderer;
  children?: Component | Component[];
}

export default class App {
  readonly canvas: Container;
  readonly focus: FocusManager;
  readonly fontFamily: string;
  private readonly renderer: Renderer;

  constructor(props: AppProps) {
    const {
      width,
      height,
      border = false,
      fontFamily = 'monospace',
      renderer,
      children,
    } = props;

    this.fontFamily = fontFamily;
    this.renderer = renderer;
    this.canvas = new Container({ width, height, border });
    this.focus = new FocusManager();

    // Normalize and add children
    if (children) {
      const list = Array.isArray(children) ? children : [children];
      for (const child of list) {
        this.canvas.add({ component: child });
      }
    }

    this.focus.reset(this.canvas);
    this.render();
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
