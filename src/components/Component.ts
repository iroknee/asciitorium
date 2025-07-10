import { Cell } from './Cell';
import figlet from 'figlet';

figlet.defaults({ fontPath: 'figlet/fonts' });

const fonts: figlet.Fonts[] = [
  'Bloody', 'Crawford2', 'Elite', 'Graceful',
  'Pagga', 'Slant', 'Small', 'Soft', 'Standard', 'Star Wars'
];

figlet.preloadFonts(fonts, () => {
  console.log(`Figlet fonts loaded: ${fonts.length}`);
});

/**
 * Configuration for highlighting a specific range of characters.
 */
interface HighlightConfig {
  /** The starting position of the highlight. */
  x: number;
  /** The length of the highlight. */
  length: number;
}

/**
 * Configuration for highlighting a specific row in a block.
 */
interface BlockHighlightConfig {
  /** The row index to highlight. */
  y: number;
  /** The length of the highlight. */
  length: number;
}

/**
 * Represents a 2D position or alignment keyword.
 */
type XY = number | 'left' | 'center' | 'right' | 'top' | 'bottom';

/**
 * Properties used to construct a Component.
 */
interface ComponentProps {
  /** Optional unique identifier for the component. */
  id?: string;
  /** The width of the component. */
  width: number;
  /** The height of the component. */
  height: number;
  /** The fill character for the component. */
  fill?: string;
  /** Whether the component has a border. */
  border?: boolean;
  /** The z-index of the component for layering. */
  zIndex?: number;
  /** The color of the component. */
  color?: string;
}

/**
 * Represents a child component within a parent component.
 */
interface ComponentChild {
  /** The x-coordinate of the child component. */
  x: number;
  /** The y-coordinate of the child component. */
  y: number;
  /** The child component instance. */
  component: Component;
}

/**
 * Represents a rectangular ASCII UI component.
 */
export class Component {
  /** Unique identifier for the component. */
  id: string;
  /** The width of the component. */
  width: number;
  /** The height of the component. */
  height: number;
  /** The fill character for the component. */
  fill: string;
  /** Whether the component has a border. */
  border: boolean;
  /** The z-index of the component for layering. */
  zIndex: number;
  /** The edge padding for the component. */
  edge: number = 0;
  /** The 2D grid of cells representing the component. */
  canvas: Cell[][] = [];
  /** The child components of this component. */
  children: ComponentChild[] = [];
  /** The parent component, if any. */
  parent: Component | null = null;
  /** Whether the component has been updated. */
  updated: boolean = true;
  color: string | null = null;

  /**
   * Creates a new Component instance.
   * @param props - Configuration for the component.
   * @throws Will throw an error if required props are invalid.
   */
  constructor(props: ComponentProps) {
    if (!props || typeof props !== 'object') {
      throw new Error('Invalid props provided');
    }
    const { id, width, height, fill, border, zIndex, color } = props;
    if (width <= 0 || height <= 0) {
      throw new Error('Width and height must be positive numbers');
    }
    this.id = id || Math.random().toString(36).substring(7);
    this.width = width;
    this.height = height;
    this.fill = fill || ' ';
    this.border = border || false;
    this.zIndex = zIndex || 0;
    this.color = color || null;

    this._init();
    if (this.border) this._border();
  }

  /**
   * Adds a child component to the specified position within this component.
   * @private
   * @param props - Configuration for the child component to add.
   */
  private _addComponent(props: { x: XY; y: XY; component: Component }): void {
    let { x, y, component } = props;

    if (!(component instanceof Component)) throw new Error('Invalid component provided');

    if (x === 'center') x = Math.floor((this.width - component.width) / 2);
    else if (x === 'right') x = this.width - component.width - 1;
    else if (x === 'left') x = 2;

    if (y === 'center') y = Math.floor((this.height - component.height) / 2);
    else if (y === 'bottom') y = this.height - component.height - 2;
    else if (y === 'top') y = 2;

    this.children.push({ x: x as number, y: y as number, component });
    this.children.sort((a, b) => a.component.zIndex - b.component.zIndex);
    component.parent = this;
  }

  /**
   * Adds a new element to the component.
   * @param props - Configuration for the element to add.
   * @throws Will throw an error if props are invalid.
   */
  add(props: any): void {
    if (!props || typeof props !== 'object') {
      throw new Error('Invalid props provided');
    }
    if (props.component) this._addComponent(props);
    else if (props.fig) this._addFig(props);
    else if (props.block) this._addBlock(props);
    else if (props.string) this._addString(props);
    else if (props.cell) this._addCell(props);
    else throw new Error('add requires a component, fig, block, string, or cell');
    this.updated = true;
  }

  /**
   * Removes a child component by its ID.
   * @param id - The ID of the child component to remove.
   */
  removeComponent(id: string): void {
    const index = this.children.findIndex((g) => g.component.id === id);
    if (index !== -1) {
      this.children.splice(index, 1);
      this.updated = true;
    }
  }

  /**
   * Retrieves a child component by its ID.
   * @param id - The ID of the child component to retrieve.
   * @returns The child component, or null if not found.
   */
  getComponent(id: string): Component | null {
    const found = this.children.find((g) => g.component.id === id);
    return found?.component ?? null;
  }

  /**
   * Clears the component, removing all children and resetting the canvas.
   */
  clear(): void {
    this.children = [];
    for (let y = 0; y < this.height; y++) {
      for (let x = 0; x < this.width; x++) {
        this._addCell({ x, y, cell: new Cell({ value: this.fill }) });
      }
    }
    this.updated = true;
  }

  /**
   * Initializes the component's canvas with empty cells.
   * @private
   */
  private _init(): void {
    for (let y = 0; y < this.height; y++) {
      const row: Cell[] = [];
      for (let x = 0; x < this.width; x++) {
        row.push(new Cell({ value: this.fill }));
      }
      this.canvas.push(row);
    }
  }

  /**
   * Adds a border to the component.
   * @private
   */
  private _border(): void {
    const add = (x: number, y: number, v: string) =>
      this._addCell({ x, y, cell: new Cell({ value: v }) });

    add(0, 0, '╭');
    add(this.width - 1, 0, '╮');
    add(0, this.height - 1, '╰');
    add(this.width - 1, this.height - 1, '╯');

    for (let x = 1; x < this.width - 1; x++) {
      add(x, 0, '─');
      add(x, this.height - 1, '─');
    }
    for (let y = 1; y < this.height - 1; y++) {
      add(0, y, '│');
      add(this.width - 1, y, '│');
    }

    this.edge = 1;
  }

  /**
   * Adds a cell to the component at the specified coordinates.
   * @private
   * @param props - Configuration for the cell to add.
   * @throws Will throw an error if the cell is invalid.
   */
  private _addCell(props: { x: number; y: number; cell: Cell; force?: boolean }): void {
    const { x, y, cell, force } = props;
    if (!(cell instanceof Cell)) throw new Error('Invalid cell provided');
    if (!force && (x < this.edge || x >= this.width - this.edge || y < this.edge || y >= this.height - this.edge)) return;
    if (x < 0 || x >= this.width || y < 0 || y >= this.height) return;
    this.canvas[y][x] = cell;
  }

  /**
   * Adds a string of characters to the component at the specified position.
   * @private
   * @param props - Configuration for the string to add.
   */
  private _addString(props: {
    x: XY;
    y: XY;
    string: string;
    color?: string;
    highlight?: boolean | HighlightConfig;
    force?: boolean;
    backfill?: boolean;
  }): void {
    let { x, y, string, color, highlight, force, backfill } = props;

    if (backfill) {
      for (let i = 0; i < this.width; i++) {
        this._addCell({ x: i, y: y as number, cell: new Cell({ value: this.fill }) });
      }
    }

    if (x === 'left') x = 2;
    else if (x === 'center') x = Math.floor((this.width - string.length) / 2);
    else if (x === 'right') x = this.width - (string.length + 2);

    if (y === 'top') y = 1;
    else if (y === 'center') y = Math.floor((this.height - 1) / 2);
    else if (y === 'bottom') y = this.height - 2;

    const tokens = [...string];
    for (let i = 0; i < tokens.length; i++) {
      let style = '';
      if (highlight === true || (typeof highlight === 'object' && i >= highlight.x && i < highlight.x + highlight.length)) {
        style = `color: #000000; background-color: ${color || '#2cd03a'};`;
      } else if (color) {
        style = `color: ${color};`;
      }

      this._addCell({
        x: (x as number) + i,
        y: y as number,
        force,
        cell: new Cell({ value: tokens[i], style })
      });
    }
  }

  /**
   * Adds a block of text to the component at the specified position.
   * @private
   * @param props - Configuration for the block to add.
   */
  private _addBlock(props: {
    x: number;
    y: XY;
    block: string[];
    color?: string;
    highlight?: boolean | BlockHighlightConfig;
    force?: boolean;
    backfill?: boolean;
  }): void {
    let { x, y, block, color, highlight, force, backfill } = props;

    if (!Array.isArray(block)) throw new Error('Invalid block provided');

    if (y === 'center') y = Math.floor((this.height - block.length) / 2) - Math.floor(block.length / 2);
    else if (y === 'bottom') y = this.height - block.length - 2;
    else if (y === 'top') y = 2;

    if (backfill) {
      for (let i = 0; i < this.height; i++) {
        this._addString({ x: 0, y: i, string: '', force, backfill });
      }
    }

    for (let i = 0; i < block.length; i++) {
      let lineHighlight = false;
      if (highlight === true) lineHighlight = true;
      else if (typeof highlight === 'object' && i === highlight.y) lineHighlight = true;

      this._addString({
        x,
        y: (y as number) + i,
        string: block[i],
        color,
        highlight: lineHighlight,
        force
      });
    }
  }

  /**
   * Adds a figlet graphic to the component.
   * @private
   * @param props - Configuration for the figlet graphic to add.
   */
  private _addFig(props: { fig: any }): void {
    const { fig } = props;
    const { text, font, horizontalLayout, verticalLayout, width } = fig;

    const block = figlet.textSync(text, {
      font: font || 'Crawford2',
      horizontalLayout: horizontalLayout || 'default',
      verticalLayout: verticalLayout || 'default',
      width: width || undefined,
      whitespaceBreak: true
    }).split('\n');

    this._addBlock({
      x: 0,
      y: 0,
      block,
      color: undefined,
      highlight: undefined,
      force: undefined,
      backfill: undefined
    });
  }

  /**
   * Flattens the component and its children into the parent's coordinate system.
   * @private
   */
  private _flatten(): void {
    if (this.children.length === 0) return;

    this.children.sort((a, b) => a.component.zIndex - b.component.zIndex);

    for (const child of this.children) {
      child.component._flatten();
      const { x: offsetX, y: offsetY, component } = child;
      for (let y = 0; y < component.height; y++) {
        const targetY = y + offsetY;
        if (targetY < 0 || targetY >= this.height) continue;
        for (let x = 0; x < component.width; x++) {
          const targetX = x + offsetX;
          if (targetX < 0 || targetX >= this.width) continue;
          const cell = component.canvas[y][x];
          if (cell.draw() !== null) {
            this.canvas[targetY][targetX] = cell;
          }
        }
      }
    }
  }

  /**
   * Renders the component as a string.
   * @returns The rendered ASCII representation of the component.
   */
  draw(): string {
    this._flatten();
    return this.canvas.map(row =>
      row.map(cell => cell.draw() || ' ').join('')
    ).join('\n');
  }
}