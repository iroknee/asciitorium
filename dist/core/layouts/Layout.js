import { Component } from '../Component';
export class Layout extends Component {
    constructor(props) {
        super(props);
        this.children = [];
    }
    addChild(child) {
        child.setParent(this);
        this.children.push(child);
        this.recalculateLayout();
    }
    removeChild(child) {
        const index = this.children.indexOf(child);
        if (index !== -1) {
            this.children.splice(index, 1);
            this.recalculateLayout();
        }
    }
    getChildren() {
        return this.children;
    }
    draw() {
        this.recalculateLayout();
        super.draw();
        const sorted = [...this.children].sort((a, b) => a.z - b.z);
        for (const child of sorted) {
            const buf = child.draw();
            for (let j = 0; j < buf.length; j++) {
                for (let i = 0; i < buf[j].length; i++) {
                    const px = child.x + i;
                    const py = child.y + j;
                    if (px >= 0 && px < this.width && py >= 0 && py < this.height) {
                        this.buffer[py][px] = buf[j][i];
                    }
                }
            }
        }
        return this.buffer;
    }
    getAllDescendants() {
        const result = [];
        for (const child of this.children) {
            result.push(child);
            if (typeof child.getAllDescendants === 'function') {
                const grandChildren = child.getAllDescendants();
                result.push(...grandChildren);
            }
        }
        return result;
    }
}
