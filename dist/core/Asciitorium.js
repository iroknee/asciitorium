import { VerticalLayout } from './layouts/VerticalLayout';
import { FocusManager } from './FocusManager';
import { DomRenderer } from './renderers/DomRenderer';
import { TerminalRenderer } from './renderers/TerminalRenderer';
export class Asciitorium extends VerticalLayout {
    constructor(props) {
        super(props);
        this.fpsCounter = 0;
        this.totalRenderTime = 0;
        this.renderer = getDefaultRenderer();
        this.focus = new FocusManager();
        const list = Array.isArray(props.children)
            ? props.children
            : props.children
                ? [props.children]
                : [];
        for (const child of list) {
            super.addChild(child);
        }
        this.focus.reset(this);
        this.render();
        // Start FPS and render time reporting
        setInterval(() => {
            if (this.fpsCounter > 0 && this.renderer instanceof DomRenderer) {
                console.log(`FPS: ${this.fpsCounter}, total render time: ${this.totalRenderTime.toFixed(2)} ms`);
            }
            this.fpsCounter = 0;
            this.totalRenderTime = 0;
        }, 1000);
    }
    render() {
        const start = typeof performance !== 'undefined' && performance.now
            ? performance.now()
            : Date.now();
        this.fpsCounter++;
        const screenBuffer = Array.from({ length: this.height }, () => Array.from({ length: this.width }, () => ' '));
        // Flatten and sort components by z-index
        const allComponents = this.getAllDescendants().concat([this]);
        allComponents.sort((a, b) => (a.z ?? 0) - (b.z ?? 0));
        for (const component of allComponents) {
            const buffer = component.draw();
            const x = component.x;
            const y = component.y;
            const transparentChar = component.transparentChar;
            for (let row = 0; row < buffer.length; row++) {
                const globalY = y + row;
                if (globalY < 0 || globalY >= this.height)
                    continue;
                for (let col = 0; col < buffer[row].length; col++) {
                    const globalX = x + col;
                    if (globalX < 0 || globalX >= this.width)
                        continue;
                    const char = buffer[row][col];
                    if (char !== transparentChar) {
                        screenBuffer[globalY][globalX] = char;
                    }
                }
            }
        }
        this.renderer.render(screenBuffer);
        const end = typeof performance !== 'undefined' && performance.now
            ? performance.now()
            : Date.now();
        this.totalRenderTime += end - start;
    }
    addChild(component) {
        super.addChild(component);
        this.focus?.reset(this); // avoid crashing
        this.render();
    }
    removeChild(component) {
        super.removeChild(component);
        this.focus.reset(this);
        this.render();
    }
    handleKey(key) {
        if (key === 'Tab') {
            this.focus.focusNext();
            this.render();
            event?.preventDefault();
            return;
        }
        if (key === 'Shift') {
            this.focus.focusPrevious();
            this.render();
            event?.preventDefault();
            return;
        }
        if (this.focus.handleKey(key)) {
            this.render();
        }
    }
}
function getDefaultRenderer() {
    if (typeof window !== 'undefined' && typeof document !== 'undefined') {
        const screen = document.getElementById('screen');
        if (!screen)
            throw new Error('No #screen element found for DOM rendering');
        return new DomRenderer(screen);
    }
    else {
        return new TerminalRenderer();
    }
}
