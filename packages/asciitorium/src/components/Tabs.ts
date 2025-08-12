import { Component, ComponentProps } from '../core/Component';
import { State } from '../core/State';

export interface TabsOptions extends Omit<ComponentProps, 'height' | 'width'> {
  tabs: string[];
  selectedTab: State<string>;
  height?: number;
  width?: number;
}

export class Tabs extends Component {
  private readonly tabs: string[];
  private readonly selectedTab: State<string>;
  private selectedIndex: number = 0;

  focusable = true;
  hasFocus = false;

  constructor(options: TabsOptions) {
    const height = 3;
    // if width is not provided, default to tab lenghths summed together
    const width =
      options.width ??
      options.tabs.reduce((sum, tab) => sum + tab.length + 2, 2) +
        (options.tabs.length - 1); // account for separators

    const border = options.border ?? true;

    super({ ...options, height, width, border });

    this.tabs = options.tabs;
    this.selectedTab = options.selectedTab;

    this.selectedIndex = Math.max(
      0,
      this.tabs.findIndex((tab) => tab === this.selectedTab.value)
    );

    this.bind(this.selectedTab, (value) => {
      const index = this.tabs.indexOf(value);
      if (index !== -1 && index !== this.selectedIndex) {
        this.selectedIndex = index;
      }
    });
  }

  override handleEvent(event: string): boolean {
    const prevIndex = this.selectedIndex;

    if ((event === 'ArrowLeft' || event === 'a') && this.selectedIndex > 0) {
      this.selectedIndex--;
    } else if (
      (event === 'ArrowRight' || event === 'd') &&
      this.selectedIndex < this.tabs.length - 1
    ) {
      this.selectedIndex++;
    }

    if (this.selectedIndex !== prevIndex) {
      this.selectedTab.value = this.tabs[this.selectedIndex];
      return true;
    }

    return false;
  }

  override draw(): string[][] {
    const buffer = super.draw();
    const borderPad = this.border ? 1 : 0;
    const y = Math.floor(this.height / 2);

    let x = borderPad;
    for (let i = 0; i < this.tabs.length; i++) {
      const label = this.tabs[i];
      const isSelected = i === this.selectedIndex && this.hasFocus;
      const text = isSelected ? `[${label}]` : ` ${label} `;

      for (let j = 0; j < text.length && x + j < this.width - borderPad; j++) {
        buffer[y][x + j] = text[j];
      }

      x += text.length;

      // Separator, unless it's the last tab
      if (i < this.tabs.length - 1 && x < this.width - borderPad - 1) {
        buffer[y][x] = '⏐';
        x += 1;
      }
    }
    this.buffer = buffer;
    return buffer;
  }
}
