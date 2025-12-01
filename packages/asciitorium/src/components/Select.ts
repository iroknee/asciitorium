import { Component, ComponentProps } from '../core/Component.js';
import { State } from '../core/State.js';
import { ScrollableViewport } from '../core/ScrollableViewport.js';
import { Option } from './Option.js';
import { OptionGroup } from './OptionGroup.js';

export interface SelectOptions<T = any> extends ComponentProps {
  items?: string[];
  selectedItem?: State<string>;
  selected?: State<T>;
  children?: (Option<T> | OptionGroup<T>)[];
  showSelectionBox?: boolean;
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
  private readonly showSelectionBox: boolean;

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

    this.showSelectionBox = options.showSelectionBox ?? true;

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

  /**
   * Move focus to the next item (skipping group headers)
   */
  public moveNext(): void {
    let newIndex = this.focusedIndex + 1;

    // Skip group headers
    while (
      newIndex < this.items.length &&
      this.items[newIndex].isGroupHeader
    ) {
      newIndex++;
    }

    // Clamp to valid range
    if (newIndex < this.items.length) {
      this.focusedIndex = newIndex;
    }
  }

  /**
   * Move focus to the previous item (skipping group headers)
   */
  public movePrevious(): void {
    let newIndex = this.focusedIndex - 1;

    // Skip group headers
    while (
      newIndex >= 0 &&
      this.items[newIndex].isGroupHeader
    ) {
      newIndex--;
    }

    // Clamp to valid range
    if (newIndex >= 0) {
      this.focusedIndex = newIndex;
    }
  }

  /**
   * Select the currently focused item (if not a group header)
   */
  public select(): void {
    if (this.focusedIndex >= 0 &&
        this.focusedIndex < this.items.length &&
        !this.items[this.focusedIndex].isGroupHeader) {
      this.selectedIndex = this.focusedIndex;
      this.selectedState.value = this.items[this.selectedIndex].value;
    }
  }

  /**
   * Jump to the first item
   */
  public moveToStart(): void {
    this.focusedIndex = 0;
    // Skip if first item is a group header
    if (this.items[0]?.isGroupHeader) {
      this.moveNext();
    }
  }

  /**
   * Jump to the last item
   */
  public moveToEnd(): void {
    this.focusedIndex = this.items.length - 1;
    // Skip if last item is a group header
    if (this.items[this.focusedIndex]?.isGroupHeader) {
      this.movePrevious();
    }
  }

  /**
   * Page down (move down by roughly a page of items)
   */
  public pageDown(): void {
    const innerHeight = this.height - (this.border ? 2 : 0) - (this.height < 5 ? 0 : 1);
    const lineHeight = 2;
    const maxVisible = Math.max(1, Math.floor(innerHeight / lineHeight));

    let newIndex = Math.min(this.items.length - 1, this.focusedIndex + maxVisible);

    // Skip group headers
    while (newIndex < this.items.length && this.items[newIndex].isGroupHeader) {
      newIndex++;
    }

    if (newIndex < this.items.length) {
      this.focusedIndex = newIndex;
    }
  }

  /**
   * Page up (move up by roughly a page of items)
   */
  public pageUp(): void {
    const innerHeight = this.height - (this.border ? 2 : 0) - (this.height < 5 ? 0 : 1);
    const lineHeight = 2;
    const maxVisible = Math.max(1, Math.floor(innerHeight / lineHeight));

    let newIndex = Math.max(0, this.focusedIndex - maxVisible);

    // Skip group headers
    while (newIndex >= 0 && this.items[newIndex].isGroupHeader) {
      newIndex--;
    }

    if (newIndex >= 0) {
      this.focusedIndex = newIndex;
    }
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

      if (y >= buffer.length) {
        console.error(
          `❌ BUFFER OVERFLOW: Trying to draw at y=${y} but buffer.length=${buffer.length}!`
        );
        return;
      }
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
      if (isSelected && !item.isGroupHeader && this.showSelectionBox) {
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
