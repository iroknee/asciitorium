import { Component } from './Component';
import { Container } from './Container';
import { FocusManager } from './FocusManager';
import { AddComponentLayout } from './types';

export interface AppOptions {
  width: number;
  height: number;
  border?: boolean;
  fontFamily?: string;
}

export default class App {
  readonly screen: HTMLElement;
  readonly canvas: Container;
  readonly focus: FocusManager;
  readonly fontFamily: string;

  constructor(options: AppOptions) {
    const { width, height, border = false, fontFamily = 'monospace' } = options;

    this.fontFamily = fontFamily;

    this.canvas = new Container({ width, height, border });
    this.screen = document.getElementById('screen')!;
    this.screen.style.fontFamily = fontFamily;

    this.focus = new FocusManager();
    this.focus.getFocusableDescendants(this.canvas);

    window.addEventListener('keydown', (event) => {
      if (event.key === 'Tab') {
        event.preventDefault();
        this.focus.focusNext();
        this.render();
        return;
      }

      if (this.focus.handleKey(event.key)) {
        event.preventDefault();
        this.render();
        return;
      }
    });
  }

  render() {
    const screenBuffer = this.canvas.draw();
    // console.log(screenBuffer.map((row) => row.join('')).join('\n'));
    this.screen.textContent = screenBuffer
      .map((row) => row.join(''))
      .join('\n');
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
}
