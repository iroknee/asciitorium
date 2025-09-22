export interface ScrollableContent {
  items: string[];
  totalCount: number;
  maxVisible: number;
  focusedIndex: number;
}

export interface ScrollWindow {
  startIdx: number;
  visibleItems: string[];
  showUpArrow: boolean;
  showDownArrow: boolean;
}

export class ScrollableViewport {
  public calculateScrollWindow(content: ScrollableContent): ScrollWindow {
    const { items, totalCount, maxVisible, focusedIndex } = content;

    // Calculate the starting index to keep focused item centered when possible
    const startIdx = Math.max(
      0,
      Math.min(
        focusedIndex - Math.floor(maxVisible / 2),
        Math.max(0, totalCount - maxVisible)
      )
    );

    const visibleItems = items.slice(startIdx, startIdx + maxVisible);

    return {
      startIdx,
      visibleItems,
      showUpArrow: startIdx > 0,
      showDownArrow: startIdx + maxVisible < totalCount
    };
  }

  public handleScrollEvent(
    event: string,
    currentFocusedIndex: number,
    totalCount: number
  ): number {
    let newFocusedIndex = currentFocusedIndex;

    if ((event === 'ArrowUp') && currentFocusedIndex > 0) {
      newFocusedIndex = currentFocusedIndex - 1;
    } else if (
      (event === 'ArrowDown') &&
      currentFocusedIndex < totalCount - 1
    ) {
      newFocusedIndex = currentFocusedIndex + 1;
    }

    return newFocusedIndex;
  }

  public drawScrollIndicators(
    buffer: string[][],
    width: number,
    height: number,
    borderPad: number,
    showUpArrow: boolean,
    showDownArrow: boolean
  ): void {
    // Scroll up indicator
    if (showUpArrow) {
      const y = borderPad;
      const x = width - 2;
      if (y >= 0 && y < height && x >= 0 && x < width) {
        buffer[y][x] = '↑';
      }
    }

    // Scroll down indicator
    if (showDownArrow) {
      const y = height - 1 - borderPad;
      const x = width - 2;
      if (y >= 0 && y < height && x >= 0 && x < width) {
        buffer[y][x] = '↓';
      }
    }
  }
}