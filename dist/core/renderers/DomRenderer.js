export class DomRenderer {
    constructor(screen) {
        this.screen = screen;
        this.screen.style.whiteSpace = 'pre';
    }
    render(buffer) {
        this.screen.textContent = buffer.map((row) => row.join('')).join('\n');
    }
}
