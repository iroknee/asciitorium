import { Component } from './Component';

export type HorizontalAlign = 'left' | 'center' | 'right' | number;
export type VerticalAlign = 'top' | 'center' | 'bottom' | number;

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
