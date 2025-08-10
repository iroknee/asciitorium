import { Layout } from './Layout';
import { resolveAlignment } from '../utils';
export class HorizontalLayout extends Layout {
    constructor(props) {
        super(props);
        this.fit = props.fit ?? false;
        const children = Array.isArray(props.children)
            ? props.children
            : props.children
                ? [props.children]
                : [];
        for (const child of children) {
            this.addChild(child);
        }
    }
    recalculateLayout() {
        const borderPad = this.border ? 1 : 0;
        const innerHeight = this.height - 2 * borderPad;
        const innerWidth = this.width - 2 * borderPad;
        const count = this.children.length;
        let currentX = borderPad;
        for (const child of this.children) {
            if (child.fixed)
                continue;
            if (this.fit && count > 0) {
                child.width = Math.floor(innerWidth / count);
            }
            if (!child.height) {
                child.height = innerHeight;
            }
            const { y } = resolveAlignment(child.align, child.width, innerHeight, child.width, child.height);
            child.x = currentX;
            child.y = borderPad + y;
            currentX += child.width;
        }
    }
}
