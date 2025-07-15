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
    if (focusable) this.hasFocus = true;
  }

  setItems(items: string[], selectedIndex: number = 0): void {
    this.items = items;
    this.selectedIndex = selectedIndex;
  }

  setSelectedIndex(index: number): void {
    this.selectedIndex = index;
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

  // Border
  if (this.border) {
    const isFocused = this.hasFocus;
    const horizontal = isFocused ? '═' : '─';
    const vertical = isFocused ? '║' : '│';
    const tl = isFocused ? '╔' : '╭';
    const tr = isFocused ? '╗' : '╮';
    const bl = isFocused ? '╚' : '╰';
    const br = isFocused ? '╝' : '╯';

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

  // Label
  if (this.label && this.label.length < this.width - 2) {
    const labelStr = ` ${this.label} `;
    for (let i = 0; i < labelStr.length; i++) {
      rows[0][i + 1] = labelStr[i];
    }
  }

  // Content rendering with spacing
  const paddingTop = 1;
  const borderPad = this.border ? 1 : 0;
  const lineHeight = 2; // 1 line for item, 1 for spacing
  const availableLines = this.height - 2 * borderPad - paddingTop;
  const maxVisibleItems = Math.floor(availableLines / lineHeight);

  const startIdx = Math.max(
    0,
    Math.min(this.selectedIndex - Math.floor(maxVisibleItems / 2), this.items.length - maxVisibleItems)
  );

  const visibleItems = this.items.slice(startIdx, startIdx + maxVisibleItems);

  visibleItems.forEach((item, i) => {
    const rowIdx = borderPad + paddingTop + i * lineHeight;
    if (rowIdx >= this.height - borderPad) return; // skip if past vertical bounds

    const prefix = startIdx + i === this.selectedIndex ? '>' : ' ';
    const line = (prefix + ' ' + item).slice(0, this.width - 2 * borderPad).padEnd(this.width - 2 * borderPad, ' ');

    for (let j = 0; j < line.length; j++) {
      const colIdx = j + borderPad;
      if (colIdx >= this.width - borderPad) break;
      rows[rowIdx][colIdx] = line[j];
    }
  });

  return rows.map(row => row.join('')).join('\n');
}
}