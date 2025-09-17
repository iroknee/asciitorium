import { Component, ComponentProps } from '../core/Component';
import { State } from '../core/State';
import { ScrollableViewport } from '../core/ScrollableViewport';

export interface SelectOptions extends ComponentProps {
  items: string[];
  selectedItem: State<string>;
}

export class Select extends Component {
  private scrollableViewport = new ScrollableViewport();
  private readonly items: string[];
  private readonly selectedItem: State<string>;
  private focusedIndex: number = 0;
  private selectedIndex: number = 0;

  focusable = true;
  hasFocus = false;

  constructor(options: SelectOptions) {
    super({
      ...options,
      height: options.height ?? options.style?.height ?? 3,
      border: options.border ?? options.style?.border ?? true
    });

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

    // Use ScrollableViewport for navigation
    const newFocusedIndex = this.scrollableViewport.handleScrollEvent(
      event,
      this.focusedIndex,
      this.items.length
    );
    this.focusedIndex = newFocusedIndex;

    // Selection (space/enter selects the focused item)
    if (event === ' ' || event === 'Enter') {
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

    // Use ScrollableViewport to calculate scroll window
    const scrollWindow = this.scrollableViewport.calculateScrollWindow({
      items: this.items,
      totalCount: this.items.length,
      maxVisible,
      focusedIndex: this.focusedIndex
    });

    const { startIdx: focusedStartIdx, visibleItems: focusedVisibleItems } = scrollWindow;

    // Draw items
    focusedVisibleItems.forEach((item, i) => {
      const y = borderPad + paddingTop + i * lineHeight;
      const x = borderPad;
      const itemIndex = focusedStartIdx + i;

      const isFocused = itemIndex === this.focusedIndex;
      const isSelected = itemIndex === this.selectedIndex;

      // Draw box around selected item instead of using prefixes
      if (isSelected) {
        // Draw top border of box
        if (y > borderPad) {
          const topY = y - 1;
          buffer[topY][x + 2] = '╭';
          for (let j = 3; j < item.length + 5; j++) {
            if (x + j < this.width - borderPad) {
              buffer[topY][x + j] = '─';
            }
          }
          if (x + item.length + 3 < this.width - borderPad) {
            buffer[topY][x + item.length + 5] = '╮';
          }
        }

        // Draw sides of box and item text
        let prefix = ' > ';
        if (!isFocused || !this.hasFocus) {
          prefix = '   ';
        }
        buffer[y][x] = prefix[0];
        buffer[y][x + 1] = prefix[1];
        buffer[y][x + 2] = prefix[2];
        const itemText = `  ${item} `;
        for (let j = 0; j < itemText.length; j++) {
          if (x + 2 + j < this.width - borderPad) {
            buffer[y][x + 2 + j] = itemText[j];
          }
        }
        buffer[y][x + 2] = '│';
        if (x + 3 + itemText.length < this.width - borderPad) {
          buffer[y][x + 2 + itemText.length] = '│';
        }

        // Draw bottom border of box
        if (y + 1 < this.height - borderPad) {
          const bottomY = y + 1;
          buffer[bottomY][x + 2] = '╰';
          for (let j = 3; j < item.length + 5; j++) {
            if (x + j < this.width - borderPad) {
              buffer[bottomY][x + j] = '─';
            }
          }
          if (x + item.length + 4 < this.width - borderPad) {
            buffer[bottomY][x + item.length + 5] = '╯';
          }
        }
      } else {
        // Draw regular item (with focus indicator if focused)
        let prefix = '   ';
        if (isFocused && this.hasFocus) {
          prefix = ' > ';
        }

        const line = `${prefix} ${item}`
          .slice(0, this.width - 2 * borderPad)
          .padEnd(this.width - 2 * borderPad, ' ');

        for (let j = 0; j < line.length; j++) {
          buffer[y][x + j] = line[j];
        }
      }
    });

    // Draw scroll indicators using ScrollableViewport
    this.scrollableViewport.drawScrollIndicators(
      buffer,
      this.width,
      this.height,
      borderPad,
      scrollWindow.showUpArrow,
      scrollWindow.showDownArrow
    );

    this.buffer = buffer;
    return buffer;
  }
}
