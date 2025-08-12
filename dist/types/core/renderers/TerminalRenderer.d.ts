/**
 * A terminal-based renderer that outputs a 2D array of strings to the terminal.
 */
import { Renderer } from './Renderer';
export declare class TerminalRenderer implements Renderer {
    render(buffer: string[][]): void;
}
