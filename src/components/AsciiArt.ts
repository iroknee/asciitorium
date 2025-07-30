import { Component, ComponentProps } from '../core/Component';

export interface ArtOptions extends Omit<ComponentProps, 'width' | 'height'> {
  width?: number;
  height?: number;
  content: string;
}

export class AsciiArt extends Component {
  private content: string[][];

  constructor(options: ArtOptions) {
    const lines = options.content.split('\n');
    const artWidth = Math.max(...lines.map((line) => line.length));
    const artHeight = lines.length;

    // Add border padding if needed
    const borderPadding = options.border ? 2 : 0;

    const resolvedOptions = {
      ...options,
      width: options.width ?? artWidth + borderPadding,
      height: options.height ?? artHeight + borderPadding,
    };

    super(resolvedOptions);

    this.content = lines.map((line) => [...line.padEnd(artWidth)]);
  }

  setContent(newArt: string): void {
    const lines = newArt.split('\n');
    const artWidth = Math.max(...lines.map((line) => line.length));
    const artHeight = lines.length;

    this.content = lines.map((line) => [...line.padEnd(artWidth)]);

    // Update dimensions only if art is bigger than current content area
    const innerWidth = this.width - (this.border ? 2 : 0);
    const innerHeight = this.height - (this.border ? 2 : 0);

    if (artWidth > innerWidth || artHeight > innerHeight) {
      this.width = artWidth + (this.border ? 2 : 0);
      this.height = artHeight + (this.border ? 2 : 0);
    }

    this.dirty = true;
  }

  draw(): string[][] {
    if (this.dirty) {
      super.draw(); // builds the base buffer with fill/border/label

      const xOffset = this.border ? 1 : 0;
      const yOffset = this.border ? 1 : 0;

      for (let y = 0; y < this.content.length; y++) {
        if (y + yOffset >= this.height - (this.border ? 1 : 0)) break;
        for (let x = 0; x < this.content[y].length; x++) {
          if (x + xOffset >= this.width - (this.border ? 1 : 0)) break;
          this.buffer[y + yOffset][x + xOffset] = this.content[y][x];
        }
      }

      this.dirty = false;
    }

    return this.buffer;
  }
}
