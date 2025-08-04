// core/bootstrap.ts
import type { Asciitorium } from './Asciitorium';
import { DomRenderer } from './renderers/DomRenderer';

export async function bootstrap(app: Asciitorium): Promise<void> {
  if (typeof window !== 'undefined' && typeof document !== 'undefined') {
    // Web environment
    const screen = document.getElementById('screen');
    if (!screen) throw new Error('Missing #screen element for DOM renderer');

    screen.style.fontFamily = 'PrintChar21';
    app.setRenderer(new DomRenderer(screen));

    window.addEventListener('keydown', (event) => {
      app.handleKey(event.key);
    });
  } else {
    // Terminal environment
    const { default: readline } = await import('readline');
    const { TerminalRenderer } = await import(
      './renderers/TerminalRenderer.js'
    );

    const renderer = new TerminalRenderer();
    app.setRenderer(renderer);

    readline.emitKeypressEvents(process.stdin);
    if (process.stdin.isTTY) {
      process.stdin.setRawMode(true);
    }

    process.stdin.on('keypress', (str: string, key: any) => {
      const k = normalizeKey(key);
      app.handleKey(k);
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
      return 'Tab';
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
