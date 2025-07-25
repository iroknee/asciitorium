export abstract class Component {
  abstract width: number;
  abstract height: number;

  focusable: boolean = false;
  hasFocus: boolean = false;

  abstract draw(): string[][];

  handleEvent(event: string): boolean {
    return false;
  }
}
