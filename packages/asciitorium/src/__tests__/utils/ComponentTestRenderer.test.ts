import { describe, test, expect, beforeEach } from 'vitest';
import { ComponentTestRenderer } from './ComponentTestRenderer';
import { Button } from '../../components/Button';
import { Text } from '../../components/Text';

describe('ComponentTestRenderer', () => {
  let renderer: ComponentTestRenderer;

  beforeEach(() => {
    renderer = new ComponentTestRenderer();
  });

  afterEach(() => {
    renderer.cleanup();
  });

  describe('render', () => {
    test('should render component and return buffer', () => {
      const text = new Text({ content: 'Test Content', width: 10, height: 3 });
      const buffer = renderer.render(text);
      
      expect(buffer).toBeInstanceOf(Array);
      expect(buffer).toHaveLength(3);
      expect(buffer[0]).toHaveLength(10);
    });

    test('should handle components with different sizes', () => {
      const button = new Button({ content: 'Button', width: 15, height: 4 });
      const buffer = renderer.render(button);
      
      expect(buffer).toHaveLength(4);
      expect(buffer[0]).toHaveLength(15);
    });
  });

  describe('getAsString', () => {
    test('should convert buffer to readable string', () => {
      const text = new Text({ content: 'Hello', width: 10, height: 3 });
      const buffer = renderer.render(text);
      const string = renderer.getAsString(buffer);
      
      expect(typeof string).toBe('string');
      expect(string).toContain('Hello');
    });
  });

  describe('getDimensions', () => {
    test('should return component dimensions', () => {
      const button = new Button({ width: 20, height: 6 });
      const dimensions = renderer.getDimensions(button);
      
      expect(dimensions).toEqual({ width: 20, height: 6 });
    });
  });

  describe('event simulation', () => {
    test('should simulate key events', () => {
      const button = new Button({ content: 'Test' });
      const result = renderer.sendKey(button, 'Enter');
      
      // Button should handle Enter key
      expect(typeof result).toBe('boolean');
    });

    test('should simulate focus/blur', () => {
      const button = new Button({ content: 'Focusable' });
      
      renderer.focus(button);
      expect((button as any).hasFocus).toBe(true);
      
      renderer.blur(button);
      expect((button as any).hasFocus).toBe(false);
    });
  });

  describe('cleanup', () => {
    test('should cleanup resources without error', () => {
      const button = new Button({ content: 'Test' });
      renderer.render(button);
      
      expect(() => renderer.cleanup()).not.toThrow();
    });

    test('should handle cleanup when no component rendered', () => {
      expect(() => renderer.cleanup()).not.toThrow();
    });
  });
});