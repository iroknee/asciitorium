import { Component, ComponentProps } from '../core/Component';
import { State } from '../core/State';
import { ScrollableViewport } from '../core/ScrollableViewport';
import { Option } from './Option';
import { OptionGroup } from './OptionGroup';

export interface SelectOptions<T = any> extends ComponentProps {
  items?: string[];
  selectedItem?: State<string>;
  selected?: State<T>;
  children?: (Option<T> | OptionGroup<T>)[];
}

interface SelectItem<T = any> {
  label: string;
  value: T;
  isGroupHeader: boolean;
  isLastInGroup: boolean;
  groupDepth: number;
}

export class Select<T = any> extends Component {
  private scrollableViewport = new ScrollableViewport();
  private readonly items: SelectItem<T>[];
  private readonly selectedState: State<T>;
  private focusedIndex: number = 0;
  private selectedIndex: number = 0;

  focusable = true;
  hasFocus = false;

  private flattenChildren(children: (Option<T> | OptionGroup<T>)[]): SelectItem<T>[] {
    const items: SelectItem<T>[] = [];

    for (const child of children) {
      if (child instanceof OptionGroup) {
        // Add group header
        items.push({
          label: child.label,
          value: null as any, // Group headers have no value
          isGroupHeader: true,
          isLastInGroup: false,
          groupDepth: 0,
        });

        // Add group children
        const groupChildren = child.children;
        groupChildren.forEach((option, index) => {
          const isLast = index === groupChildren.length - 1;
          items.push({
            label: option.label,
            value: option.value,
            isGroupHeader: false,
            isLastInGroup: isLast,
            groupDepth: 1,
          });
        });
      } else {
        // Regular Option (not in a group)
        items.push({
          label: child.label,
          value: child.value,
          isGroupHeader: false,
          isLastInGroup: false,
          groupDepth: 0,
        });
      }
    }

    return items;
  }

  constructor(options: SelectOptions<T>) {
    super({
      ...options,
      height: options.height ?? options.style?.height ?? 3,
      border: options.border ?? options.style?.border ?? true,
    });

    // Support both old API (items/selectedItem) and new API (children/selected)
    if (options.children && options.children.length > 0) {
      // New JSX-based API with Option/OptionGroup children
      this.items = this.flattenChildren(options.children);
      this.selectedState = options.selected!;
    } else {
      // Old API with string array
      this.items = (options.items || []).map((item) => ({
        label: item,
        value: item as unknown as T,
        isGroupHeader: false,
        isLastInGroup: false,
        groupDepth: 0,
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
    let newFocusedIndex = this.scrollableViewport.handleScrollEvent(
      event,
      this.focusedIndex,
      this.items.length
    );

    // Skip group headers during navigation
    if (newFocusedIndex !== this.focusedIndex) {
      const direction = newFocusedIndex > this.focusedIndex ? 1 : -1;
      while (
        newFocusedIndex >= 0 &&
        newFocusedIndex < this.items.length &&
        this.items[newFocusedIndex].isGroupHeader
      ) {
        newFocusedIndex += direction;
      }
      // Clamp to valid range
      newFocusedIndex = Math.max(0, Math.min(this.items.length - 1, newFocusedIndex));
    }

    this.focusedIndex = newFocusedIndex;

    // Selection (space/enter selects the focused item, but not if it's a group header)
    if ((event === ' ' || event === 'Enter') && !this.items[this.focusedIndex].isGroupHeader) {
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
      const item = this.items[itemIndex];

      const isFocused = itemIndex === this.focusedIndex;
      const isSelected = itemIndex === this.selectedIndex;

      // Calculate tree prefix and text offset
      let treePrefix = '';
      let textOffset = x + 2; // Default offset after focus indicator

      if (item.isGroupHeader) {
        // Group headers have no tree prefix
        treePrefix = '';
      } else if (item.groupDepth > 0) {
        // Items in a group get tree connectors
        treePrefix = item.isLastInGroup ? '└─ ' : '├─ ';
        textOffset = x + 2; // Tree prefix starts after focus indicator
      }

      // Draw vertical tree lines in gap rows FIRST (before selection box)
      if (i > 0 && item.groupDepth > 0 && !item.isGroupHeader) {
        const prevItemIndex = focusedStartIdx + i - 1;
        if (prevItemIndex >= 0 && prevItemIndex < this.items.length) {
          const prevItem = this.items[prevItemIndex];
          // Draw vertical line if previous item is in a group and not the last
          if (prevItem.groupDepth > 0 && !prevItem.isLastInGroup) {
            const gapY = y - 1;
            buffer[gapY][textOffset] = '│';
          }
        }
      }

      // Draw focus prefix
      if (isFocused && this.hasFocus) buffer[y][x] = '>';

      // Draw tree prefix
      for (let n = 0; n < treePrefix.length; n++) {
        buffer[y][textOffset + n] = treePrefix[n];
      }

      // Draw item label (after tree prefix)
      const labelStartX = textOffset + treePrefix.length;
      // itemLabel can be either a string (for group headers) or an array (for options)
      const labelText = Array.isArray(itemLabel) ? itemLabel[0] : itemLabel;
      for (let n = 0; n < labelText.length; n++) {
        buffer[y][labelStartX + n] = labelText[n];
      }

      // Draw box around selected item last (over tree characters)
      if (isSelected && !item.isGroupHeader) {
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
