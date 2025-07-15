import { Component } from './Component';

export interface ListBoxOptions {
  items: string[];
  selectedIndex: number;
  width: number;
  height: number;
  border?: boolean;
  fill?: string;
  focusable?: boolean;
  label?: string;
}

export class ListBox extends Component {
  private items: string[];
  private selectedIndex: number;
  private hasFocus = false;
  readonly width: number;
  readonly height: number;
  readonly border: boolean;
  readonly fill: string;
  readonly focusable: boolean;
  readonly label?: string;

  constructor({
    items,
    selectedIndex,
    width,
    height,
    border = true,
    fill = ' ',
    focusable = false,
    label,
  }: ListBoxOptions) {
    super();
    this.items = items;
    this.selectedIndex = selectedIndex;
    this.width = width;
    this.height = height;
    this.border = border;
    this.fill = fill;
    this.focusable = focusable;
    this.label = label;
  }

  setItems(items: string[], selectedIndex: number = 0): void {
    this.items = items;
    this.selectedIndex = selectedIndex;
  }

  setSelectedIndex(index: number): void {
    this.selectedIndex = index;
  }

    handleEvent(event: string): boolean {
        if (event === 'ArrowUp' || event === 'w' && this.selectedIndex > 0) {
            this.selectedIndex--;
            return true;
        }
        if (event === 'ArrowDown' || event === 's' && this.selectedIndex < this.items.length - 1) {
            this.selectedIndex++;
            return true;
        }
        return false;
    }

  draw(): string {
  const rows: string[][] = [];

  // Fill background
  for (let y = 0; y < this.height; y++) {
    rows[y] = [];
    for (let x = 0; x < this.width; x++) {
      rows[y][x] = this.fill;
    }
  }

// Border rendering
if (this.border) {
  const horizontal = '─';
  const vertical = '│';
  const tl = '╭';
  const tr = '╮';
  const bl = '╰';
  const br = '╯';

  for (let x = 0; x < this.width; x++) {
    rows[0][x] = horizontal;
    rows[this.height - 1][x] = horizontal;
  }
  for (let y = 0; y < this.height; y++) {
    rows[y][0] = vertical;
    rows[y][this.width - 1] = vertical;
  }
  rows[0][0] = tl;
  rows[0][this.width - 1] = tr;
  rows[this.height - 1][0] = bl;
  rows[this.height - 1][this.width - 1] = br;
}

// Draw label if present
if (this.label) {
  const label = this.hasFocus
    ? ` ◆ ${this.label} `
    : ` ◇ ${this.label} `;

  const maxLabelWidth = this.width - 2;
  const truncatedLabel = label.length > maxLabelWidth
    ? label.slice(0, maxLabelWidth)
    : label;

  for (let i = 0; i < truncatedLabel.length; i++) {
    rows[0][i + 1] = truncatedLabel[i];
  }
}

  // Content rendering with spacing
  const paddingTop = 2;
  const borderPad = this.border ? 1 : 0;
  const lineHeight = 2; // 1 line for item, 1 line blank
  const availableLines = this.height - 2 * borderPad - paddingTop;
  const maxVisibleItems = Math.floor(availableLines / lineHeight);

  const startIdx = Math.max(
    0,
    Math.min(this.selectedIndex - Math.floor(maxVisibleItems / 2), this.items.length - maxVisibleItems)
  );

  const visibleItems = this.items.slice(startIdx, startIdx + maxVisibleItems);

  // Draw scroll up indicator (if needed)
  if (startIdx > 0) {
    const rowIdx = borderPad;
    const colIdx = Math.floor(this.width - 2);
    if (rowIdx >= 0 && rowIdx < this.height) rows[rowIdx][colIdx] = '↑';
  }

  visibleItems.forEach((item, i) => {
    const rowIdx = borderPad + paddingTop + i * lineHeight;
    if (rowIdx >= this.height - borderPad) return;

    const prefix = startIdx + i === this.selectedIndex ? ' >' : '  ';
    const line = (prefix + ' ' + item).slice(0, this.width - 2 * borderPad).padEnd(this.width - 2 * borderPad, ' ');

    for (let j = 0; j < line.length; j++) {
      const colIdx = j + borderPad;
      if (colIdx >= this.width - borderPad) break;
      rows[rowIdx][colIdx] = line[j];
    }
  });

  // Draw scroll down indicator (if needed)
  if (startIdx + maxVisibleItems < this.items.length) {
    const rowIdx = this.height - 1 - borderPad;
    const colIdx = Math.floor(this.width - 2);
    if (rowIdx >= 0 && rowIdx < this.height) rows[rowIdx][colIdx] = '↓';
  }

  return rows.map(row => row.join('')).join('\n');
}
  
}