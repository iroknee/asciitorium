import { Component, ComponentProps } from '../core/Component';
import { State } from '../core/State';

export interface ListBoxOptions extends ComponentProps {
  items: string[];
  selectedItem: State<string>;
}

export class ListBox extends Component {
  public items: string[];
  public selectedItem: State<string>;
  private selectedIndex: number = 0;

  constructor(options: ListBoxOptions) {
    super(options);
    this.focusable = true;
    this.items = options.items;
    this.selectedItem = options.selectedItem;
    for (let i = 0; i < this.items.length; i++) {
      if (this.items[i] == this.selectedItem.value) {
        this.selectedIndex = i;
        break;
      }
    }
  }

  handleEvent(event: string): boolean {
    if ((event === 'ArrowUp' || event === 'w') && this.selectedIndex > 0) {
      this.selectedIndex--;
      this.selectedItem.value = this.items[this.selectedIndex];
      this.dirty = true;
      return true;
    }
    if (
      (event === 'ArrowDown' || event === 's') &&
      this.selectedIndex < this.items.length - 1
    ) {
      this.selectedIndex++;
      this.selectedItem.value = this.items[this.selectedIndex];
      this.dirty = true;
      return true;
    }
    return false;
  }

  draw(): string[][] {
    if (this.dirty) {
      super.draw(); // draw border, fill, label

      const paddingTop = 2;
      const borderPad = this.border ? 1 : 0;
      const lineHeight = 2; // 1 for item, 1 for spacing
      const availableLines = this.height - 2 * borderPad - paddingTop;
      const maxVisibleItems = Math.floor(availableLines / lineHeight);

      const startIdx = Math.max(
        0,
        Math.min(
          this.selectedIndex - Math.floor(maxVisibleItems / 2),
          Math.max(0, this.items.length - maxVisibleItems)
        )
      );

      const visibleItems = this.items.slice(
        startIdx,
        startIdx + maxVisibleItems
      );

      // Scroll up indicator
      if (startIdx > 0) {
        const rowIdx = borderPad;
        const colIdx = this.width - 2;
        this.buffer[rowIdx][colIdx] = '↑';
      }

      // Draw items
      visibleItems.forEach((item, i) => {
        const rowIdx = borderPad + paddingTop + i * lineHeight;
        if (rowIdx >= this.height - borderPad) return;

        let prefix = startIdx + i === this.selectedIndex ? '>' : ' ';

        const line = ` ${prefix} ${item}`
          .slice(0, this.width - 2 * borderPad)
          .padEnd(this.width - 2 * borderPad, ' ');

        for (let j = 0; j < line.length; j++) {
          const colIdx = j + borderPad;
          if (colIdx >= this.width - borderPad) break;
          this.buffer[rowIdx][colIdx] = line[j];
        }
      });

      // Scroll down indicator
      if (startIdx + maxVisibleItems < this.items.length) {
        const rowIdx = this.height - 1 - borderPad;
        const colIdx = this.width - 2;
        this.buffer[rowIdx][colIdx] = '↓';
      }

      this.dirty = false;
    }

    return this.buffer;
  }
}
