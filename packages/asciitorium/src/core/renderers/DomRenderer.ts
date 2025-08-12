/**
 * A DOM-based renderer that outputs a 2D array of strings to an HTML element.
 */
import { Renderer } from './Renderer';

export class DomRenderer implements Renderer {
  constructor(private screen: HTMLElement) {
    this.screen.style.whiteSpace = 'pre';

    if (document.fonts.check('1em PrintChar21')) {
      this.screen.style.fontFamily = 'PrintChar21';
    } else {
      this.screen.style.fontFamily = 'monospace';
    }
  }

  render(buffer: string[][]): void {
    this.screen.textContent = buffer.map((row) => row.join('')).join('\n');
  }
}
