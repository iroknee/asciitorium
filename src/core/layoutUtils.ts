import type { Alignment } from './types';

export function resolveAlignment(
  align: Alignment | undefined,
  parentWidth: number,
  parentHeight: number,
  childWidth: number,
  childHeight: number
): { x: number; y: number } {
  let hAlign: 'left' | 'center' | 'right' | number = 'left';
  let vAlign: 'top' | 'middle' | 'bottom' | number = 'top';

  if (typeof align === 'string') {
    const [v, h] = align.split('-');
    vAlign = v as any;
    hAlign = h as any;
  } else if (typeof align === 'object' && align !== null) {
    hAlign = align.x ?? 'left';
    vAlign = align.y ?? 'top';
  }

  const padX = parentWidth - childWidth;
  const padY = parentHeight - childHeight;

  let x: number;
  if (typeof hAlign === 'number') x = hAlign;
  else if (hAlign === 'center') x = Math.floor(padX / 2);
  else if (hAlign === 'right') x = padX;
  else x = 0;

  let y: number;
  if (typeof vAlign === 'number') y = vAlign;
  else if (vAlign === 'middle') y = Math.floor(padY / 2);
  else if (vAlign === 'bottom') y = padY;
  else y = 0;

  return { x, y };
}