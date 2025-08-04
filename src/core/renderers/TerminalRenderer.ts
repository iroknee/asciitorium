/**
 * A terminal-based renderer that outputs a 2D array of strings to the terminal.
 */
import { Renderer } from './renderers/Renderer';

export class TerminalRenderer implements Renderer {
  render(buffer: string[][]): void {
    const lines = buffer.map((row) => row.join('')).join('\n');
    process.stdout.write('\x1Bc'); // Clear screen (ANSI)
    process.stdout.write(lines + '\n');
  }
}
