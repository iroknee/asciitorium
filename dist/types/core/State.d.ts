type Listener<T> = (value: T) => void;
export declare class State<T> {
    private listeners;
    private _value;
    constructor(initialValue: T);
    get value(): T;
    set value(newValue: T);
    subscribe(fn: Listener<T>): void;
    unsubscribe(fn: Listener<T>): void;
}
export {};
