import { Component, ComponentProps } from '../core/Component';
import { State } from '../core/State';
import { Tab } from './Tab';

export interface TabContainerOptions extends Omit<ComponentProps, 'children'> {
  selectedIndex?: State<number>;
  children: Tab[];
}

export class TabContainer extends Component {
  private readonly selectedIndex: State<number>;
  private readonly tabComponents: Tab[];
  private readonly tabLabels: string[];
  private currentContent?: Component;

  focusable = true;
  hasFocus = false;

  constructor(options: TabContainerOptions) {
    const { children, selectedIndex, ...componentProps } = options;
    
    const tabComponents = children || [];
    const tabLabels = tabComponents.map(tab => tab.label);
    
    // Default to fill for both width and height
    const width = options.width ?? 'fill';
    const height = options.height ?? 'fill';
    const border = options.border ?? true;

    super({ ...componentProps, width, height, border });

    this.tabComponents = tabComponents;
    this.tabLabels = tabLabels;
    this.selectedIndex = selectedIndex || new State(0);

    this.bind(this.selectedIndex, () => {
      this.updateContent();
    });

    // Initialize content
    this.updateContent();
  }

  private updateContent() {
    const selectedTab = this.tabComponents[this.selectedIndex.value];
    
    // Remove current content if it exists
    if (this.currentContent) {
      const index = this.children.indexOf(this.currentContent);
      if (index !== -1) {
        this.children.splice(index, 1);
      }
      this.currentContent = undefined;
    }

    // Add new content if it exists
    if (selectedTab) {
      this.currentContent = selectedTab;
      // Position content below the tabs (tabs are height 3)
      this.currentContent.x = this.border ? 1 : 0;
      this.currentContent.y = 3 + (this.border ? 1 : 0);
      this.currentContent.width = this.width - (this.border ? 2 : 0);
      this.currentContent.height = this.height - 3 - (this.border ? 2 : 0);
      this.currentContent.setParent(this);
      this.children.push(this.currentContent);
    }
  }

  override handleEvent(event: string): boolean {
    const prevIndex = this.selectedIndex.value;

    // Handle tab navigation
    if ((event === 'ArrowLeft' || event === 'a') && this.selectedIndex.value > 0) {
      this.selectedIndex.value--;
    } else if (
      (event === 'ArrowRight' || event === 'd') &&
      this.selectedIndex.value < this.tabLabels.length - 1
    ) {
      this.selectedIndex.value++;
    }

    if (this.selectedIndex.value !== prevIndex) {
      return true;
    }
    
    // Try current content
    if (this.currentContent && this.currentContent.handleEvent(event)) {
      return true;
    }

    return super.handleEvent(event);
  }

  override draw(): string[][] {
    const buffer = super.draw();
    const borderPad = this.border ? 1 : 0;
    const tabY = Math.floor(3 / 2);

    // Calculate total width of all tabs and separators
    let totalTabWidth = 0;
    for (let i = 0; i < this.tabLabels.length; i++) {
      const label = this.tabLabels[i];
      const isSelected = i === this.selectedIndex.value && this.hasFocus;
      const text = isSelected ? `>${label}<` : ` ${label} `;
      totalTabWidth += text.length;
      
      // Add separator width (except for last tab)
      if (i < this.tabLabels.length - 1) {
        totalTabWidth += 1;
      }
    }

    // Calculate starting position to center tabs
    const availableWidth = this.width - (2 * borderPad);
    const startX = borderPad + Math.max(0, Math.floor((availableWidth - totalTabWidth) / 2));

      // remove top border where tabs will be drawn
      for (let j = 0; j < this.width; j++) {
        buffer[tabY-1][j] = ' ';
        buffer[tabY][j] = '─';
      }
      if (this.border) buffer[tabY][0] = '╭';

    // Draw tabs
    let x = startX;
    buffer[tabY-1][x-1] = '╭';
    buffer[tabY][x-1] = '┤';
    buffer[tabY+1][x-1] = '╰';
    for (let i = 0; i < this.tabLabels.length; i++) {
      const label = this.tabLabels[i];
      const isSelected = i === this.selectedIndex.value && this.hasFocus;
      const text = isSelected ? `>${label}<` : ` ${label} `;

      for (let j = 0; j < text.length && x + j < this.width - borderPad; j++) {
        buffer[tabY-1][x + j] = '─';
        buffer[tabY][x + j] = text[j];
        buffer[tabY+1][x + j] = '─';
      }

      x += text.length;

      // Separator, unless it's the last tab
      if (i < this.tabLabels.length - 1 && x < this.width - borderPad - 1) {
        buffer[tabY - 1][x] = '┬';
        buffer[tabY][x] = '│';
        buffer[tabY + 1][x] = '┴';
        x += 1;
      }
    }
    buffer[tabY-1][x] = '╮';
    buffer[tabY][x] = '├';
    buffer[tabY+1][x] = '╯';
    for (let j = x + 1; j < this.width - borderPad; j++) {
      buffer[tabY-1][j] = ' ';
      buffer[tabY][j] = '─';
    }
    buffer[tabY-1][this.width - borderPad] = ' ';
    if (this.border)buffer[tabY][this.width - borderPad] = '╮';

    this.buffer = buffer;
    return buffer;
  }
}