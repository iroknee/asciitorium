import { Component } from './Component';

export type HorizontalAlign = 'left' | 'center' | 'right' | number;
export type VerticalAlign = 'top' | 'center' | 'bottom' | number;

export type AlignmentKeyword =
  | 'top-left' | 'top' | 'top-right'
  | 'left' | 'center' | 'right'
  | 'bottom-left' | 'bottom' | 'bottom-right';

export type Alignment = AlignmentKeyword | { x: 'left' | 'center' | 'right' | number, y: 'top' | 'middle' | 'bottom' | number };

export interface AddComponentLayout {
  component: Component;
  alignX?: HorizontalAlign;
  alignY?: VerticalAlign;
  alignZ?: number;
}

export interface FixedPositionComponent {
  component: Component;
  x: number;
  y: number;
  z: number;
}
