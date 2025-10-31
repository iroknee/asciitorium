import type { TextAlignment } from '../../components/Text';

/**
 * Resolve text alignment keywords to numeric offsets.
 * Supports 9-position grid alignment for positioning text within a Text component.
 *
 * @param textAlign - Text alignment keyword (e.g., 'top-left', 'center', 'bottom-right')
 * @param parentWidth - Width of the text container
 * @param parentHeight - Height of the text container
 * @param contentWidth - Width of the text content
 * @param contentHeight - Height of the text content (number of lines)
 * @returns Object with x and y offsets for positioning the text
 */
export function resolveTextAlignment(
  textAlign: TextAlignment | undefined,
  parentWidth: number,
  parentHeight: number,
  contentWidth: number,
  contentHeight: number
): { x: number; y: number } {
  if (!textAlign) {
    return { x: 0, y: 0 };
  }

  const padX = parentWidth - contentWidth;
  const padY = parentHeight - contentHeight;

  let x = 0;
  let y = 0;

  // Handle compound alignments
  switch (textAlign) {
    case 'top-left':
      x = 0;
      y = 0;
      break;
    case 'top':
      x = Math.floor(padX / 2);
      y = 0;
      break;
    case 'top-right':
      x = padX;
      y = 0;
      break;

    case 'left':
      x = 0;
      y = Math.floor(padY / 2);
      break;
    case 'center':
      x = Math.floor(padX / 2);
      y = Math.floor(padY / 2);
      break;
    case 'right':
      x = padX;
      y = Math.floor(padY / 2);
      break;

    case 'bottom-left':
      x = 0;
      y = padY;
      break;
    case 'bottom':
      x = Math.floor(padX / 2);
      y = padY;
      break;
    case 'bottom-right':
      x = padX;
      y = padY;
      break;
  }

  return { x, y };
}
