import { Component } from './Component';
import { LayoutOptions, LayoutType } from './layouts/Layout';

export type HorizontalAlign = 'left' | 'center' | 'right' | number;
export type VerticalAlign = 'top' | 'center' | 'bottom' | number;

export type AlignmentKeyword =
  | 'top-left'
  | 'top'
  | 'top-right'
  | 'left'
  | 'center'
  | 'right'
  | 'bottom-left'
  | 'bottom'
  | 'bottom-right'
  | 'fixed';

export type Alignment =
  | AlignmentKeyword
  | {
      x: 'left' | 'center' | 'right' | number;
      y: 'top' | 'middle' | 'bottom' | number;
    };

// Size value types for relative and absolute sizing
export type SizeValue = 
  | number                    // Absolute size in characters
  | `${number}%`             // Percentage of parent
  | 'auto'                   // Size to content
  | 'fill';                  // Fill available space

// Resolved size with context for calculations
export interface SizeContext {
  parentWidth: number;
  parentHeight: number;
  availableWidth: number;
  availableHeight: number;
}

// Gap configuration type
export type GapValue =
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

// Style interface for component styling properties
export interface ComponentStyle {
  width?: SizeValue;
  height?: SizeValue;
  border?: boolean;
  fill?: string;
  align?: Alignment;
  x?: number;
  y?: number;
  z?: number;
  gap?: GapValue;
  font?: string;
  layout?: LayoutType;
}
