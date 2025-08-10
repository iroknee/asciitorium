import { Component } from '../core/Component';
import { isState, resolveAlignment } from '../core/utils';
export class Text extends Component {
    constructor(options) {
        const rawValue = isState(options.value)
            ? options.value.value
            : options.value;
        const contentLength = Math.max(1, String(rawValue).length); // <- enforce min width
        const borderPadding = options.border ? 2 : 0;
        super({
            ...options,
            width: options.width ?? contentLength + borderPadding,
            height: options.height ?? 1 + (options.border ? 2 : 0),
        });
        this.source = options.value;
        // If reactive, subscribe to changes
        if (isState(this.source)) {
            this.source.subscribe(() => {
                //this.markDirty();
            });
        }
    }
    get value() {
        return isState(this.source)
            ? String(this.source.value)
            : String(this.source);
    }
    draw() {
        super.draw(); // fills buffer, draws borders, etc.
        const innerWidth = this.width - (this.border ? 2 : 0);
        const innerHeight = this.height - (this.border ? 2 : 0);
        const { x, y } = resolveAlignment(this.align, innerWidth, innerHeight, Math.min(this.value.length, innerWidth), 1);
        const drawX = this.border ? x + 1 : x;
        const drawY = this.border ? y + 1 : y;
        for (let i = 0; i < this.value.length && i + drawX < this.width; i++) {
            this.buffer[drawY][drawX + i] = this.value[i];
        }
        return this.buffer;
    }
}
