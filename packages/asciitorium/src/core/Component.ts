import { Alignment } from './types';
import type { State } from './State';
import {
  LayoutRegistry,
  LayoutType,
  LayoutOptions,
} from './layouts/Layout';

export interface ComponentProps {
  label?: string;
  comment?: string; // Comment to describe the component's purpose.  This isn't used for anything yet.
  showLabel?: boolean; // Whether to show the label or not
  width?: number; // Width of the component
  height?: number; // Height of the component
  border?: boolean; // Whether to show a border around the component
  fill?: string; // Fill character for the component
  align?: Alignment; // Alignment of the component
  bind?: State<any> | ((state: State<any>) => void);
  fixed?: boolean;
  x?: number;
  y?: number;
  z?: number;
  gap?: number; // Space after this component in layout
  children?: Component[]; // Child components
  layout?: LayoutType; // Layout to use for children
  layoutOptions?: LayoutOptions; // Configuration for the layout
}

export abstract class Component {
  public label: string | undefined;
  public comment: string | undefined;
  public showLabel: boolean = true;
  public width: number;
  public height: number;
  public border: boolean;
  public fill: string;
  public align?: Alignment;
  public fixed: boolean = false;
  public x = 0;
  public y = 0;
  public z = 0;
  public gap: number = 0;

  public focusable: boolean = false;
  public hasFocus: boolean = false;
  public transparentChar = '‽'; // ‽ = transparent character

  protected buffer: string[][];
  private unbindFns: (() => void)[] = [];
  public parent?: Component;

  // Children support
  protected children: Component[] = [];
  protected layoutType: LayoutType;
  protected layoutOptions?: LayoutOptions;
  private layout?: any;

  constructor(props: ComponentProps) {
    // Default dimensions if not provided
    this.width = props.width ?? 1;
    this.height = props.height ?? 1;

    if (this.width < 1) throw new Error('Component width must be > 0');
    if (this.height < 1) throw new Error('Component height must be > 0');
    this.label = props.label;
    this.comment = props.comment;
    this.showLabel = props.showLabel ?? true;
    this.border = props.border ?? false;
    this.fill = props.fill ?? ' ';
    this.align = props.align;
    this.fixed = props.fixed ?? false;
    this.x = props.x ?? 0;
    this.y = props.y ?? 0;
    this.z = props.z ?? 0;
    this.gap = props.gap ?? 0;
    this.buffer = [];

    // Setup children and layout
    this.layoutType = props.layout ?? 'horizontal'; // Default to horizontal layout
    this.layoutOptions = props.layoutOptions;

    // Store children for later addition (to avoid calling addChild during construction)
    if (props.children) {
      const childList = Array.isArray(props.children)
        ? props.children
        : [props.children];
      for (const child of childList) {
        child.setParent(this);
        this.children.push(child);
      }
      this.recalculateLayout();
    }
  }

  setParent(parent: Component) {
    this.parent = parent;
  }

  // Child management methods
  public addChild(child: Component): void {
    child.setParent(this);
    this.children.push(child);
    this.recalculateLayout();
  }

  public removeChild(child: Component): void {
    const index = this.children.indexOf(child);
    if (index !== -1) {
      this.children.splice(index, 1);
      this.recalculateLayout();
    }
  }

  public getChildren(): Component[] {
    return this.children;
  }

  public getAllDescendants(): Component[] {
    const result: Component[] = [];

    for (const child of this.children) {
      result.push(child);
      const grandChildren = child.getAllDescendants();
      result.push(...grandChildren);
    }

    return result;
  }

  protected invalidateLayout(): void {
    this.layout = undefined;
  }

  protected recalculateLayout(): void {
    if (this.children.length === 0) return;

    if (!this.layout) {
      this.layout = LayoutRegistry.create(
        this.layoutType,
        this.layoutOptions
      );
    }
    this.layout.layout(this, this.children);
  }

  bind<T>(state: State<T>, apply: (val: T) => void): void {
    const listener = (val: T) => {
      apply(val);
    };

    state.subscribe(listener);
    this.unbindFns.push(() => state.unsubscribe(listener));
  }

  destroy(): void {
    for (const unbind of this.unbindFns) unbind();
    this.unbindFns = [];
  }

  handleEvent(event: string): boolean {
    return false;
  }

  draw(): string[][] {
    // Recalculate layout for children
    this.recalculateLayout();

    // Create buffer and fill only if not transparent
    this.buffer = Array.from({ length: this.height }, () =>
      Array.from({ length: this.width }, () =>
        this.fill === this.transparentChar ? '‽' : this.fill
      )
    );

    const drawChar = (x: number, y: number, char: string) => {
      if (x >= 0 && x < this.width && y >= 0 && y < this.height) {
        this.buffer[y][x] = char;
      }
    };

    if (this.border) {
      const w = this.width;
      const h = this.height;

      drawChar(0, 0, '╭');
      drawChar(w - 1, 0, '╮');
      drawChar(0, h - 1, '╰');
      drawChar(w - 1, h - 1, '╯');

      for (let x = 1; x < w - 1; x++) {
        drawChar(x, 0, '─');
        drawChar(x, h - 1, '─');
      }
      for (let y = 1; y < h - 1; y++) {
        drawChar(0, y, '│');
        drawChar(w - 1, y, '│');
      }

      if (this.hasFocus) {
          drawChar(0, 1, '◆');
      }

    }

    if (this.label && this.showLabel) {
      const label = ` ${this.label} `;
      const start = 1;
      for (let i = 0; i < label.length && i + start < this.width - 1; i++) {
        drawChar(i + start, 0, label[i]);
      }
    }

    // Render children sorted by z-index
    const sorted = [...this.children].sort((a, b) => a.z - b.z);
    for (const child of sorted) {
      const buf = child.draw();
      for (let j = 0; j < buf.length; j++) {
        for (let i = 0; i < buf[j].length; i++) {
          const px = child.x + i;
          const py = child.y + j;
          if (px >= 0 && px < this.width && py >= 0 && py < this.height) {
            const char = buf[j][i];
            if (char !== child.transparentChar) {
              this.buffer[py][px] = char;
            }
          }
        }
      }
    }

    return this.buffer;
  }
}
