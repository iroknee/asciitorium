import { State } from './State';
import { isWebEnvironment } from './environment';

export class PersistentState<T> extends State<T> {
  private storageKey: string;

  constructor(initialValue: T, storageKey: string) {
    // Try to load from localStorage first, fall back to initialValue
    const storedValue = PersistentState.loadFromStorage<T>(storageKey, initialValue);
    super(storedValue);
    
    this.storageKey = storageKey;
  }

  get value(): T {
    const currentValue = super.value;
    return currentValue;
  }

  set value(newValue: T) {
    // Call parent setter which triggers listeners
    super.value = newValue;
    
    // Save to localStorage if in web environment
    this.saveToStorage(newValue);
  }

  private saveToStorage(value: T): void {
    if (isWebEnvironment()) {
      try {
        const key = `asciitorium-${this.storageKey}`;
        localStorage.setItem(key, JSON.stringify(value));
      } catch (error) {
        // Silently fail if localStorage is not available
        console.warn('Failed to save state to localStorage:', error);
      }
    }
  }

  private static loadFromStorage<T>(storageKey: string, fallback: T): T {
    if (isWebEnvironment()) {
      try {
        const key = `asciitorium-${storageKey}`;
        const stored = localStorage.getItem(key);
        if (stored !== null) {
          return JSON.parse(stored) as T;
        }
      } catch (error) {
        // Silently fail if localStorage is not available or data is corrupted
        console.warn('Failed to load state from localStorage:', error);
      }
    }
    return fallback;
  }

  // Optional method to clear stored state
  clearStorage(): void {
    if (isWebEnvironment()) {
      try {
        const key = `asciitorium-${this.storageKey}`;
        localStorage.removeItem(key);
      } catch (error) {
        console.warn('Failed to clear state from localStorage:', error);
      }
    }
  }
}