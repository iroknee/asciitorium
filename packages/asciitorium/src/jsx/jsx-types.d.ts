// src/runtime/jsx-types.d.ts
import type { Component } from '../core/Component';

declare namespace JSX {
  /**
   * A JSX expression evaluates to an asciitorium Component instance.
   */
  type Element = Component;

  /**
   * We don’t support DOM intrinsic tags (<div>, <span>, …).
   * Keeping this empty prevents accidental usage.
   */
  interface IntrinsicElements {}

  /**
   * IMPORTANT: remove ElementClass/ElementAttributesProperty constraints.
   * Those constraints force "class with render()" and block function components.
   *
   * With the automatic runtime style (our jsx/jsxs/jsxDEV), TS will type props
   * via the factory function, so we don’t need ElementClass here at all.
   */
}
