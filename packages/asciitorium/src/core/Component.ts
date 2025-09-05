import { Alignment, SizeValue, SizeContext } from './types';
import type { State } from './State';
import { LayoutRegistry, LayoutType, LayoutOptions } from './layouts/Layout';
import { resolveGap } from './utils/gapUtils';
import { resolveSize, createSizeContext } from './utils/sizeUtils';

export interface ComponentProps {
  label?: string;
  comment?: string; // Comment to describe the component's purpose.  This isn't used for anything yet.
  showLabel?: boolean; // Whether to show the label or not
  width?: SizeValue; // Width of the component
  height?: SizeValue; // Height of the component
  border?: boolean; // Whether to show a border around the component
  fill?: string; // Fill character for the component
  align?: Alignment; // Alignment of the component
  bind?: State<any> | ((state: State<any>) => void);
  fixed?: boolean;
  x?: number;
  y?: number;
  z?: number;
  gap?:
    | number
    | {
        top?: number;
        bottom?: number;
        left?: number;
        right?: number;
        x?: number; // shorthand for left + right
        y?: number; // shorthand for top + bottom
      }
    | number[]; // CSS-style shorthand
  children?: Component[]; // Child components
  layout?: LayoutType; // Layout to use for children
  layoutOptions?: LayoutOptions; // Configuration for the layout

  // 🔧 Dynamic content switching support (now accepts instance | class | factory)
  dynamicContent?: {
    selectedKey: State<string>;
    componentMap: Record<
      string,
      Component | (() => Component) | (new (...args: any[]) => Component)
    >;
    fallback?:
      | Component
      | (() => Component)
      | (new (...args: any[]) => Component);
  };
}

// -- Helpers for dynamic content ---------------------------------------------

function isComponentCtor(v: any): v is new (...args: any[]) => Component {
  return (
    typeof v === 'function' && v.prototype && v.prototype instanceof Component
  );
}

function makeComponent(entry: any): Component {
  // Allow: pre-built instance
  if (entry instanceof Component) return entry;

  // Allow: class constructor
  if (isComponentCtor(entry)) return new entry({});

  // Allow: factory function
  if (typeof entry === 'function') {
    const out = entry();
    if (out instanceof Component) return out;
  }

  throw new Error(
    'dynamicContent entries must be a Component instance, a Component class, or a factory that returns a Component.'
  );
}

// ---------------------------------------------------------------------------

export abstract class Component {
  public label: string | undefined;
  public comment: string | undefined;
  public showLabel: boolean = true;
  public width: number;
  public height: number;

  // Store original size values for relative sizing
  private originalWidth?: SizeValue;
  private originalHeight?: SizeValue;
  public border: boolean;
  public fill: string;
  public align?: Alignment;
  public fixed: boolean = false;
  public x = 0;
  public y = 0;
  public z = 0;
  public gap:
    | number
    | {
        top?: number;
        bottom?: number;
        left?: number;
        right?: number;
        x?: number;
        y?: number;
      }
    | number[] = 0;

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
    // Store original size values for relative sizing - default to undefined for auto-sizing
    this.originalWidth = props.width;
    this.originalHeight = props.height;

    // Initialize with explicit values or temporary defaults (will be recalculated after layout)
    if (typeof props.width === 'number') {
      this.width = props.width;
    } else {
      // Temporary size - will be recalculated after children are added
      this.width = 1;
    }

    if (typeof props.height === 'number') {
      this.height = props.height;
    } else {
      // Temporary size - will be recalculated after children are added
      this.height = 1;
    }
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
    this.layoutType = props.layout ?? 'column'; // Default to column layout (matches Box behavior)
    this.layoutOptions = props.layoutOptions;

    // Store children for later addition (to avoid calling addChild during construction)
    if (props.children) {
      const childList = Array.isArray(props.children)
        ? props.children
        : [props.children];
      for (const child of childList) {
        // Only call setParent on Component instances, not strings or other values
        if (
          child &&
          typeof child === 'object' &&
          typeof (child as any).setParent === 'function'
        ) {
          child.setParent(this);
          this.children.push(child);
        }
      }
      this.recalculateLayout();
    }

    // Setup dynamic content if provided
    if (props.dynamicContent) {
      this.setupDynamicContent(props.dynamicContent);
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
      this.layout = LayoutRegistry.create(this.layoutType, this.layoutOptions);
    }
    this.layout.layout(this, this.children);
    
    // After layout, recalculate auto-sizing if needed
    this.recalculateAutoSize();
  }

  protected recalculateAutoSize(): void {
    let sizeChanged = false;
    
    // Recalculate width if it should be auto-sized
    if (this.originalWidth === undefined && this.children.length > 0) {
      const autoWidth = Component.calculateAutoWidth(this.children, this.layoutType);
      const borderAdjustment = this.border ? 2 : 0;
      const newWidth = Math.max(1, autoWidth + borderAdjustment);
      if (newWidth !== this.width) {
        this.width = newWidth;
        sizeChanged = true;
      }
    }
    
    // Recalculate height if it should be auto-sized
    if (this.originalHeight === undefined && this.children.length > 0) {
      const autoHeight = Component.calculateAutoHeight(this.children, this.layoutType);
      const borderAdjustment = this.border ? 2 : 0;
      const newHeight = Math.max(1, autoHeight + borderAdjustment);
      if (newHeight !== this.height) {
        this.height = newHeight;
        sizeChanged = true;
      }
    }
    
    // If our size changed, we need to notify parent to recalculate its layout
    if (sizeChanged && this.parent) {
      this.parent.recalculateLayout();
    }
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

  // Auto-sizing methods (moved from Box)
  private static calculateAutoWidth(
    children?: Component[],
    layout?: LayoutType
  ): number {
    if (!children || children.length === 0) return 1;

    if (layout === 'row') {
      // Sum widths + gaps for row layout
      return children.reduce((sum, child) => {
        const gap = resolveGap(child.gap);
        return sum + child.width + gap.left + gap.right;
      }, 0);
    } else {
      // Max width for column layout (including horizontal gaps)
      return Math.max(
        ...children.map((child) => {
          const gap = resolveGap(child.gap);
          return child.width + gap.left + gap.right;
        })
      );
    }
  }

  private static calculateAutoHeight(
    children?: Component[],
    layout?: LayoutType
  ): number {
    if (!children || children.length === 0) return 1;

    if (layout === 'column') {
      // Sum heights + gaps for column layout
      return children.reduce((sum, child) => {
        const gap = resolveGap(child.gap);
        return sum + child.height + gap.top + gap.bottom;
      }, 0);
    } else {
      // Max height for row layout (including vertical gaps)
      return Math.max(
        ...children.map((child) => {
          const gap = resolveGap(child.gap);
          return child.height + gap.top + gap.bottom;
        })
      );
    }
  }

  // Dynamic content support
  private setupDynamicContent(dynamicContent: {
    selectedKey: State<string>;
    componentMap: Record<
      string,
      Component | (() => Component) | (new (...args: any[]) => Component)
    >;
    fallback?:
      | Component
      | (() => Component)
      | (new (...args: any[]) => Component);
  }): void {
    const updateContent = () => {
      // Clear existing children
      const childrenToRemove = [...this.children];
      for (const child of childrenToRemove) {
        child.destroy();
        this.removeChild(child);
      }

      // Get the current entry (instance | class | factory)
      const key = dynamicContent.selectedKey.value;
      const entry = dynamicContent.componentMap[key];

      if (entry) {
        const component = makeComponent(entry);
        this.addChild(component);
      } else if (dynamicContent.fallback) {
        const fallbackComponent = makeComponent(dynamicContent.fallback);
        this.addChild(fallbackComponent);
      }

      // Notify app of focus changes
      this.notifyAppOfFocusChange();
    };

    // Initially set the current content
    updateContent();

    // Subscribe to changes in selectedKey
    const listener = () => updateContent();
    dynamicContent.selectedKey.subscribe(listener);
    this.unbindFns.push(() => dynamicContent.selectedKey.unsubscribe(listener));
  }

  private notifyAppOfFocusChange(): void {
    // Walk up the parent chain to find the App
    let current: Component | undefined = this;
    while (current && !(current as any).isApp) {
      current = current.parent;
    }

    // If we found the App, reset its focus manager
    if (current && (current as any).focus) {
      (current as any).focus.reset(current);
    }
  }

  // Size resolution methods
  public getOriginalWidth(): SizeValue | undefined {
    return this.originalWidth;
  }

  public getOriginalHeight(): SizeValue | undefined {
    return this.originalHeight;
  }

  public resolveSize(context: SizeContext): void {

    if (this.originalWidth !== undefined) {
      const resolved = resolveSize(this.originalWidth, context, 'width');
      if (resolved !== undefined) {
        this.width = resolved;
      }
    }

    if (this.originalHeight !== undefined) {
      const resolved = resolveSize(this.originalHeight, context, 'height');
      if (resolved !== undefined) {
        this.height = resolved;
      }
    }

    // Ensure minimum size
    if (this.width < 1) this.width = 1;
    if (this.height < 1) this.height = 1;
  }

  handleEvent(_event: string): boolean {
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
