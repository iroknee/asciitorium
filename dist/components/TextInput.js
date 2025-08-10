import { Component } from '../core/Component';
import { State } from '../core/State';
export class TextInput extends Component {
    constructor(options) {
        const height = options.height ?? 3;
        const border = options.border ?? true;
        super({ ...options, height, border });
        this.cursorIndex = 0;
        this.suppressCursorSync = false;
        this.focusable = true;
        this.hasFocus = false;
        this.value = options.value ?? new State('');
        this.placeholder = options.placeholder ?? '';
        this.bind(this.value, (value) => {
            if (!this.suppressCursorSync) {
                this.cursorIndex = value.length;
            }
        });
    }
    handleEvent(event) {
        let updated = false;
        const val = this.value.value;
        if (event.length === 1 && event >= ' ') {
            const left = val.slice(0, this.cursorIndex);
            const right = val.slice(this.cursorIndex);
            this.suppressCursorSync = true;
            this.value.value = left + event + right;
            this.suppressCursorSync = false;
            this.cursorIndex++;
            updated = true;
        }
        else if (event === 'Backspace') {
            if (this.cursorIndex > 0) {
                const left = val.slice(0, this.cursorIndex - 1);
                const right = val.slice(this.cursorIndex);
                this.suppressCursorSync = true;
                this.value.value = left + right;
                this.suppressCursorSync = false;
                this.cursorIndex--;
                updated = true;
            }
        }
        else if (event === 'ArrowLeft') {
            this.cursorIndex = Math.max(0, this.cursorIndex - 1);
            updated = true;
        }
        else if (event === 'ArrowRight') {
            this.cursorIndex = Math.min(val.length, this.cursorIndex + 1);
            updated = true;
        }
        if (updated) {
            return true;
        }
        return false;
    }
    draw() {
        const buffer = super.draw();
        const prefix = this.hasFocus ? '> ' : '  ';
        const prefixLength = prefix.length;
        const y = this.border ? 1 : 0;
        const x = this.border ? 1 : 0;
        const innerWidth = this.width - (this.border ? 2 : 0);
        const usableWidth = innerWidth - prefixLength;
        const raw = this.value.value || this.placeholder;
        const visible = raw.slice(0, usableWidth);
        // Draw prefix
        for (let i = 0; i < prefixLength; i++) {
            buffer[y][x + i] = prefix[i];
        }
        // Draw text
        for (let i = 0; i < visible.length && i < usableWidth; i++) {
            buffer[y][x + prefixLength + i] = visible[i];
        }
        // Draw cursor if focused
        if (this.hasFocus) {
            const safeCursor = Math.min(this.cursorIndex, visible.length, usableWidth - 1);
            buffer[y][x + prefixLength + safeCursor] = '▉';
        }
        this.buffer = buffer;
        return buffer;
    }
}
