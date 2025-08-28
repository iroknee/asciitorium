import { Component } from './Component';

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
