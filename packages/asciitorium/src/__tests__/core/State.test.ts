import { describe, test, expect, beforeEach, vi } from 'vitest';
import { State } from '../../core/State.js';
import { StateTestHelper } from '../utils/index.js';

describe('State', () => {
  describe('constructor', () => {
    test('should initialize with provided value', () => {
      const state = new State('initial');
      expect(state.value).toBe('initial');
    });

    test('should work with different data types', () => {
      const stringState = new State('text');
      const numberState = new State(42);
      const booleanState = new State(true);
      const objectState = new State({ key: 'value' });

      expect(stringState.value).toBe('text');
      expect(numberState.value).toBe(42);
      expect(booleanState.value).toBe(true);
      expect(objectState.value).toEqual({ key: 'value' });
    });
  });

  describe('value getter/setter', () => {
    test('should update value when set', () => {
      const state = new State('initial');
      state.value = 'updated';
      expect(state.value).toBe('updated');
    });

    test('should not trigger listeners when set to same value', () => {
      const { state, mockListener } = StateTestHelper.createTestState('same');
      
      // Clear the initial subscription call
      mockListener.mockClear();
      
      state.value = 'same';
      expect(mockListener).not.toHaveBeenCalled();
    });
  });

  describe('subscriptions', () => {
    test('should call listener immediately on subscribe', () => {
      const state = new State('initial');
      const listener = vi.fn();

      state.subscribe(listener);

      expect(listener).toHaveBeenCalledTimes(1);
      expect(listener).toHaveBeenCalledWith('initial');
    });

    test('should notify subscribers when value changes', () => {
      const { state, mockListener } = StateTestHelper.createTestState('initial');
      mockListener.mockClear(); // Clear initial call

      state.value = 'changed';

      expect(mockListener).toHaveBeenCalledTimes(1);
      expect(mockListener).toHaveBeenCalledWith('changed');
    });

    test('should support multiple subscribers', () => {
      const state = new State('initial');
      const listener1 = vi.fn();
      const listener2 = vi.fn();

      state.subscribe(listener1);
      state.subscribe(listener2);

      // Clear initial calls
      listener1.mockClear();
      listener2.mockClear();

      state.value = 'updated';

      expect(listener1).toHaveBeenCalledWith('updated');
      expect(listener2).toHaveBeenCalledWith('updated');
    });

    test('should handle subscription chaining', () => {
      const state1 = new State('a');
      const state2 = new State('b');
      
      const mockListener = vi.fn();
      state2.subscribe(mockListener);
      mockListener.mockClear();

      // Chain state1 changes to state2
      state1.subscribe((value) => {
        state2.value = `derived-${value}`;
      });

      state1.value = 'changed';

      expect(mockListener).toHaveBeenCalledWith('derived-changed');
    });
  });

  describe('unsubscribe', () => {
    test('should remove listener when unsubscribed', () => {
      const state = new State('initial');
      const listener = vi.fn();

      state.subscribe(listener);
      listener.mockClear(); // Clear initial call
      
      state.unsubscribe(listener);
      state.value = 'changed';

      expect(listener).not.toHaveBeenCalled();
    });

    test('should only remove specified listener', () => {
      const state = new State('initial');
      const listener1 = vi.fn();
      const listener2 = vi.fn();

      state.subscribe(listener1);
      state.subscribe(listener2);
      
      // Clear initial calls
      listener1.mockClear();
      listener2.mockClear();

      state.unsubscribe(listener1);
      state.value = 'changed';

      expect(listener1).not.toHaveBeenCalled();
      expect(listener2).toHaveBeenCalledWith('changed');
    });

    test('should handle unsubscribing non-existent listener gracefully', () => {
      const state = new State('initial');
      const listener = vi.fn();

      // Should not throw error
      expect(() => state.unsubscribe(listener)).not.toThrow();
    });
  });

  describe('StateTestHelper', () => {
    test('should provide working mock listeners', () => {
      const mockListener = StateTestHelper.createMockListener<string>();
      expect(mockListener).toBeInstanceOf(Function);
      
      mockListener('test');
      expect(mockListener).toHaveBeenCalledWith('test');
    });

    test('should create test states with listeners', () => {
      const { state, mockListener } = StateTestHelper.createTestState('initial');
      
      expect(state.value).toBe('initial');
      expect(mockListener).toHaveBeenCalledWith('initial');
    });

    test('should wait for state changes', async () => {
      const state = new State('initial');
      
      // Change the state after a short delay
      setTimeout(() => {
        state.value = 'changed';
      }, 10);

      await StateTestHelper.waitForStateChange(state, 'changed', 100);
      expect(state.value).toBe('changed');
    });

    test('should timeout if state does not change', async () => {
      const state = new State('initial');
      
      await expect(
        StateTestHelper.waitForStateChange(state, 'never', 50)
      ).rejects.toThrow('State did not change to never within 50ms');
    });

    test('should verify listener calls in order', () => {
      const { state, mockListener } = StateTestHelper.createTestState('initial');
      
      state.value = 'first';
      state.value = 'second';
      
      StateTestHelper.expectListenerCalls(mockListener, ['initial', 'first', 'second']);
    });
  });
});