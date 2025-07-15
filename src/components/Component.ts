export abstract class Component {
  abstract readonly width: number;
  abstract readonly height: number;
  abstract draw(): string;
}