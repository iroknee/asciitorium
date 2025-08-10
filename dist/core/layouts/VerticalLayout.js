import { Layout } from './Layout';
import { resolveAlignment } from '../utils';
export class VerticalLayout extends Layout {
    constructor(props) {
        super(props);
        this.fit = props.fit ?? false;
    }
    recalculateLayout() {
        const borderPad = this.border ? 1 : 0;
        const innerWidth = this.width - 2 * borderPad;
        const innerHeight = this.height - 2 * borderPad;
        const count = this.children.length;
        let currentY = borderPad;
        for (const child of this.children) {
            if (child.fixed) {
                continue; // skip positioning if component is fixed
            }
            if (this.fit && count > 0) {
                child.height = Math.floor(innerHeight / count);
            }
            if (!child.width) {
                child.width = innerWidth;
            }
            const { x } = resolveAlignment(child.align, innerWidth, child.height, child.width, child.height);
            child.x = borderPad + x;
            child.y = currentY;
            currentY += child.height;
        }
    }
}
