/**
 * Properties used to construct a Cell.
 */
export interface CellProps {
  /**
   * The character or string to display in the cell.
   */
  value: string;

  /**
   * Optional pre-determined style for the cell.
   */
  style?: string;
}

/**
 * Represents a single character cell in the ASCII UI grid.
 */
export class Cell {
  /**
   * The character or string value of the cell.
   */
  value: string;

  /**
   * The pre-determined style for the cell.
   */
  style: string;

  /**
   * Creates a new Cell instance.
   * @param props - Configuration for the cell appearance and value.
   * @throws Will throw an error if required props are invalid.
   */
  constructor(props: CellProps) {
    if (!props || typeof props !== 'object') {
      throw new Error('Invalid props provided');
    }

    const { value, style } = props;

    if (typeof value !== 'string') {
      throw new Error('Invalid value provided');
    }

    this.value = value;
    this.style = style || '';
  }

  /**
   * Renders the cell as an HTML string if necessary.
   * @returns The styled or raw string value, or null if the value is '@'.
   */
  draw(): string | null {
    if (this.value === '@') return null;
    return this.style ? `<span style="${this.style}">${this.value}</span>` : this.value;
  }
}