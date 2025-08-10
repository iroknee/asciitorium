import { Component } from '../core/Component';
export class ProgressBar extends Component {
    constructor(options) {
        options.height = 3;
        options.border = false;
        super(options);
        this.progress = 0;
        this.percentage = options.percentage ?? false;
        this.durationMs = options.durationMs ?? 500;
        // Bind to the progress State
        this.bind(options.progress, (newValue) => {
            this.animateTo(newValue, this.durationMs);
        });
    }
    animateTo(value, durationMs = 500) {
        const clamped = Math.max(0, Math.min(1, value));
        if (this.animationInterval)
            clearInterval(this.animationInterval);
        const steps = 30;
        const delay = durationMs / steps;
        const start = this.progress;
        let currentStep = 0;
        this.animationInterval = setInterval(() => {
            currentStep++;
            const t = currentStep / steps;
            this.progress = start + (clamped - start) * t;
            if (currentStep >= steps) {
                clearInterval(this.animationInterval);
                this.progress = clamped;
            }
        }, delay);
    }
    draw() {
        const width = this.width ?? 10;
        const innerWidth = width - 2;
        const filledLength = Math.round(this.progress * innerWidth);
        const emptyLength = innerWidth - filledLength;
        let barContent = '█'.repeat(filledLength) + ' '.repeat(emptyLength);
        if (this.percentage) {
            const percentStr = `${Math.round(this.progress * 100)}%`;
            const start = Math.floor((innerWidth - percentStr.length) / 2);
            const before = barContent.slice(0, start);
            const after = barContent.slice(start + percentStr.length);
            barContent = (before + percentStr + after).slice(0, innerWidth);
        }
        const top = ' ⎽' + '⎽'.repeat(Math.max(0, width - 3));
        const mid = `⎹${barContent}⎸`;
        const bot = ' ' + '⎺'.repeat(width - 2);
        this.buffer = [top, mid, bot].map((line) => Array.from(line));
        return this.buffer;
    }
}
