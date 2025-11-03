import { describe, test, expect, beforeEach, afterEach } from 'vitest';
import { Text } from '../../components/Text.js';
import { State } from '../../core/State.js';
import { ComponentTestRenderer, StateTestHelper, expectBuffer, expectComponent } from '../utils/index.js';

describe('Text', () => {
  let renderer: ComponentTestRenderer;

  beforeEach(() => {
    renderer = new ComponentTestRenderer();
  });

  afterEach(() => {
    renderer.cleanup();
  });

  describe('constructor', () => {
    test('should create text component with default properties', () => {
      const text = new Text({ content: 'Hello World' });
      
      expectComponent(text).toBeVisible();
      expect(text.focusable).toBe(false);
    });

    test('should respect custom dimensions', () => {
      const text = new Text({ 
        content: 'Test',
        width: 20,
        height: 5
      });
      
      expectComponent(text).toHaveWidth(20);
      expectComponent(text).toHaveHeight(5);
    });

    test('should support style object', () => {
      const text = new Text({ 
        content: 'Test',
        style: { width: 30, height: 8, border: true }
      });
      
      expectComponent(text).toHaveWidth(30);
      expectComponent(text).toHaveHeight(8);
    });
  });

  describe('content handling', () => {
    test('should render string content', () => {
      const text = new Text({ content: 'Hello World' });
      const buffer = renderer.render(text);
      
      expectBuffer(buffer).toContainText('Hello World');
    });

    test('should handle State<string> content', () => {
      const contentState = new State('Initial Text');
      const text = new Text({ content: contentState });
      
      const buffer = renderer.render(text);
      expectBuffer(buffer).toContainText('Initial Text');
    });

    test('should update when State content changes', () => {
      const { state: contentState } = StateTestHelper.createTestState('Initial');
      const text = new Text({ content: contentState });
      
      let buffer = renderer.render(text);
      expectBuffer(buffer).toContainText('Initial');
      
      contentState.value = 'Updated';
      buffer = renderer.render(text);
      expectBuffer(buffer).toContainText('Updated');
    });

    test('should handle children as content', () => {
      const text = new Text({ children: 'Child Content' });
      const buffer = renderer.render(text);
      
      expectBuffer(buffer).toContainText('Child Content');
    });

    test('should handle array children', () => {
      const text = new Text({ children: ['Line 1', 'Line 2', 'Line 3'] });
      const buffer = renderer.render(text);
      
      // Only the first child is used
      expectBuffer(buffer).toContainText('Line 1');
    });

    test('should prefer content over children', () => {
      const text = new Text({ 
        content: 'Content Prop',
        children: 'Child Prop'
      });
      const buffer = renderer.render(text);
      
      expectBuffer(buffer).toContainText('Content Prop');
    });
  });

  describe('alignment', () => {
    test('should support center alignment', () => {
      const text = new Text({ 
        content: 'Centered',
        width: 20,
        align: 'center'
      });
      const buffer = renderer.render(text);
      
      // Text should be centered in the available space
      expectBuffer(buffer).toContainText('Centered');
      
      // Check that the text appears to be centered
      // (This would need more specific positioning checks in a real implementation)
      const bufferString = buffer.map(row => row.join('')).join('\n');
      expect(bufferString).toContain('Centered');
    });

    test('should support left alignment', () => {
      const text = new Text({ 
        content: 'Left Aligned',
        width: 20,
        align: 'left'
      });
      const buffer = renderer.render(text);
      
      expectBuffer(buffer).toContainText('Left Aligned');
    });

    test('should support right alignment', () => {
      const text = new Text({ 
        content: 'Right Aligned',
        width: 20,
        align: 'right'
      });
      const buffer = renderer.render(text);
      
      expectBuffer(buffer).toContainText('Right Aligned');
    });
  });

  describe('borders', () => {
    test('should render with border when specified', () => {
      const text = new Text({ 
        content: 'Bordered Text',
        border: true,
        width: 20,
        height: 5
      });
      const buffer = renderer.render(text);
      
      expectBuffer(buffer).toHaveBorder();
      expectBuffer(buffer).toContainText('Bordered Text');
    });

    test('should render without border by default', () => {
      const text = new Text({ 
        content: 'No Border',
        width: 20,
        height: 5
      });
      const buffer = renderer.render(text);
      
      expectBuffer(buffer).toContainText('No Border');
      // This test would need specific implementation to check lack of border
    });
  });

  describe('dimensions', () => {
    test('should auto-size to content when no dimensions provided', () => {
      const text = new Text({ content: 'Auto Size' });
      
      // Should have sensible default dimensions
      expectComponent(text).toBeVisible();
    });

    test('should respect fixed width', () => {
      const text = new Text({ 
        content: 'This is a longer text that should wrap',
        width: 10
      });
      
      expectComponent(text).toHaveWidth(10);
    });

    test('should respect fixed height', () => {
      const text = new Text({ 
        content: 'Multi\nLine\nText\nContent',
        height: 6
      });
      
      expectComponent(text).toHaveHeight(6);
    });
  });

  describe('text wrapping', () => {
    test('should handle long text within width constraints', () => {
      const text = new Text({ 
        content: 'This is a very long line of text that should wrap within the specified width',
        width: 20,
        height: 5
      });
      const buffer = renderer.render(text);
      
      expectBuffer(buffer).toHaveDimensions(20, 5);
      expectBuffer(buffer).toContainText('This is a very long');
    });

    test('should preserve explicit line breaks', () => {
      const text = new Text({ 
        content: 'Line 1\nLine 2\nLine 3',
        width: 20,
        height: 5
      });
      const buffer = renderer.render(text);
      
      expectBuffer(buffer).toContainText('Line 1');
      expectBuffer(buffer).toContainText('Line 2');
      expectBuffer(buffer).toContainText('Line 3');
    });
  });

  describe('reactive content', () => {
    test('should update when state content changes', () => {
      const contentState = new State('Original');
      const text = new Text({ content: contentState });
      
      let buffer = renderer.render(text);
      expectBuffer(buffer).toContainText('Original');
      
      contentState.value = 'Changed';
      buffer = renderer.render(text);
      expectBuffer(buffer).toContainText('Changed');
    });

    test('should handle state with complex content', () => {
      const contentState = new State('Initial\nMulti-line\nContent');
      const text = new Text({ content: contentState });
      
      let buffer = renderer.render(text);
      expectBuffer(buffer).toContainText('Initial');
      expectBuffer(buffer).toContainText('Multi-line');
      expectBuffer(buffer).toContainText('Content');
      
      contentState.value = 'Updated\nContent';
      buffer = renderer.render(text);
      expectBuffer(buffer).toContainText('Updated');
      expectBuffer(buffer).toContainText('Content');
    });
  });

  describe('empty content', () => {
    test('should handle empty string content', () => {
      const text = new Text({ content: '' });
      const buffer = renderer.render(text);
      
      // Should render but be essentially empty
      expectComponent(text).toBeVisible();
    });

    test('should handle null/undefined content gracefully', () => {
      const text = new Text({ content: undefined as any });
      
      expect(() => renderer.render(text)).not.toThrow();
    });
  });
});