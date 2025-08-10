import { Component } from '../core/Component';
export class Button extends Component {
    constructor({ onClick, ...options }) {
        const label = options.label ?? 'Button';
        const showLabel = false; // Buttons don't show label in border
        const width = options.width ?? label.length + 6; // padding
        const height = options.height ?? 3;
        const border = options.border ?? true;
        super({ ...options, width, height, border, label, showLabel });
        this.focusable = true;
        this.hasFocus = false;
        this.onClick = onClick;
    }
    handleEvent(event) {
        if (event === 'Enter' || event === ' ') {
            this.onClick?.();
            return true;
        }
        return false;
    }
    draw() {
        const buffer = super.draw();
        const padX = this.border ? 1 : 0;
        const padY = this.border ? 1 : 0;
        const contentWidth = this.width - padX * 2;
        const contentHeight = this.height - padY * 2;
        // Calculate label placement (centered)
        const label = this.label ?? 'Button';
        const labelX = padX + Math.max(Math.floor((contentWidth - label.length) / 2), 0);
        const labelY = padY + Math.floor(contentHeight / 2);
        // Write the label centered
        for (let i = 0; i < label.length && labelX + i < this.width - padX; i++) {
            buffer[labelY][labelX + i] = label[i];
        }
        // If focused, draw '>' in first visible column of content area
        if (this.hasFocus) {
            const indicatorX = padX; // 1st char inside content
            buffer[labelY][indicatorX] = '>';
        }
        this.buffer = buffer;
        return buffer;
    }
}
