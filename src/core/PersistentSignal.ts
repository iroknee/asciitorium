import { State } from './State';

export class PersistentSignal<T> extends State<T> {
  constructor(key: string, defaultValue: T) {
    const stored = localStorage.getItem(key);
    const parsed = stored ? (JSON.parse(stored) as T) : defaultValue;
    super(parsed);

    this.subscribe((val) => {
      localStorage.setItem(key, JSON.stringify(val));
    });
  }
}
