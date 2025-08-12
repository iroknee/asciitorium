/**
 * A DOM-based renderer that outputs a 2D array of strings to an HTML element.
 */
import { Renderer } from './Renderer';
export declare class DomRenderer implements Renderer {
    private screen;
    constructor(screen: HTMLElement);
    render(buffer: string[][]): void;
}
