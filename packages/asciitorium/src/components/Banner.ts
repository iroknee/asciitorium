import { Component, ComponentProps } from '../core/Component.js';
import { requestRender } from '../core/RenderScheduler.js';
import { State } from '../core/State.js';
import { AssetManager, type FontAsset } from '../core/AssetManager.js';

export interface BannerOptions extends Omit<ComponentProps, 'children'> {
  font: string; // Font asset name for styled text rendering
  text?: string | State<string>; // Text to render using font
  letterSpacing?: number; // Additional spacing between characters (default: 0)
}

export class Banner extends Component {
  private textState?: State<string>;
  private isLoading = false;
  private loadError?: string;
  private font: string;
  private fontAsset?: FontAsset;
  private text: string;
  private letterSpacing: number = 0;
  private isDestroyed = false; // Track if component has been destroyed

  constructor(options: BannerOptions) {
    const borderPadding = options.border ? 2 : 0;

    // Use placeholder dimensions during loading
    const placeholderWidth = 12; // "Loading..." length + border
    const placeholderHeight = 1 + borderPadding;

    // Call super() with placeholder dimensions
    const { font, text, letterSpacing, ...componentProps } = options;
    super({
      ...componentProps,
      width: options.width ?? options.style?.width ?? placeholderWidth,
      height: options.height ?? options.style?.height ?? placeholderHeight,
    });

    // Set letter spacing (default 0 if not provided)
    this.letterSpacing = letterSpacing ?? 0;

    // Set font and text
    this.font = font;

    // Handle text prop (string or State)
    if (text instanceof State) {
      this.textState = text;
      this.text = text.value;
    } else {
      this.text = text || '';
    }

    // Set loading state
    this.isLoading = true;

    // Start async loading using AssetManager
    AssetManager.getFont(font)
      .then((fontAsset) => {
        if (this.isDestroyed) return;

        this.isLoading = false;
        this.loadError = undefined;
        this.fontAsset = fontAsset;

        // Recalculate dimensions based on text and font
        const renderedBuffer = this.renderTextWithFont(this.text, fontAsset);
        const textWidth = Math.max(...renderedBuffer.map((line) => line.length), 0);
        const textHeight = renderedBuffer.length;

        this.originalHeight = textHeight + borderPadding;
        this.originalWidth = textWidth + borderPadding;
        this.width = textWidth + borderPadding;
        this.height = textHeight + borderPadding;

        // Set up state subscription for reactive text
        if (this.textState) {
          this.bind(this.textState, (newValue: string) => {
            this.text = newValue;
            this.updateFontText();
          });
        }

        requestRender();
        this.forceRenderIfNeeded();
      })
      .catch((error: Error) => {
        if (this.isDestroyed) return;

        this.isLoading = false;
        this.loadError = error.message || 'Failed to load font';
        requestRender();
        this.forceRenderIfNeeded();
      });
  }

  private forceRenderIfNeeded(): void {
    // Use the base class method for focus refresh (which also triggers render)
    this.notifyAppOfFocusRefresh();
  }

  private renderTextWithFont(text: string, fontAsset: FontAsset): string[][] {
    if (!text || text.length === 0) {
      return [[]];
    }

    const height = fontAsset.height;
    const result: string[][] = [];

    // Initialize result buffer with empty strings
    for (let y = 0; y < height; y++) {
      result.push([]);
    }

    // Process each character
    for (let i = 0; i < text.length; i++) {
      const char = text[i];
      const glyph = fontAsset.glyphs.get(char);

      if (!glyph) {
        // Fallback: render the character itself as a single-width glyph
        for (let y = 0; y < height; y++) {
          if (y === 0) {
            result[y].push(char);
          } else {
            result[y].push(' ');
          }
        }
      } else {
        // Render the glyph - each line must be padded to glyph.width
        for (let y = 0; y < height; y++) {
          if (y < glyph.lines.length) {
            const glyphLine = glyph.lines[y];
            // Add characters from the glyph line
            for (let x = 0; x < glyphLine.length; x++) {
              result[y].push(glyphLine[x]);
            }
            // Pad the rest with spaces to reach glyph.width
            for (let x = glyphLine.length; x < glyph.width; x++) {
              result[y].push(' ');
            }
          } else {
            // Pad entire line with spaces if glyph is shorter than font height
            for (let x = 0; x < glyph.width; x++) {
              result[y].push(' ');
            }
          }
        }
      }

      // Add letter spacing after each character (except the last one)
      if (i < text.length - 1 && this.letterSpacing > 0) {
        for (let y = 0; y < height; y++) {
          for (let s = 0; s < this.letterSpacing; s++) {
            result[y].push(' ');
          }
        }
      }
    }

    return result;
  }

  private updateFontText(): void {
    if (this.isDestroyed) return;
    if (!this.fontAsset || !this.text) return;

    // Recalculate dimensions based on new text
    const renderedBuffer = this.renderTextWithFont(this.text, this.fontAsset);
    const textWidth = Math.max(...renderedBuffer.map((line) => line.length), 0);
    const textHeight = renderedBuffer.length;
    const borderPadding = this.border ? 2 : 0;

    this.originalHeight = textHeight + borderPadding;
    this.originalWidth = textWidth + borderPadding;
    this.width = textWidth + borderPadding;
    this.height = textHeight + borderPadding;

    // Request a re-render
    requestRender();
  }

  override destroy(): void {
    this.isDestroyed = true;
    super.destroy();
    // Note: Component.destroy() automatically handles state unsubscriptions
  }

  override draw(): string[][] {
    try {
      const buffer = super.draw();

      // Defensive check: ensure buffer was created successfully
      if (!buffer || buffer.length === 0) {
        return buffer;
      }

      const xOffset = this.border ? 1 : 0;
      const yOffset = this.border ? 1 : 0;
      const innerWidth = this.width - (this.border ? 2 : 0);
      const innerHeight = this.height - (this.border ? 2 : 0);

      // Show loading or error state
      if (this.isLoading || this.loadError) {
        const displayText = this.loadError ? `Error: ${this.loadError}` : 'Loading...';
        const chars = [...displayText];
        const bufferY = yOffset;

        if (bufferY < buffer.length) {
          for (let x = 0; x < Math.min(chars.length, innerWidth); x++) {
            const bufferX = x + xOffset;
            if (buffer[bufferY] && bufferX < buffer[bufferY].length) {
              buffer[bufferY][bufferX] = chars[x];
            }
          }
        }

        this.buffer = buffer;
        return buffer;
      }

      // Font rendering mode
      if (this.fontAsset && this.text !== undefined) {
        const lines = this.renderTextWithFont(this.text, this.fontAsset);
        for (let y = 0; y < Math.min(lines.length, innerHeight); y++) {
          const line = lines[y];
          const bufferY = y + yOffset;
          // Defensive check: ensure buffer row exists (race condition protection)
          if (bufferY >= buffer.length) break;

          for (let x = 0; x < Math.min(line.length, innerWidth); x++) {
            const bufferX = x + xOffset;
            // Defensive check: ensure buffer column exists (race condition protection)
            if (!buffer[bufferY] || bufferX >= buffer[bufferY].length) break;

            const char = line[x];
            buffer[bufferY][bufferX] = char;
          }
        }
        this.buffer = buffer;
        return buffer;
      }

      return buffer;
    } catch (error) {
      // If any error occurs during draw, return empty buffer to prevent crash
      console.error('Banner component draw() error:', error);
      return super.draw(); // Return basic empty buffer
    }
  }
}
