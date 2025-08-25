/**
 * A DOM-based renderer that outputs a 2D array of strings to an HTML element.
 */
import { Renderer } from './Renderer';

export class DomRenderer implements Renderer {
  private charWidth: number = 0;
  private charHeight: number = 0;

  constructor(private screen: HTMLElement) {
    this.screen.style.whiteSpace = 'pre';
    this.screen.style.fontFamily = 'PrintChar21, monospace';
    
    // Delay measurement slightly to ensure CSS is applied
    setTimeout(() => this.measureCharacterSize(), 10);
  }

  private measureCharacterSize(): void {
    // Create a temporary element to measure character dimensions
    const measureElement = document.createElement('span');
    measureElement.style.position = 'absolute';
    measureElement.style.visibility = 'hidden';
    measureElement.style.whiteSpace = 'pre';
    measureElement.style.fontFamily = this.screen.style.fontFamily;
    measureElement.style.fontSize = getComputedStyle(this.screen).fontSize || '16px';
    measureElement.textContent = 'M'; // Use 'M' as it's typically the widest character
    
    document.body.appendChild(measureElement);
    const rect = measureElement.getBoundingClientRect();
    this.charWidth = rect.width;
    this.charHeight = rect.height;
    document.body.removeChild(measureElement);

    console.log('Character measurement:', {
      charWidth: this.charWidth,
      charHeight: this.charHeight,
      font: measureElement.style.fontFamily,
      fontSize: measureElement.style.fontSize
    });

    // Fallback values if measurement fails
    if (this.charWidth === 0) this.charWidth = 8;
    if (this.charHeight === 0) this.charHeight = 16;
  }

  getScreenSize(): { width: number; height: number } {
    if (this.charWidth === 0 || this.charHeight === 0) {
      this.measureCharacterSize();
    }

    const rect = this.screen.getBoundingClientRect();
    const availableWidth = rect.width || window.innerWidth;
    const availableHeight = rect.height || window.innerHeight;

    const width = Math.floor(availableWidth / this.charWidth);
    const height = Math.floor(availableHeight / this.charHeight);

    console.log('Screen size calculation:', {
      screenRect: { width: rect.width, height: rect.height },
      availableWidth,
      availableHeight,
      charWidth: this.charWidth,
      charHeight: this.charHeight,
      calculatedWidth: width,
      calculatedHeight: height
    });

    // Minimum size fallback
    const result = {
      width: Math.max(width, 80),
      height: Math.max(height, 24)
    };

    return result;
  }

  render(buffer: string[][]): void {
    this.screen.textContent = buffer.map((row) => row.join('')).join('\n');
  }
}
