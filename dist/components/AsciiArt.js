import { Component } from '../core/Component';
import { requestRender } from '../core/RenderScheduler';
export class AsciiArt extends Component {
    constructor(options) {
        const parsedFrames = parseSpriteSheet(options.content);
        const firstFrame = parsedFrames[0] ?? [[' ']];
        const artWidth = Math.max(1, ...firstFrame.map((line) => line.length));
        const artHeight = Math.max(1, firstFrame.length);
        const borderPadding = options.border ? 2 : 0;
        super({
            ...options,
            width: options.width ?? artWidth + borderPadding,
            height: options.height ?? artHeight + borderPadding,
        });
        this.frames = [];
        this.frameIndex = 0;
        this.loop = true;
        this.rawContent = options.content;
        this.frames = parsedFrames;
        this.loop = options.loop ?? true;
        if (this.frames.length > 1) {
            const duration = options.frameDurationMs ?? 250;
            this.animationInterval = setInterval(() => {
                this.frameIndex++;
                if (this.frameIndex >= this.frames.length) {
                    if (this.loop) {
                        this.frameIndex = 0;
                    }
                    else {
                        this.frameIndex = this.frames.length - 1;
                        clearInterval(this.animationInterval);
                    }
                }
                requestRender();
            }, duration);
        }
    }
    destroy() {
        super.destroy();
        if (this.animationInterval) {
            clearInterval(this.animationInterval);
        }
    }
    draw() {
        const buffer = super.draw();
        const xOffset = this.border ? 1 : 0;
        const yOffset = this.border ? 1 : 0;
        const innerWidth = this.width - (this.border ? 2 : 0);
        const innerHeight = this.height - (this.border ? 2 : 0);
        const frame = this.frames[this.frameIndex];
        if (!frame)
            return buffer; // no frames to draw
        for (let y = 0; y < Math.min(frame.length, innerHeight); y++) {
            const line = frame[y];
            for (let x = 0; x < Math.min(line.length, innerWidth); x++) {
                buffer[y + yOffset][x + xOffset] = line[x];
            }
        }
        this.buffer = buffer;
        return buffer;
    }
}
// Utility to parse sprite sheets with ↲ delimiter
function parseSpriteSheet(input, delimiter = '↲') {
    const parts = input.includes(delimiter) ? input.split(delimiter) : [input];
    return parts.map((block) => {
        const lines = block.split('\n').map((line) => [...line.replace(/\r$/, '')]);
        // if the first line is empty, remove it
        if (lines[0].length === 0)
            lines.shift();
        return lines;
    });
}
