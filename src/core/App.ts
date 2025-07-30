// core/App.ts
import { Component } from './Component';
import { FocusManager } from './FocusManager';
import type { Renderer } from './Renderer';
import { VerticalLayout } from './VerticalLayout';

export interface AppProps {
  width: number;
  height: number;
  border?: boolean;
  fit?: boolean;
  renderer: Renderer;
  children?: Component | Component[];
}

export default class App {
  readonly canvas: VerticalLayout;
  readonly focus: FocusManager;
  private readonly renderer: Renderer;

  constructor(props: AppProps) {
    const { width, height, border = false, fit = true, renderer, children } = props;

    this.renderer = renderer;
    this.canvas = new VerticalLayout({
      width,
      height,
      border,
      fit,
    });
    this.focus = new FocusManager();

    // Normalize and add children
    if (children) {
      const list = Array.isArray(children) ? children : [children];
      for (const child of list) {
        this.canvas.addChild(child);
      }
    }

    this.focus.reset(this.canvas);
    this.render();
  }

  render() {
    const screenBuffer = this.canvas.draw();
    this.renderer.render(screenBuffer);
  }

  addChild(component: Component): void {
    this.canvas.addChild(component);
    this.focus.reset(this.canvas);
    this.render();
  }

  removeChild(component: Component): void {
    this.canvas.removeChild(component);
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
