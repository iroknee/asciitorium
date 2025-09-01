// src/runtime/jsx-runtime.ts
import { Component } from '../core/Component';
import { Text } from '../components/Text'; // adjust path if needed

/**
 * Normalize children to a flat array (preserve your existing "children on props" behavior).
 */
function normalizeChildren(children: any): any[] {
  if (children == null) return [];
  return Array.isArray(children) ? children.flat(Infinity) : [children];
}

/**
 * Convert a function component's return value into a Component.
 * - Component -> pass through
 * - string/number -> wrap in Text
 * - array -> wrap in a simple container Component (column stack)
 */
function toComponent(node: any): Component {
  if (node == null) {
    return new Text({ value: '' });
  }
  if (node instanceof Component) {
    return node;
  }
  if (Array.isArray(node)) {
    const container = new Component({ layout: 'column' } as any);
    for (const n of node) {
      container.addChild(toComponent(n));
    }
    return container;
  }
  if (typeof node === 'string' || typeof node === 'number') {
    return new Text({ value: String(node) });
  }
  // As a fallback, try stringify
  return new Text({ value: String(node) });
}

/**
 * JSX factory function to create elements.
 * Supports both class components (existing behavior) and function components (new).
 */
export function jsx(type: any, props: any, _key?: string): any {
  // Preserve your current behavior: keep children on props, but flatten them
  if (props?.children) {
    props.children = normalizeChildren(props.children);
  }

  const isClassComponent =
    typeof type === 'function' && type.prototype instanceof Component;

  if (isClassComponent) {
    // Unchanged from your version: just construct the class.
    // Your class components can read props.children as before.
    return new type(props);
  }

  if (typeof type === 'function') {
    // Function component: call it with props and normalize the result.
    const out = type(props);
    return toComponent(out);
  }

  // If someone tried an intrinsic tag like <div>, we don’t support it.
  throw new Error(`Unsupported JSX element type: ${String(type)}`);
}

export const jsxs = jsx;
export const jsxDEV = jsx;

/**
 * Optional: keep Fragment unsupported (matches your current behavior).
 * If you later want fragments, replace this with: `export const Fragment = (p:{children?:any}) => p.children ?? null;`
 */
export const Fragment = () => {
  throw new Error('Fragment syntax (<></>) is not supported in asciitorium.');
};
