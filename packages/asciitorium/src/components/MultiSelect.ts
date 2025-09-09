import { Component, ComponentProps } from '../core/Component';
import { State } from '../core/State';

export interface MultiSelectOptions extends ComponentProps {
  items: string[];
  selectedItems: State<string[]>;
}

export class MultiSelect extends Component {
  private readonly items: string[];
  private readonly selectedItems: State<string[]>;
  private focusedIndex: number = 0;
  private selectedSet: Set<string> = new Set();

  focusable = true;
  hasFocus = false;

  constructor(options: MultiSelectOptions) {
    const { style, ...componentProps } = options;
    
    // Extract style properties with proper precedence
    const height = options.height ?? style?.height ?? 3;
    const border = options.border ?? style?.border ?? true;

    super({ ...componentProps, style, height, border });

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

    // Navigation (arrow keys move the focus cursor)
    if ((event === 'ArrowUp' || event === 'w') && this.focusedIndex > 0) {
      this.focusedIndex--;
    } else if (
      (event === 'ArrowDown' || event === 's') &&
      this.focusedIndex < this.items.length - 1
    ) {
      this.focusedIndex++;
    }
    // Selection toggle (space/enter toggles selection of focused item)
    else if (event === ' ' || event === 'Enter') {
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
    const itemCount = this.items.length;

    // Calculate scroll position based on focused item
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
