import { State } from './State.js';
import { setRenderCallback } from './RenderScheduler.js';

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

export function isMobileDevice(): boolean {
  if (!isWebEnvironment()) return false;

  // Check for touch support (works with Chrome DevTools device emulation)
  const hasTouchSupport = 'ontouchstart' in window || navigator.maxTouchPoints > 0;
  const isMobileUA = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);

  // Also check for small screen size as additional mobile indicator
  const isSmallScreen = window.innerWidth <= 768;

  // Return true if touch support is present (catches DevTools emulation)
  // OR if both mobile UA and small screen (catches real mobile devices)
  return hasTouchSupport || (isMobileUA && isSmallScreen);
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

    // Setup mobile controls if on mobile device
    if (isMobileDevice()) {
      setupMobileControls(handleKey);
      setupSwipeDetection(handleKey);
    }
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

function setupMobileControls(handleKey: (key: string) => void): void {
  const mobileControls = document.getElementById('mobile-controls');
  if (!mobileControls) return;

  // Show mobile controls
  mobileControls.classList.add('visible');

  // Map button IDs to key codes
  const buttonMap: Record<string, string> = {
    'btn-up': 'ArrowUp',
    'btn-down': 'ArrowDown',
    'btn-left': 'ArrowLeft',
    'btn-right': 'ArrowRight',
    'btn-enter': 'Enter',
  };

  // Add touch event listeners to each button
  Object.entries(buttonMap).forEach(([buttonId, key]) => {
    const button = document.getElementById(buttonId);
    if (!button) return;

    // Use touchstart for immediate response
    button.addEventListener('touchstart', (event) => {
      event.preventDefault(); // Prevent default touch behavior
      handleKey(key);
    });

    // Also support click for testing in desktop browsers
    button.addEventListener('click', (event) => {
      event.preventDefault();
      handleKey(key);
    });
  });
}

function setupSwipeDetection(handleKey: (key: string) => void): void {
  const screen = document.getElementById('screen');
  if (!screen) return;

  let touchStartX = 0;
  let touchStartY = 0;
  let touchStartTime = 0;

  screen.addEventListener('touchstart', (event) => {
    touchStartX = event.touches[0].clientX;
    touchStartY = event.touches[0].clientY;
    touchStartTime = Date.now();
  });

  screen.addEventListener('touchend', (event) => {
    const touchEndX = event.changedTouches[0].clientX;
    const touchEndY = event.changedTouches[0].clientY;
    const touchEndTime = Date.now();

    const deltaX = touchEndX - touchStartX;
    const deltaY = touchEndY - touchStartY;
    const deltaTime = touchEndTime - touchStartTime;

    // Require minimum distance and maximum time for swipe
    const minSwipeDistance = 50;
    const maxSwipeTime = 500;

    if (deltaTime > maxSwipeTime) return;

    // Check if horizontal swipe (more horizontal than vertical)
    if (Math.abs(deltaX) > Math.abs(deltaY) && Math.abs(deltaX) > minSwipeDistance) {
      if (deltaX > 0) {
        // Swipe right = Tab forward
        handleKey('Tab');
      } else {
        // Swipe left = Tab backward
        handleKey('Shift+Tab');
      }
    }
  });
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
