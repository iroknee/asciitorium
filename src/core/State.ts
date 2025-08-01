type Listener<T> = (value: T) => void;

export class State<T> {
  private listeners: Listener<T>[] = [];
  private _value: T;

  constructor(initialValue: T) {
    this._value = initialValue;
  }

  get value(): T {
    return this._value;
  }

  set value(newValue: T) {
    if (this._value !== newValue) {
      console.log(`State changed from`, this._value, 'to', newValue);
      this._value = newValue;
      this.listeners.forEach((listener) => listener(newValue));
    }
  }

  subscribe(fn: Listener<T>) {
    this.listeners.push(fn);
    // Immediately notify on subscribe (optional)
    fn(this._value);
  }

  unsubscribe(fn: Listener<T>) {
    this.listeners = this.listeners.filter((l) => l !== fn);
  }
}
