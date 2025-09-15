/**
 * A terminal-based renderer that outputs a 2D array of strings to the terminal.
 */
import { Renderer } from './Renderer';

export class TTYRenderer implements Renderer {
  getScreenSize(): { width: number; height: number } {
    // Use process.stdout.columns and rows if available (Node.js terminal)
    let width = 80; // Default fallback
    let height = 24; // Default fallback

    if (process.stdout.isTTY) {
      width = process.stdout.columns || 80;
      height = process.stdout.rows || 24;
    } else {
      // Try to get terminal size from environment variables or tty
      try {
        const tty = require('tty');
        if (tty.isatty(1)) {
          // Check if stdout is a TTY
          const size = tty.getWindowSize();
          if (size && size.length >= 2) {
            width = size[0];
            height = size[1];
          }
        }
      } catch (e) {
        // Fallback to environment variables
        width = parseInt(process.env.COLUMNS || '80', 10);
        height = parseInt(process.env.LINES || '24', 10);
      }
    }
    return { width, height };
  }

  render(buffer: string[][]): void {
    const lines = buffer.map((row) => row.join('')).join('\n');
    process.stdout.write('\x1Bc'); // Clear screen (ANSI)
    process.stdout.write(lines + '\n');
  }
}
