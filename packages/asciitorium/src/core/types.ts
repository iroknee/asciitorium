import { Component } from './Component';
import { LayoutOptions, LayoutType } from './layouts/Layout';

// Simplified alignment - only cross-axis positioning with keywords
// Row children: 'top' | 'center' | 'bottom' (vertical cross-axis)
// Column children: 'left' | 'center' | 'right' (horizontal cross-axis)
// Use 'position' prop for numeric offsets, 'gap' prop for spacing
export type Alignment = 'top' | 'center' | 'bottom' | 'left' | 'right';

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
