import { State } from './State';
import { setRenderCallback } from './RenderScheduler';

export function isState<T>(v: any): v is State<T> {
  return typeof v === 'object' && typeof v.subscribe === 'function';
}

export function isNodeEnvironment(): boolean {
  return (
    typeof process !== 'undefined' &&
    typeof process.cpuUsage === 'function' &&
    typeof process.memoryUsage === 'function'
  );
}

export function isWebEnvironment(): boolean {
  return typeof window !== 'undefined' && typeof document !== 'undefined';
}

export function isCPUSupported(): boolean {
  return isNodeEnvironment();
}

export function isMemorySupported(): boolean {
  return (
    isNodeEnvironment() ||
    (typeof performance !== 'undefined' && (performance as any).memory)
  );
}

export async function setupKeyboardHandling(
  handleKey: (key: string, event?: KeyboardEvent) => void
): Promise<void> {
  if (isWebEnvironment()) {
    // Web environment
    window.addEventListener('keydown', (event) => {
      // Prevent default behavior for F1 to avoid browser help
      if (event.key === 'F1') {
        event.preventDefault();
      }

      // Handle Shift+Tab as a special case
      if (event.key === 'Tab' && event.shiftKey) {
        handleKey('Shift+Tab', event);
      } else {
        handleKey(event.key, event);
      }
    });
  } else {
    // Terminal environment
    const { default: readline } = await import('readline');

    readline.emitKeypressEvents(process.stdin);
    if (process.stdin.isTTY) {
      process.stdin.setRawMode(true);
    }

    process.stdin.on('keypress', (_str: string, key: any) => {
      const k = normalizeKey(key);
      handleKey(k);
    });
  }
}

function normalizeKey(key: {
  name?: string;
  ctrl?: boolean;
  meta?: boolean;
  shift?: boolean;
  sequence?: string;
}): string {
  if (!key) return '';
  if (key.ctrl && key.name === 'c') process.exit(); // Ctrl+C = quit

  switch (key.name) {
    case 'return':
      return 'Enter';
    case 'escape':
      return 'Escape';
    case 'backspace':
      return 'Backspace';
    case 'tab':
      return key.shift ? 'Shift+Tab' : 'Tab';
    case 'up':
      return 'ArrowUp';
    case 'down':
      return 'ArrowDown';
    case 'left':
      return 'ArrowLeft';
    case 'right':
      return 'ArrowRight';
    default:
      return key.sequence || '';
  }
}

export function validateWebEnvironment(): void {
  if (isWebEnvironment()) {
    const screen = document.getElementById('screen');
    if (!screen) throw new Error('Missing #screen element for DOM renderer');
  }
}

export async function loadArt(relativePath: string): Promise<string> {
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

    const fullPath = resolve(process.cwd(), 'public', relativePath);
    return readFile(fullPath, 'utf-8');
  }
}

export async function start(app: { handleKey: (key: string) => void; render: () => void }): Promise<void> {
  validateWebEnvironment();
  await setupKeyboardHandling((key) => app.handleKey(key));
  setRenderCallback(() => app.render());
}
