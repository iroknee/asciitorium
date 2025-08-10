import type { Component } from '../core/Component';

declare namespace JSX {
  export type Element = Component;

  export interface IntrinsicElements {} // we don’t use <div> etc.

  export interface ElementClass {
    render: () => Component;
  }

  export interface ElementAttributesProperty {
    props: {}; // Or "props" if that's the actual property name on your classes
  }
}
