export interface ResolvedGap {
  top: number;
  bottom: number;
  left: number;
  right: number;
}

export type GapValue = number | {
  top?: number;
  bottom?: number;
  left?: number;
  right?: number;
  x?: number; // shorthand for left + right
  y?: number; // shorthand for top + bottom
} | number[];

/**
 * Resolves various gap formats into a normalized { top, bottom, left, right } object
 */
export function resolveGap(gap: GapValue): ResolvedGap {
  if (typeof gap === 'number') {
    // Single number applies to all sides
    return { top: gap, bottom: gap, left: gap, right: gap };
  }
  
  if (Array.isArray(gap)) {
    // CSS-style array shorthand
    if (gap.length === 1) {
      // [all]
      return { top: gap[0], bottom: gap[0], left: gap[0], right: gap[0] };
    } else if (gap.length === 2) {
      // [y, x] - [top/bottom, left/right]
      return { top: gap[0], bottom: gap[0], left: gap[1], right: gap[1] };
    } else if (gap.length === 3) {
      // [top, x, bottom] - [top, left/right, bottom]
      const [top, horizontal, bottom] = gap;
      return { top, bottom, left: horizontal, right: horizontal };
    } else if (gap.length >= 4) {
      // [top, right, bottom, left]  
      const [top, right, bottom, left] = gap;
      return { top, right, bottom, left };
    } else {
      return { top: 0, bottom: 0, left: 0, right: 0 };
    }
  }
  
  if (typeof gap === 'object' && gap !== null) {
    // Object format with explicit or shorthand properties
    const resolved: ResolvedGap = {
      top: gap.top ?? 0,
      bottom: gap.bottom ?? 0,
      left: gap.left ?? 0,
      right: gap.right ?? 0,
    };
    
    // Apply shorthand properties if they exist
    if (gap.y !== undefined) {
      resolved.top = gap.y;
      resolved.bottom = gap.y;
    }
    if (gap.x !== undefined) {
      resolved.left = gap.x;
      resolved.right = gap.x;
    }
    
    // Explicit properties override shorthand
    if (gap.top !== undefined) resolved.top = gap.top;
    if (gap.bottom !== undefined) resolved.bottom = gap.bottom;
    if (gap.left !== undefined) resolved.left = gap.left;
    if (gap.right !== undefined) resolved.right = gap.right;
    
    return resolved;
  }
  
  // Fallback
  return { top: 0, bottom: 0, left: 0, right: 0 };
}