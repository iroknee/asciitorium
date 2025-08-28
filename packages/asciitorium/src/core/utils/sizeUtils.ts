import type { SizeValue, SizeContext } from '../types';

/**
 * Parse a percentage string and return the numeric value
 * @param value - Percentage string like "50%"
 * @returns Numeric percentage (0.5 for "50%")
 */
export function parsePercentage(value: string): number {
  const match = value.match(/^(\d+(?:\.\d+)?)%$/);
  if (!match) {
    throw new Error(`Invalid percentage format: ${value}`);
  }
  return parseFloat(match[1]) / 100;
}

/**
 * Check if a size value is a percentage string
 * @param value - Size value to check
 * @returns True if the value is a percentage string
 */
export function isPercentage(value: SizeValue): value is `${number}%` {
  return typeof value === 'string' && value.endsWith('%');
}

/**
 * Resolve a SizeValue to an absolute pixel value
 * @param size - The size value to resolve
 * @param context - Parent size context for percentage calculations
 * @param dimension - Whether this is width or height (affects which parent dimension to use)
 * @returns Absolute size in characters
 */
export function resolveSize(
  size: SizeValue | undefined,
  context: SizeContext,
  dimension: 'width' | 'height'
): number | undefined {
  if (size === undefined) {
    return undefined;
  }

  if (typeof size === 'number') {
    return size;
  }

  if (isPercentage(size)) {
    const percentage = parsePercentage(size);
    const parentSize = dimension === 'width' ? context.availableWidth : context.availableHeight;
    return Math.floor(parentSize * percentage);
  }

  if (size === 'auto') {
    return undefined; // Auto-sizing will be handled by layout
  }

  if (size === 'fill') {
    return dimension === 'width' ? context.availableWidth : context.availableHeight;
  }

  throw new Error(`Unknown size value: ${size}`);
}

/**
 * Calculate the available space after accounting for fixed-size children
 * @param parentSize - Total parent size
 * @param children - Array of child size values
 * @param context - Size context for resolution
 * @param dimension - Width or height dimension
 * @returns Available space for flexible children
 */
export function calculateAvailableSpace(
  parentSize: number,
  children: (SizeValue | undefined)[],
  context: SizeContext,
  dimension: 'width' | 'height'
): number {
  let usedSpace = 0;
  let flexibleChildren = 0;

  for (const childSize of children) {
    if (childSize === 'fill') {
      flexibleChildren++;
    } else {
      const resolved = resolveSize(childSize, context, dimension);
      if (resolved !== undefined) {
        usedSpace += resolved;
      }
    }
  }

  const availableSpace = Math.max(0, parentSize - usedSpace);
  return flexibleChildren > 0 ? Math.floor(availableSpace / flexibleChildren) : availableSpace;
}

/**
 * Create a SizeContext from parent dimensions
 * @param parentWidth - Parent component width
 * @param parentHeight - Parent component height
 * @param borderPadding - Border padding to account for
 * @returns SizeContext for child calculations
 */
export function createSizeContext(
  parentWidth: number,
  parentHeight: number,
  borderPadding: number = 0
): SizeContext {
  const availableWidth = parentWidth - 2 * borderPadding;
  const availableHeight = parentHeight - 2 * borderPadding;

  return {
    parentWidth,
    parentHeight,
    availableWidth: Math.max(0, availableWidth),
    availableHeight: Math.max(0, availableHeight),
  };
}