import { Component, ComponentProps } from '../core/Component';
import { State } from '../core/State';
import { ScrollableViewport } from '../core/ScrollableViewport';
import { Option } from './Option';

export interface SelectOptions<T = any> extends ComponentProps {
  items?: string[];
  selectedItem?: State<string>;
  selected?: State<T>;
  children?: Option<T>[];
}

interface SelectItem<T = any> {
  label: string;
  value: T;
}

export class Select<T = any> extends Component {
  private scrollableViewport = new ScrollableViewport();
  private readonly items: SelectItem<T>[];
  private readonly selectedState: State<T>;
  private focusedIndex: number = 0;
  private selectedIndex: number = 0;

  focusable = true;
  hasFocus = false;

  constructor(options: SelectOptions<T>) {
    super({
      ...options,
      height: options.height ?? options.style?.height ?? 3,
      border: options.border ?? options.style?.border ?? true,
    });

    // Support both old API (items/selectedItem) and new API (children/selected)
    if (options.children && options.children.length > 0) {
      // New JSX-based API with Option children
      this.items = options.children.map((child) => ({
        label: child.label,
        value: child.value,
      }));
      this.selectedState = options.selected!;
    } else {
      // Old API with string array
      this.items = (options.items || []).map((item) => ({
        label: item,
        value: item as unknown as T,
      }));
      this.selectedState = options.selectedItem as unknown as State<T>;
    }

    const initialSelectedIndex = Math.max(
      0,
      this.items.findIndex((item) => item.value === this.selectedState.value)
    );
    this.selectedIndex = initialSelectedIndex;
    this.focusedIndex = initialSelectedIndex;

    this.bind(this.selectedState, (value) => {
      const index = this.items.findIndex((item) => item.value === value);
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
      this.selectedState.value = this.items[this.selectedIndex].value;
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
    const itemLabels = this.items.map((item) => item.label);
    const scrollWindow = this.scrollableViewport.calculateScrollWindow({
      items: itemLabels,
      totalCount: this.items.length,
      maxVisible,
      focusedIndex: this.focusedIndex,
    });

    const { startIdx: focusedStartIdx, visibleItems: focusedVisibleItems } =
      scrollWindow;

    // Draw items
    focusedVisibleItems.forEach((itemLabel, i) => {
      const y = borderPad + paddingTop + i * lineHeight;
      const x = borderPad;
      const itemIndex = focusedStartIdx + i;

      const isFocused = itemIndex === this.focusedIndex;
      const isSelected = itemIndex === this.selectedIndex;

      // Draw prefix
      if (isFocused && this.hasFocus) buffer[y][x] = '>';

      // Draw item label
      for (let n = 0; n < itemLabel[0].length; n++) {
        buffer[y][x + 2 + n] = itemLabel[0][n];
      }

      // Draw box around selected item instead of using prefixes
      if (isSelected) {
        // Draw box border
        buffer[y - 1][x + 1] = '╭';
        buffer[y][x + 1] = '│';
        buffer[y + 1][x + 1] = '╰';
        for (let j = 2; j < this.width - 4; j++) {
          buffer[y - 1][x + j] = '─';
          buffer[y + 1][x + j] = '─';
        }
        buffer[y - 1][this.width - 3] = '╮';
        buffer[y][this.width - 3] = '│';
        buffer[y + 1][this.width - 3] = '╯';
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
