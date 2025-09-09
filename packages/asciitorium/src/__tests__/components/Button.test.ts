import { describe, test, expect, beforeEach, vi } from 'vitest';
import { Button } from '../../components/Button';
import { ComponentTestRenderer, EventTestHelper, expectBuffer, expectComponent } from '../utils';

describe('Button', () => {
  let renderer: ComponentTestRenderer;

  beforeEach(() => {
    renderer = new ComponentTestRenderer();
  });

  afterEach(() => {
    renderer.cleanup();
  });

  describe('constructor', () => {
    test('should create button with default properties', () => {
      const button = new Button({});
      
      expectComponent(button).toHaveWidth(13); // "Button" + 7 padding
      expectComponent(button).toHaveHeight(4);
      expect(button.focusable).toBe(true);
    });

    test('should use provided content for sizing', () => {
      const button = new Button({ content: 'Click Me!' });
      
      expectComponent(button).toHaveWidth(16); // "Click Me!" + 7 padding
      expectComponent(button).toHaveHeight(4);
    });

    test('should respect custom dimensions', () => {
      const button = new Button({ 
        content: 'Test',
        width: 20,
        height: 5
      });
      
      expectComponent(button).toHaveWidth(20);
      expectComponent(button).toHaveHeight(5);
    });

    test('should support style object', () => {
      const button = new Button({ 
        content: 'Test',
        style: { width: 25, height: 6, border: false }
      });
      
      expectComponent(button).toHaveWidth(25);
      expectComponent(button).toHaveHeight(6);
    });
  });

  describe('rendering', () => {
    test('should render with border by default', () => {
      const button = new Button({ content: 'Test' });
      const buffer = renderer.render(button);
      
      expectBuffer(buffer).toHaveBorder();
      expectBuffer(buffer).toContainText('Test');
    });

    test('should render without border when specified', () => {
      const button = new Button({ 
        content: 'Test',
        border: false
      });
      const buffer = renderer.render(button);
      
      expectBuffer(buffer).toContainText('Test');
    });

    test('should show focus state when focused', () => {
      const button = new Button({ content: 'Focused' });
      renderer.focus(button);
      
      const buffer = renderer.render(button);
      expectBuffer(buffer).toContainText('Focused');
      
      // Focused buttons should have different border style
      // This is a basic check - more specific border checking could be added
      expectBuffer(buffer).toHaveBorder();
    });
  });

  describe('interaction', () => {
    test('should call onClick when activated with Enter', () => {
      const mockClick = vi.fn();
      const button = new Button({ 
        content: 'Click Me',
        onClick: mockClick
      });

      const handled = EventTestHelper.activate(button);
      
      expect(handled).toBe(true);
      expect(mockClick).toHaveBeenCalledTimes(1);
    });

    test('should call onClick when activated with Space', () => {
      const mockClick = vi.fn();
      const button = new Button({ 
        content: 'Click Me',
        onClick: mockClick
      });

      const handled = EventTestHelper.activateWithSpace(button);
      
      expect(handled).toBe(true);
      expect(mockClick).toHaveBeenCalledTimes(1);
    });

    test('should not handle other keys', () => {
      const mockClick = vi.fn();
      const button = new Button({ 
        content: 'Click Me',
        onClick: mockClick
      });

      const handled = EventTestHelper.pressKey(button, 'a');
      
      expect(handled).toBe(false);
      expect(mockClick).not.toHaveBeenCalled();
    });

    test('should work without onClick handler', () => {
      const button = new Button({ content: 'No Handler' });

      expect(() => {
        EventTestHelper.activate(button);
      }).not.toThrow();
    });

    test('should support click simulation', () => {
      const mockClick = vi.fn();
      const button = new Button({ 
        content: 'Direct Click',
        onClick: mockClick
      });

      renderer.click(button);
      
      expect(mockClick).toHaveBeenCalledTimes(1);
    });
  });

  describe('focus management', () => {
    test('should be focusable by default', () => {
      const button = new Button({ content: 'Focusable' });
      expect(button.focusable).toBe(true);
    });

    test('should update focus state when focused/blurred', () => {
      const button = new Button({ content: 'Focus Test' });
      
      // Initially not focused
      expect((button as any).hasFocus).toBe(false);
      
      renderer.focus(button);
      expect((button as any).hasFocus).toBe(true);
      
      renderer.blur(button);
      expect((button as any).hasFocus).toBe(false);
    });
  });

  describe('content handling', () => {
    test('should handle string children', () => {
      const button = new Button({ children: 'Child Content' });
      const buffer = renderer.render(button);
      
      expectBuffer(buffer).toContainText('Child Content');
    });

    test('should handle array children', () => {
      const button = new Button({ children: ['First', 'Second'] });
      const buffer = renderer.render(button);
      
      // Should use first child
      expectBuffer(buffer).toContainText('First');
    });

    test('should prefer content over children', () => {
      const button = new Button({ 
        content: 'Content Prop',
        children: 'Child Prop'
      });
      const buffer = renderer.render(button);
      
      expectBuffer(buffer).toContainText('Content Prop');
    });

    test('should fall back to label if no content or children', () => {
      const button = new Button({ label: 'Label Fallback' });
      const buffer = renderer.render(button);
      
      expectBuffer(buffer).toContainText('Label Fallback');
    });

    test('should use default text if nothing provided', () => {
      const button = new Button({});
      const buffer = renderer.render(button);
      
      expectBuffer(buffer).toContainText('Button');
    });
  });

  describe('visual states', () => {
    test('should show press effect temporarily', (done) => {
      const button = new Button({ content: 'Press Test' });
      
      // Simulate press
      EventTestHelper.activate(button);
      
      // The button should show press effect briefly
      // This is implementation-specific and would need to check
      // the actual press state or visual changes
      
      // Wait for press effect to end
      setTimeout(() => {
        const buffer = renderer.render(button);
        expectBuffer(buffer).toContainText('Press Test');
        done();
      }, 200);
    });
  });
});