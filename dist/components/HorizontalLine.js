import { Component } from '../core/Component';
export class HorizontalLine extends Component {
    constructor(options) {
        const resolvedWidth = options.length ?? 12;
        super({
            ...options,
            width: resolvedWidth,
            height: 1, // Always one line tall
        });
    }
    draw() {
        super.draw(); // Prepares buffer, border, label, etc.
        const lineChar = '⎺';
        const y = 0;
        const xStart = this.border ? 1 : 0;
        const xEnd = this.border ? this.width - 1 : this.width;
        for (let x = xStart; x < xEnd; x++) {
            this.buffer[y][x] = lineChar;
        }
        return this.buffer;
    }
}
