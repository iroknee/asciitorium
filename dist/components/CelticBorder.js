import { Component } from '../core/Component';
const borderPatterns = {
    topLeft: ['╭⎯╮╭⎯⎯⎯⎯⎯', '⏐╭⎯⎯⎯⎯', '╰⎯⏐╯', '╭⏐╯', '⏐⏐', '⏐⏐', '⏐', '⏐'],
    topRight: [
        '⎯⎯⎯⎯╮╭⎯╮',
        ' ⎯⎯⎯⎯⎯╮⏐',
        '    ╰⏐⎯╯',
        '     ╰⏐╮',
        '      ⏐⏐',
        '      ⏐⏐',
        '       ⏐',
        '       ⏐',
    ],
    bottomLeft: ['⏐', '⏐', '⏐⏐', '⏐⏐', '╰⏐╮', '╭⎯⏐╮', '⏐╰⎯⎯⎯⎯⎯', '╰⎯╯╰⎯⎯⎯⎯⎯'],
    bottomRight: [
        '       ⏐',
        '       ⏐',
        '      ⏐⏐',
        '      ⏐⏐',
        '     ╭⏐╯',
        '    ╭⏐⎯╮',
        '  ⎯⎯⎯⎯╯⏐',
        '⎯⎯⎯⎯╯╰⎯╯',
    ],
};
export class CelticBorder extends Component {
    constructor({ corner, ...options }) {
        const pattern = borderPatterns[corner];
        const width = Math.max(...pattern.map((line) => line.length));
        const height = pattern.length;
        super({
            width,
            height,
            fill: ' ',
            border: false,
            ...options,
        });
        this.lines = pattern.map((line) => Array.from(line));
    }
    draw() {
        this.buffer = Array.from({ length: this.height }, (_, y) => Array.from({ length: this.width }, (_, x) => this.lines[y]?.[x] ?? ' '));
        return this.buffer;
    }
}
