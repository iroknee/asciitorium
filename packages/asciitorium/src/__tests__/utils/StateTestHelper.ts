import { State } from '../../core/State';
import { vi } from 'vitest';

/**
 * Helper utilities for testing State<T> objects and reactive behavior
 */
export class StateTestHelper {
  /**
   * Create a mock listener function that can be used to test state subscriptions
   */
  static createMockListener<T>() {
    return vi.fn<[T], void>();
  }

  /**
   * Wait for a state to change to a specific value
   */
  static async waitForStateChange<T>(
    state: State<T>,
    expectedValue: T,
    timeout = 1000
  ): Promise<void> {
    return new Promise((resolve, reject) => {
      const timeoutId = setTimeout(() => {
        reject(new Error(`State did not change to ${expectedValue} within ${timeout}ms`));
      }, timeout);

      if (state.value === expectedValue) {
        clearTimeout(timeoutId);
        resolve();
        return;
      }

      const listener = (value: T) => {
        if (value === expectedValue) {
          state.unsubscribe(listener);
          clearTimeout(timeoutId);
          resolve();
        }
      };

      state.subscribe(listener);
    });
  }

  /**
   * Test that a state properly notifies subscribers when changed
   */
  static testStateSubscription<T>(state: State<T>, newValue: T): {
    mockListener: ReturnType<typeof vi.fn>;
    triggerChange: () => void;
  } {
    const mockListener = this.createMockListener<T>();
    state.subscribe(mockListener);

    const triggerChange = () => {
      state.value = newValue;
    };

    return { mockListener, triggerChange };
  }

  /**
   * Create a state and return both the state and a mock listener for testing
   */
  static createTestState<T>(initialValue: T): {
    state: State<T>;
    mockListener: ReturnType<typeof vi.fn>;
  } {
    const state = new State(initialValue);
    const mockListener = this.createMockListener<T>();
    state.subscribe(mockListener);
    
    return { state, mockListener };
  }

  /**
   * Verify that a listener was called with specific values in order
   */
  static expectListenerCalls<T>(
    mockListener: ReturnType<typeof vi.fn>,
    expectedCalls: T[]
  ): void {
    expect(mockListener).toHaveBeenCalledTimes(expectedCalls.length);
    expectedCalls.forEach((expectedValue, index) => {
      expect(mockListener).toHaveBeenNthCalledWith(index + 1, expectedValue);
    });
  }
}