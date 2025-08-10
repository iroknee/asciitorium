import type { Alignment } from './types';
import { State } from './State';

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
    // Handle compound alignments like "top-left"
    switch (align) {
      case 'top-left':
        vAlign = 'top';
        hAlign = 'left';
        break;
      case 'top':
        vAlign = 'top';
        hAlign = 'center';
        break;
      case 'top-right':
        vAlign = 'top';
        hAlign = 'right';
        break;

      case 'left':
        vAlign = 'middle';
        hAlign = 'left';
        break;
      case 'center':
        vAlign = 'middle';
        hAlign = 'center';
        break;
      case 'right':
        vAlign = 'middle';
        hAlign = 'right';
        break;

      case 'bottom-left':
        vAlign = 'bottom';
        hAlign = 'left';
        break;
      case 'bottom':
        vAlign = 'bottom';
        hAlign = 'center';
        break;
      case 'bottom-right':
        vAlign = 'bottom';
        hAlign = 'right';
        break;

      default:
        // fallback to top-left if unrecognized
        vAlign = 'top';
        hAlign = 'left';
        break;
    }
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

export function isState<T>(v: any): v is State<T> {
  return typeof v === 'object' && typeof v.subscribe === 'function';
}

export async function loadAsciiAsset(relativePath: string): Promise<string> {
  if (typeof window !== 'undefined' && typeof fetch !== 'undefined') {
    // Web: use fetch from public path
    return fetch(relativePath).then((res) => {
      if (!res.ok) throw new Error(`Failed to load ${relativePath}`);
      return res.text();
    });
  } else {
    // Node: load from file system relative to the process CWD
    const { readFile } = await import('fs/promises');
    const { resolve } = await import('path');

    const fullPath = resolve(process.cwd(), relativePath);
    return readFile(fullPath, 'utf-8');
  }
}
