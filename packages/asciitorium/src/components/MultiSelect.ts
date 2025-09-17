import { Component, ComponentProps } from '../core/Component';
import { State } from '../core/State';
import { ScrollableViewport } from '../core/ScrollableViewport';

export interface MultiSelectOptions extends ComponentProps {
  items: string[];
  selectedItems: State<string[]>;
}

export class MultiSelect extends Component {
  private scrollableViewport = new ScrollableViewport();
  private readonly items: string[];
  private readonly selectedItems: State<string[]>;
  private focusedIndex: number = 0;
  private selectedSet: Set<string> = new Set();

  focusable = true;
  hasFocus = false;

  constructor(options: MultiSelectOptions) {
    super({
      ...options,
      height: options.height ?? options.style?.height ?? 3,
      border: options.border ?? options.style?.border ?? true
    });

    this.items = options.items;
    this.selectedItems = options.selectedItems;

    // Initialize selected set from the state
    this.selectedSet = new Set(this.selectedItems.value);

    // Start focus on first selected item, or first item if none selected
    const firstSelectedIndex = this.items.findIndex((item) =>
      this.selectedSet.has(item)
    );
    this.focusedIndex = Math.max(0, firstSelectedIndex);

    // Bind to state changes
    this.bind(this.selectedItems, (values) => {
      this.selectedSet = new Set(values);
    });
  }

  override handleEvent(event: string): boolean {
    const prevFocusedIndex = this.focusedIndex;
    const prevSelectedSet = new Set(this.selectedSet);

    // Use ScrollableViewport for navigation
    const newFocusedIndex = this.scrollableViewport.handleScrollEvent(
      event,
      this.focusedIndex,
      this.items.length
    );
    this.focusedIndex = newFocusedIndex;

    // Selection toggle (space/enter toggles selection of focused item)
    if (event === ' ' || event === 'Enter') {
      const focusedItem = this.items[this.focusedIndex];
      if (this.selectedSet.has(focusedItem)) {
        this.selectedSet.delete(focusedItem);
      } else {
        this.selectedSet.add(focusedItem);
      }
      // Update the state with current selections
      this.selectedItems.value = Array.from(this.selectedSet);
    }

    // Return true if any state changed
    return (
      this.focusedIndex !== prevFocusedIndex ||
      this.selectedSet.size !== prevSelectedSet.size ||
      !this.setsEqual(this.selectedSet, prevSelectedSet)
    );
  }

  private setsEqual(set1: Set<string>, set2: Set<string>): boolean {
    if (set1.size !== set2.size) return false;
    for (const item of set1) {
      if (!set2.has(item)) return false;
    }
    return true;
  }

  override draw(): string[][] {
    const buffer = super.draw();
    const borderPad = this.border ? 1 : 0;
    const paddingTop = this.height < 5 ? 0 : 1;
    const lineHeight = 1;
    const innerHeight = this.height - 3 * borderPad - paddingTop;

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
      const isSelected = this.selectedSet.has(item);

      let prefix = '  ';
      if (isFocused && this.hasFocus) {
        prefix = ' >'; // ◇ Focused item (takes priority)
      } else if (isSelected && this.hasFocus) {
        prefix = ' ◆'; // Selected item
      } else if (isSelected) {
        prefix = ' ◇'; // Selected item
      } else {
        prefix = '  '; // Non-selected item
      }

      const line = `${prefix} ${item}`
        .slice(0, this.width - 2 * borderPad)
        .padEnd(this.width - 2 * borderPad, ' ');

      for (let j = 0; j < line.length; j++) {
        buffer[y][x + j] = line[j];
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
