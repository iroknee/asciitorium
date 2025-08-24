import { Component, ComponentProps } from '../core/Component';
import { State } from '../core/State';

export interface SelectOptions extends Omit<ComponentProps, 'height'> {
  items: string[];
  selectedItem: State<string>;
  height?: number;
}

export class Select extends Component {
  private readonly items: string[];
  private readonly selectedItem: State<string>;
  private focusedIndex: number = 0;
  private selectedIndex: number = 0;

  focusable = true;
  hasFocus = false;

  constructor(options: SelectOptions) {
    const height = options.height ?? 3;
    const border = options.border ?? true;

    super({ ...options, height, border });

    this.items = options.items;
    this.selectedItem = options.selectedItem;

    const initialSelectedIndex = Math.max(
      0,
      this.items.findIndex((item) => item === this.selectedItem.value)
    );
    this.selectedIndex = initialSelectedIndex;
    this.focusedIndex = initialSelectedIndex;

    this.bind(this.selectedItem, (value) => {
      const index = this.items.indexOf(value);
      if (index !== -1 && index !== this.selectedIndex) {
        this.selectedIndex = index;
        this.focusedIndex = index;
      }
    });
  }

  override handleEvent(event: string): boolean {
    const prevFocusedIndex = this.focusedIndex;
    const prevSelectedIndex = this.selectedIndex;

    // Navigation (arrow keys move the focus cursor)
    if ((event === 'ArrowUp' || event === 'w') && this.focusedIndex > 0) {
      this.focusedIndex--;
    } else if (
      (event === 'ArrowDown' || event === 's') &&
      this.focusedIndex < this.items.length - 1
    ) {
      this.focusedIndex++;
    }
    // Selection (space/enter selects the focused item)
    else if (event === ' ' || event === 'Enter') {
      this.selectedIndex = this.focusedIndex;
      this.selectedItem.value = this.items[this.selectedIndex];
    }

    // Return true if any state changed
    return (
      this.focusedIndex !== prevFocusedIndex ||
      this.selectedIndex !== prevSelectedIndex
    );
  }

  override draw(): string[][] {
    const buffer = super.draw();
    const borderPad = this.border ? 1 : 0;
    const paddingTop = this.height < 5 ? 0 : 1;
    const lineHeight = 2;
    const innerHeight = this.height - 2 * borderPad - paddingTop;

    const maxVisible = Math.max(1, Math.floor(innerHeight / lineHeight));
    const itemCount = this.items.length;

    const startIdx = Math.max(
      0,
      Math.min(
        this.selectedIndex - Math.floor(maxVisible / 2),
        Math.max(0, itemCount - maxVisible)
      )
    );

    // Update scroll calculation to use focusedIndex
    const focusedStartIdx = Math.max(
      0,
      Math.min(
        this.focusedIndex - Math.floor(maxVisible / 2),
        Math.max(0, itemCount - maxVisible)
      )
    );
    const focusedVisibleItems = this.items.slice(
      focusedStartIdx,
      focusedStartIdx + maxVisible
    );

    // Scroll up indicator
    if (focusedStartIdx > 0) {
      const y = borderPad;
      const x = this.width - 2;
      buffer[y][x] = '↑';
    }

    // Draw items
    focusedVisibleItems.forEach((item, i) => {
      const y = borderPad + paddingTop + i * lineHeight;
      const x = borderPad;
      const itemIndex = focusedStartIdx + i;

      const isFocused = itemIndex === this.focusedIndex;
      const isSelected = itemIndex === this.selectedIndex;

      let prefix = ' ';
      if (isFocused && this.hasFocus) {
        prefix = '>'; // Focused but not selected
      } else if (isSelected && this.hasFocus) {
        prefix = '◆'; // selected, and component has focus
      } else if (isSelected) {
        prefix = '◇'; // Selected but not focused or component doesn't have focus
      }

      const line = `${prefix} ${item}`
        .slice(0, this.width - 2 * borderPad)
        .padEnd(this.width - 2 * borderPad, ' ');

      for (let j = 0; j < line.length; j++) {
        buffer[y][x + j] = line[j];
      }

      // Add underline for selected items
      // if (isSelected && y + 1 < this.height - borderPad) {
      //   const underlineY = y + 1;
      //   const underlineLength = Math.min(item.length + 2, this.width - 2 * borderPad);
      //   for (let j = 0; j < underlineLength; j++) {
      //     if (x + j < this.width - borderPad) {
      //       buffer[underlineY][x + j] = '─';
      //     }
      //   }
      // }
    });

    // Scroll down indicator
    if (focusedStartIdx + maxVisible < itemCount) {
      const y = this.height - 1 - borderPad;
      const x = this.width - 2;
      buffer[y][x] = '↓';
    }
    this.buffer = buffer;
    return buffer;
  }
}
