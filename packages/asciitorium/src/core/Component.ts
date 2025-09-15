import { Alignment, SizeValue, SizeContext, ComponentStyle, GapValue } from './types';
import type { State } from './State';
import { LayoutRegistry, LayoutType, LayoutOptions } from './layouts/Layout';
import { resolveGap } from './utils/gapUtils';
import { resolveSize } from './utils/sizeUtils';

// Border character sets for focused and normal states
const SINGLE_BORDER_CHARS = {
  topLeft: '╭', topRight: '╮', bottomLeft: '╰', bottomRight: '╯',
  horizontal: '─', vertical: '│'
};

const DOUBLE_BORDER_CHARS = {
  topLeft: '╔', topRight: '╗', bottomLeft: '╚', bottomRight: '╝',
  horizontal: '═', vertical: '║'
};

/**
 * Configuration interface for Component initialization.
 * Supports both individual style properties and consolidated style objects.
 */
export interface ComponentProps {
  /** Optional label displayed at the top of the component */
  label?: string;

  /** Optional comment for documentation purposes (not displayed) */
  comment?: string;

  /** Whether to display the label when provided */
  showLabel?: boolean;

  // Style properties (individual props take precedence over style object)
  /** Consolidated style properties object */
  style?: ComponentStyle;

  /** Component width (number, percentage string, or 'auto') */
  width?: SizeValue;

  /** Component height (number, percentage string, or 'auto') */
  height?: SizeValue;

  /** Whether to render a border around the component */
  border?: boolean;

  /** Character used to fill the component background */
  fill?: string;

  /** Text/content alignment within the component */
  align?: Alignment;

  /** Absolute X position */
  x?: number;

  /** Absolute Y position */
  y?: number;

  /** Z-index for layering (higher values render on top) */
  z?: number;

  /** Spacing around the component */
  gap?: GapValue;

  /** State binding for reactive updates (deprecated) */
  bind?: State<any> | ((state: State<any>) => void);

  /** Whether the component has fixed positioning */
  fixed?: boolean;

  /** Child components to be managed by this component */
  children?: Component[];

  /** Layout algorithm to use for positioning children */
  layout?: LayoutType;

  /** Configuration options for the selected layout */
  layoutOptions?: LayoutOptions;

  /**
   * Dynamic content switching system that allows runtime swapping of child components
   * based on a reactive state key. Supports component instances, classes, or factory functions.
   */
  dynamicContent?: {
    /** State that determines which component to display */
    selectedKey: State<string>;
    /** Map of keys to components (instances, classes, or factories) */
    componentMap: Record<
      string,
      Component | (() => Component) | (new (...args: any[]) => Component)
    >;
    /** Fallback component when selectedKey doesn't match any map entry */
    fallback?:
      | Component
      | (() => Component)
      | (new (...args: any[]) => Component);
  };
}


/**
 * Merges individual style properties with a style object.
 * Individual properties take precedence over style object properties.
 *
 * @param props Component properties containing individual and/or consolidated styles
 * @returns Merged style configuration
 */
function mergeStyles(props: ComponentProps): ComponentStyle {
  const style = props.style || {};

  return {
    width: props.width ?? style.width,
    height: props.height ?? style.height,
    border: props.border ?? style.border,
    fill: props.fill ?? style.fill,
    align: props.align ?? style.align,
    x: props.x ?? style.x,
    y: props.y ?? style.y,
    z: props.z ?? style.z,
    gap: props.gap ?? style.gap,
    font: style.font,
  };
}

// ============================================================================
// Component Base Class
// ============================================================================

/**
 * Abstract base class for all UI components in the asciitorium framework.
 *
 * Provides core functionality including:
 * - Position and size management with support for absolute and relative sizing
 * - Child component management with automatic layout calculation
 * - Focus handling with visual indicators (single/double-line borders)
 * - State binding and reactive updates
 * - ASCII-based rendering with transparency support
 * - Dynamic content switching for runtime component replacement
 *
 * Components use a character-based rendering system where each component
 * renders to a 2D string array buffer. The transparent character '‽' allows
 * for overlay effects and complex compositions.
 *
 * Focus-enabled components automatically switch between single-line borders
 * (╭╮╰╯─│) and double-line borders (╔╗╚╝═║) when focused.
 */
export abstract class Component {
  // ========================================================================
  // Public Properties
  // ========================================================================

  /** Optional label displayed at the top of the component */
  public label: string | undefined;

  /** Optional comment for documentation (not rendered) */
  public comment: string | undefined;

  /** Whether to display the label when provided */
  public showLabel: boolean = true;

  /** Current rendered width in characters */
  public width: number;

  /** Current rendered height in characters */
  public height: number;

  /** Whether to render a border around the component */
  public border: boolean;

  /** Character used to fill the component background */
  public fill: string;

  /** Content alignment within the component */
  public align?: Alignment;

  /** Whether the component uses fixed positioning */
  public fixed: boolean = false;

  /** Absolute X position */
  public x = 0;

  /** Absolute Y position */
  public y = 0;

  /** Z-index for rendering order (higher values on top) */
  public z = 0;

  /** Spacing around the component */
  public gap: GapValue = 0;

  /** Whether this component can receive keyboard focus */
  public focusable: boolean = false;

  /** Whether this component currently has focus */
  public hasFocus: boolean = false;

  /** Character used for transparency in rendering ('‽' allows overlays) */
  public transparentChar = '‽';

  /** Reference to parent component in the hierarchy */
  public parent?: Component;

  // ========================================================================
  // Protected/Private Properties
  // ========================================================================

  /** Original size values for relative sizing calculations */
  protected originalWidth?: SizeValue;
  protected originalHeight?: SizeValue;

  /** Current render buffer (2D character array) */
  protected buffer: string[][];

  /** Cleanup functions for state subscriptions */
  private unbindFns: (() => void)[] = [];

  /** Child components managed by this component */
  protected children: Component[] = [];

  /** Layout algorithm used for positioning children */
  protected layoutType: LayoutType;

  /** Configuration for the layout algorithm */
  protected layoutOptions?: LayoutOptions;

  /** Cached layout instance for performance */
  private layout?: any;

  /**
   * Initializes a new Component with the provided properties.
   *
   * @param props Configuration object containing style, layout, and behavior options
   */
  constructor(props: ComponentProps) {
    const mergedStyle = mergeStyles(props);

    // Store original size values for relative sizing calculations
    this.originalWidth = mergedStyle.width;
    this.originalHeight = mergedStyle.height;

    // Initialize dimensions - use explicit values or temporary defaults
    if (typeof mergedStyle.width === 'number') {
      this.width = mergedStyle.width;
    } else {
      this.width = 1; // Temporary - recalculated after layout
    }

    if (typeof mergedStyle.height === 'number') {
      this.height = mergedStyle.height;
    } else {
      this.height = 1; // Temporary - recalculated after layout
    }

    // Initialize basic properties
    this.label = props.label;
    this.comment = props.comment;
    this.showLabel = props.showLabel ?? true;
    this.border = mergedStyle.border ?? false;
    this.fill = mergedStyle.fill ?? ' ';
    this.align = mergedStyle.align;
    this.fixed = props.fixed ?? false;
    this.x = mergedStyle.x ?? 0;
    this.y = mergedStyle.y ?? 0;
    this.z = mergedStyle.z ?? 0;
    this.gap = mergedStyle.gap ?? 0;
    this.buffer = [];

    // Initialize layout system
    this.layoutType = props.layout ?? 'column';
    this.layoutOptions = props.layoutOptions;

    // Initialize children if provided
    this.initializeChildren(props);

  }

  setParent(parent: Component) {
    this.parent = parent;
  }

  /**
   * Initializes child components from props and sets up layout.
   *
   * @param props Component properties containing potential children
   */
  private initializeChildren(props: ComponentProps): void {
    if (!props.children) return;

    const childList = Array.isArray(props.children) ? props.children : [props.children];
    for (const child of childList) {
      if (this.isValidChild(child)) {
        child.setParent(this);
        this.children.push(child);
      }
    }
    this.recalculateLayout();
  }

  /**
   * Validates that a potential child is a valid Component.
   *
   * @param child Potential child component to validate
   * @returns True if the child is a valid Component
   */
  private isValidChild(child: any): child is Component {
    return child && typeof child === 'object' && typeof child.setParent === 'function';
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

  // Auto-sizing methods
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

  protected notifyAppOfFocusRefresh(): void {
    // Walk up the parent chain to find the App
    let current: Component | undefined = this;
    while (current && !(current as any).isApp) {
      current = current.parent;
    }

    // If we found the App, refresh its focus manager (preserves current focus)
    if (current && (current as any).focus) {
      (current as any).focus.refresh(current);
    }
  }

  /**
   * Notifies the application's focus manager that the component tree has changed
   * and focus needs to be completely reset (e.g., when swapping out child components).
   */
  protected notifyAppOfFocusReset(): void {
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

  /**
   * Draws the border around the component using focus-aware styling.
   *
   * @param drawChar Helper function for safe character drawing within bounds
   */
  private drawBorder(drawChar: (x: number, y: number, char: string) => void): void {
    const w = this.width;
    const h = this.height;
    const focused = this.focusable && this.hasFocus;
    const chars = focused ? DOUBLE_BORDER_CHARS : SINGLE_BORDER_CHARS;

    // Draw corners
    drawChar(0, 0, chars.topLeft);
    drawChar(w - 1, 0, chars.topRight);
    drawChar(0, h - 1, chars.bottomLeft);
    drawChar(w - 1, h - 1, chars.bottomRight);

    // Draw horizontal lines
    for (let x = 1; x < w - 1; x++) {
      drawChar(x, 0, chars.horizontal);
      drawChar(x, h - 1, chars.horizontal);
    }

    // Draw vertical lines
    for (let y = 1; y < h - 1; y++) {
      drawChar(0, y, chars.vertical);
      drawChar(w - 1, y, chars.vertical);
    }
  }

  /**
   * Renders all child components sorted by z-index and composites them into the buffer.
   */
  private renderChildren(): void {
    // Sort children by z-index (lower values render first, higher on top)
    const sorted = [...this.children].sort((a, b) => a.z - b.z);

    for (const child of sorted) {
      this.compositeChildBuffer(child);
    }
  }

  /**
   * Composites a single child component's buffer into this component's buffer.
   *
   * @param child The child component to composite
   */
  private compositeChildBuffer(child: Component): void {
    const childBuffer = child.draw();

    for (let j = 0; j < childBuffer.length; j++) {
      for (let i = 0; i < childBuffer[j].length; i++) {
        const px = child.x + i;
        const py = child.y + j;

        if (px >= 0 && px < this.width && py >= 0 && py < this.height) {
          const char = childBuffer[j][i];
          if (char !== child.transparentChar) {
            this.buffer[py][px] = char;
          }
        }
      }
    }
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

    // Helper function for safe character drawing within bounds
    const drawChar = (x: number, y: number, char: string) => {
      if (x >= 0 && x < this.width && y >= 0 && y < this.height) {
        this.buffer[y][x] = char;
      }
    };

    // Draw border if enabled
    if (this.border) {
      this.drawBorder(drawChar);
    }

    if (this.label && this.showLabel) {
      const label = ` ${this.label} `;
      const start = 1;
      for (let i = 0; i < label.length && i + start < this.width - 1; i++) {
        drawChar(i + start, 0, label[i]);
      }
    }

    // Render child components
    this.renderChildren();

    return this.buffer;
  }
}
