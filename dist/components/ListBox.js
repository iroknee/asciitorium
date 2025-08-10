import { Component } from '../core/Component';
export class ListBox extends Component {
    constructor(options) {
        const height = options.height ?? 8;
        const border = options.border ?? true;
        super({ ...options, height, border });
        this.selectedIndex = 0;
        this.focusable = true;
        this.hasFocus = false;
        this.items = options.items;
        this.selectedItem = options.selectedItem;
        this.selectedIndex = Math.max(0, this.items.findIndex((item) => item === this.selectedItem.value));
        this.bind(this.selectedItem, (value) => {
            const index = this.items.indexOf(value);
            if (index !== -1 && index !== this.selectedIndex) {
                this.selectedIndex = index;
            }
        });
    }
    handleEvent(event) {
        const prevIndex = this.selectedIndex;
        if ((event === 'ArrowUp' || event === 'w') && this.selectedIndex > 0) {
            this.selectedIndex--;
        }
        else if ((event === 'ArrowDown' || event === 's') &&
            this.selectedIndex < this.items.length - 1) {
            this.selectedIndex++;
        }
        if (this.selectedIndex !== prevIndex) {
            this.selectedItem.value = this.items[this.selectedIndex];
            return true;
        }
        return false;
    }
    draw() {
        const buffer = super.draw();
        const borderPad = this.border ? 1 : 0;
        const paddingTop = 1;
        const lineHeight = 1;
        const innerHeight = this.height - 3 * borderPad - paddingTop;
        const maxVisible = Math.max(1, Math.floor(innerHeight / lineHeight));
        const itemCount = this.items.length;
        const startIdx = Math.max(0, Math.min(this.selectedIndex - Math.floor(maxVisible / 2), Math.max(0, itemCount - maxVisible)));
        const visibleItems = this.items.slice(startIdx, startIdx + maxVisible);
        // Scroll up indicator
        if (startIdx > 0) {
            const y = borderPad;
            const x = this.width - 2;
            buffer[y][x] = '↑';
        }
        // Draw items
        visibleItems.forEach((item, i) => {
            const y = borderPad + paddingTop + i * lineHeight;
            const x = borderPad;
            const isSelected = (startIdx + i === this.selectedIndex && this.hasFocus);
            const prefix = isSelected ? '>' : ' ';
            const line = `${prefix} ${item}`
                .slice(0, this.width - 2 * borderPad)
                .padEnd(this.width - 2 * borderPad, ' ');
            for (let j = 0; j < line.length; j++) {
                buffer[y][x + j] = line[j];
            }
        });
        // Scroll down indicator
        if (startIdx + maxVisible < itemCount) {
            const y = this.height - 1 - borderPad;
            const x = this.width - 2;
            buffer[y][x] = '↓';
        }
        this.buffer = buffer;
        return buffer;
    }
}
