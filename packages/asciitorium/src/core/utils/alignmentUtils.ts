import type { Alignment } from '../types.js';

/**
 * Expands shorthand alignment values to full 9-value format.
 * Shorthands auto-center on the opposite axis:
 * - 'left' → 'center-left'
 * - 'right' → 'center-right'
 * - 'top' → 'top-center'
 * - 'bottom' → 'bottom-center'
 * - 'center' → 'center' (no change)
 * - Full values like 'top-left' pass through unchanged
 */
function expandAlignment(align: Alignment): string {
  if (align === 'left') return 'center-left';
  if (align === 'right') return 'center-right';
  if (align === 'top') return 'top-center';
  if (align === 'bottom') return 'bottom-center';
  return align; // Already in full format or 'center'
}

/**
 * Resolve alignment to numeric offsets.
 * Handles 9-value positioning system with shorthand support:
 * - Full: 'top-left', 'top-center', 'top-right', etc.
 * - Shorthand: 'left', 'right', 'top', 'bottom', 'center'
 *
 * Works consistently across all layout types.
 */
export function resolveAlignment(
  align: Alignment | undefined,
  parentWidth: number,
  parentHeight: number,
  childWidth: number,
  childHeight: number
): { x: number; y: number } {
  if (!align) {
    return { x: 0, y: 0 }; // Default: top-left
  }

  const expanded = expandAlignment(align);
  const padX = parentWidth - childWidth;
  const padY = parentHeight - childHeight;

  let x = 0;
  let y = 0;

  // Parse vertical and horizontal components
  const [vertical, horizontal] = expanded.split('-').length === 2
    ? expanded.split('-')
    : expanded === 'center'
      ? ['center', 'center']
      : ['top', 'left']; // fallback

  // Vertical alignment
  if (vertical === 'top') {
    y = 0;
  } else if (vertical === 'bottom') {
    y = padY;
  } else if (vertical === 'center') {
    y = Math.floor(padY / 2);
  }

  // Horizontal alignment
  if (horizontal === 'left') {
    x = 0;
  } else if (horizontal === 'right') {
    x = padX;
  } else if (horizontal === 'center') {
    x = Math.floor(padX / 2);
  }

  return { x, y };
}