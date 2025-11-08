import { Component } from './Component.js';
import { LayoutOptions, LayoutType } from './layouts/Layout.js';

// Alignment system for grouping and positioning children
// Used by Row/Column containers to position all children as a unified group
//
// Full 9-value positions:
//   'top-left', 'top-center', 'top-right'
//   'center-left', 'center', 'center-right'
//   'bottom-left', 'bottom-center', 'bottom-right'
//
// Shorthands (auto-center on opposite axis):
//   'left' → 'center-left', 'right' → 'center-right'
//   'top' → 'top-center', 'bottom' → 'bottom-center'
//
export type Alignment =
  | 'top-left' | 'top-center' | 'top-right'
  | 'center-left' | 'center' | 'center-right'
  | 'bottom-left' | 'bottom-center' | 'bottom-right'
  | 'left' | 'right' | 'top' | 'bottom';  // Shorthands

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

// Position configuration type for exact coordinate placement
export type PositionValue = {
  x?: number;
  y?: number;
  z?: number;
};

// Style interface for component styling properties
export interface ComponentStyle {
  width?: SizeValue;
  height?: SizeValue;
  border?: boolean;
  background?: string;
  align?: Alignment;
  position?: PositionValue;
  gap?: GapValue;
  font?: string;
  layout?: LayoutType;
}
