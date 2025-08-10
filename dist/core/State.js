export class State {
    constructor(initialValue) {
        this.listeners = [];
        this._value = initialValue;
    }
    get value() {
        return this._value;
    }
    set value(newValue) {
        if (this._value !== newValue) {
            this._value = newValue;
            this.listeners.forEach((listener) => listener(newValue));
        }
    }
    subscribe(fn) {
        this.listeners.push(fn);
        // Immediately notify on subscribe (optional)
        fn(this._value);
    }
    unsubscribe(fn) {
        this.listeners = this.listeners.filter((l) => l !== fn);
    }
}
