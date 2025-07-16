export abstract class Component {
  abstract readonly width: number;
  abstract readonly height: number;
  focusable?: boolean = false;
  hasFocus?: boolean = false;
  abstract draw(): string;
  handleEvent(event: string): boolean {
    return false;
  }
}