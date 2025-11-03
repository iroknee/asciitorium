/**
 * A terminal-based renderer that outputs a 2D array of strings to the terminal.
 */
import { Renderer } from './Renderer.js';

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
    // Reserve 1 line for terminal prompt/status
    return { width, height: Math.max(1, height - 1) };
  }

  render(buffer: string[][]): void {
    const lines = buffer.map((row) => row.join('')).join('\n');
    process.stdout.write('\x1b[2J'); // Clear screen (ANSI)
    process.stdout.write('\x1b[H'); // Move cursor to home position (0,0)
    process.stdout.write('\x1b[38;2;44;208;58m'); // Set text color to #2cd03a
    process.stdout.write(lines + '\n');
    process.stdout.write('\x1b[0m'); // Reset color
  }
}
