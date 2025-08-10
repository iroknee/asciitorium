export class Component {
    constructor(props) {
        this.showLabel = true;
        this.fixed = false;
        this.x = 0;
        this.y = 0;
        this.z = 0;
        this.focusable = false;
        this.hasFocus = false;
        this.transparentChar = '‽'; // ‽ = transparent character
        this.unbindFns = [];
        if (props.width < 1)
            throw new Error('Component width must be > 0');
        if (props.height < 1)
            throw new Error('Component height must be > 0');
        this.width = props.width;
        this.height = props.height;
        this.label = props.label;
        this.showLabel = props.showLabel ?? true;
        this.border = props.border ?? false;
        this.fill = props.fill ?? ' ';
        this.align = props.align;
        this.fixed = props.fixed ?? false;
        this.x = props.x ?? 0;
        this.y = props.y ?? 0;
        this.z = props.z ?? 0;
        this.buffer = [];
    }
    setParent(parent) {
        this.parent = parent;
    }
    bind(state, apply) {
        const listener = (val) => {
            apply(val);
        };
        state.subscribe(listener);
        this.unbindFns.push(() => state.unsubscribe(listener));
    }
    destroy() {
        for (const unbind of this.unbindFns)
            unbind();
        this.unbindFns = [];
    }
    handleEvent(event) {
        return false;
    }
    draw() {
        // Create buffer and fill only if not transparent
        this.buffer = Array.from({ length: this.height }, () => Array.from({ length: this.width }, () => this.fill === this.transparentChar ? '‽' : this.fill));
        const drawChar = (x, y, char) => {
            if (x >= 0 && x < this.width && y >= 0 && y < this.height) {
                this.buffer[y][x] = char;
            }
        };
        if (this.border) {
            const w = this.width;
            const h = this.height;
            drawChar(0, 0, '╭');
            drawChar(w - 1, 0, '╮');
            drawChar(0, h - 1, '╰');
            drawChar(w - 1, h - 1, '╯');
            for (let x = 1; x < w - 1; x++) {
                drawChar(x, 0, '─');
                drawChar(x, h - 1, '─');
            }
            for (let y = 1; y < h - 1; y++) {
                drawChar(0, y, '│');
                drawChar(w - 1, y, '│');
            }
        }
        if (this.label && this.showLabel) {
            const label = ` ${this.label} `;
            const start = 1;
            for (let i = 0; i < label.length && i + start < this.width - 1; i++) {
                drawChar(i + start, 0, label[i]);
            }
        }
        return this.buffer;
    }
}
