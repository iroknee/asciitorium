import type { Alignment } from '../types.js';

/**
 * Resolve alignment keywords to numeric offsets.
 * Only handles simple cross-axis alignment:
 * - Row children: 'top', 'center', 'bottom' (vertical)
 * - Column children: 'left', 'center', 'right' (horizontal)
 * - 'center' works for both axes
 */
export function resolveAlignment(
  align: Alignment | undefined,
  parentWidth: number,
  parentHeight: number,
  childWidth: number,
  childHeight: number
): { x: number; y: number } {
  if (!align) {
    return { x: 0, y: 0 };
  }

  const padX = parentWidth - childWidth;
  const padY = parentHeight - childHeight;

  let x = 0;
  let y = 0;

  // Horizontal alignment (for Column children)
  if (align === 'left') {
    x = 0;
  } else if (align === 'right') {
    x = padX;
  }

  // Vertical alignment (for Row children)
  if (align === 'top') {
    y = 0;
  } else if (align === 'bottom') {
    y = padY;
  }

  // Center works for both axes
  if (align === 'center') {
    x = Math.floor(padX / 2);
    y = Math.floor(padY / 2);
  }

  return { x, y };
}