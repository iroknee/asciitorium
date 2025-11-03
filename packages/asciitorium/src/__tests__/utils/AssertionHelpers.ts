import { expect } from 'vitest';
import { Component } from '../../core/Component.js';

/**
 * Custom assertion helpers for testing asciitorium components
 */

export interface BufferMatchers {
  toContainText(text: string): void;
  toHaveDimensions(width: number, height: number): void;
  toHaveBorder(): void;
  toBeEmpty(): void;
  toMatchPattern(pattern: RegExp): void;
}

export interface ComponentMatchers {
  toBeFocused(): void;
  toBeVisible(): void;
  toHaveStyle(expectedStyle: Partial<any>): void;
  toHaveWidth(width: number): void;
  toHaveHeight(height: number): void;
}

/**
 * Buffer assertion helpers
 */
export function expectBuffer(buffer: string[][]): BufferMatchers {
  return {
    toContainText(text: string) {
      const bufferString = buffer.map(row => row.join('')).join('\n');
      expect(bufferString).toContain(text);
    },

    toHaveDimensions(width: number, height: number) {
      expect(buffer).toHaveLength(height);
      if (buffer.length > 0) {
        expect(buffer[0]).toHaveLength(width);
      }
    },

    toHaveBorder() {
      if (buffer.length < 2 || buffer[0].length < 2) {
        throw new Error('Buffer too small to contain a border');
      }
      
      // Check for border characters (basic border detection)
      const topRow = buffer[0].join('');
      const bottomRow = buffer[buffer.length - 1].join('');
      
      const borderChars = ['╭', '╮', '╯', '╰', '─', '│', '┌', '┐', '┘', '└', '═', '║'];
      const hasBorderChars = (str: string) => borderChars.some(char => str.includes(char));
      
      expect(hasBorderChars(topRow) || hasBorderChars(bottomRow)).toBe(true);
    },

    toBeEmpty() {
      const bufferString = buffer.map(row => row.join('')).join('').trim();
      expect(bufferString).toBe('');
    },

    toMatchPattern(pattern: RegExp) {
      const bufferString = buffer.map(row => row.join('')).join('\n');
      expect(bufferString).toMatch(pattern);
    },
  };
}

/**
 * Component assertion helpers
 */
export function expectComponent(component: Component): ComponentMatchers {
  return {
    toBeFocused() {
      if ('hasFocus' in component) {
        expect((component as any).hasFocus).toBe(true);
      } else {
        throw new Error('Component does not support focus');
      }
    },

    toBeVisible() {
      expect(component.width).toBeGreaterThan(0);
      expect(component.height).toBeGreaterThan(0);
    },

    toHaveStyle(expectedStyle: Partial<any>) {
      Object.entries(expectedStyle).forEach(([key, value]) => {
        if (key in component) {
          expect((component as any)[key]).toBe(value);
        } else {
          throw new Error(`Component does not have style property: ${key}`);
        }
      });
    },

    toHaveWidth(width: number) {
      expect(component.width).toBe(width);
    },

    toHaveHeight(height: number) {
      expect(component.height).toBe(height);
    },
  };
}

/**
 * Helper to check if a buffer contains specific characters at specific positions
 */
export function expectBufferAt(buffer: string[][], x: number, y: number): {
  toHaveChar(char: string): void;
  toBeEmpty(): void;
} {
  return {
    toHaveChar(char: string) {
      if (y >= buffer.length || x >= buffer[y].length) {
        throw new Error(`Position (${x}, ${y}) is outside buffer bounds`);
      }
      expect(buffer[y][x]).toBe(char);
    },

    toBeEmpty() {
      if (y >= buffer.length || x >= buffer[y].length) {
        throw new Error(`Position (${x}, ${y}) is outside buffer bounds`);
      }
      expect(buffer[y][x]).toBe(' ');
    },
  };
}