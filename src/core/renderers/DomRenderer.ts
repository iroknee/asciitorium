/**
 * A DOM-based renderer that outputs a 2D array of strings to an HTML element.
 */
import { Renderer } from './Renderer';

export class DomRenderer implements Renderer {
  constructor(private screen: HTMLElement) {
    this.screen.style.whiteSpace = 'pre';
  }

  render(buffer: string[][]): void {
    this.screen.textContent = buffer.map((row) => row.join('')).join('\n');
  }
}
