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
  handleKey: (key: string, event?: KeyboardEvent) => void,
  handleMobileButton?: (buttonId: string) => void
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
    if (isMobileDevice() && handleMobileButton) {
      setupMobileControls(handleMobileButton);
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

function setupMobileControls(handleMobileButton: (buttonId: string) => void): void {
  const mobileControls = document.getElementById('mobile-controls');
  const menuButton = document.getElementById('btn-menu');

  if (!mobileControls) return;

  // Show mobile controls and menu button
  mobileControls.classList.add('visible');
  if (menuButton) {
    menuButton.classList.add('visible');
  }

  // All button IDs - no hardcoded key mappings!
  const buttonIds = [
    'btn-up',
    'btn-down',
    'btn-left',
    'btn-right',
    'btn-a',
    'btn-b',
    'btn-x',
    'btn-y',
    'btn-menu',
  ];

  // Add touch event listeners to each button
  buttonIds.forEach((buttonId) => {
    const button = document.getElementById(buttonId);
    if (!button) return;

    // Use touchstart for immediate response
    button.addEventListener('touchstart', (event) => {
      event.preventDefault(); // Prevent default touch behavior
      handleMobileButton(buttonId);
    });

    // Also support click for testing in desktop browsers
    button.addEventListener('click', (event) => {
      event.preventDefault();
      handleMobileButton(buttonId);
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
    // Web mode: Try project assets first, then library assets
    let projectError: Error | null = null;
    let libError: Error | null = null;

    try {
      const response = await fetch(relativePath);
      if (response.ok) {
        const text = await response.text();
        // Check if we got HTML instead of the actual asset (Vite SPA fallback)
        if (text.trim().startsWith('<!doctype') || text.trim().startsWith('<!DOCTYPE') || text.trim().startsWith('<html')) {
          projectError = new Error('HTML fallback (file not found)');
        } else {
          return text;
        }
      } else {
        projectError = new Error(`${response.status} ${response.statusText}`);
      }
    } catch (err) {
      projectError = err as Error;
    }

    // Fallback to library assets (via Vite alias)
    try {
      const libPath = `/lib-assets/${relativePath}`;
      const response = await fetch(libPath);
      if (response.ok) {
        const text = await response.text();
        // Double check we didn't get HTML here too
        if (text.trim().startsWith('<!doctype') || text.trim().startsWith('<!DOCTYPE') || text.trim().startsWith('<html')) {
          libError = new Error('HTML fallback (file not found)');
        } else {
          return text;
        }
      } else {
        libError = new Error(`${response.status} ${response.statusText}`);
      }
    } catch (err) {
      libError = err as Error;
    }

    throw new Error(
      `Failed to load ${relativePath} - not found in project (${projectError?.message}) or library (${libError?.message})`
    );
  } else {
    // CLI mode: Try project assets first, then library assets
    const { readFile } = await import('fs/promises');
    const { resolve } = await import('path');

    // Try project public directory first
    const projectPath = resolve(process.cwd(), 'public', relativePath);
    try {
      return await readFile(projectPath, 'utf-8');
    } catch {
      // Project asset not found, try library assets
    }

    // Try library assets in node_modules
    const libPath = resolve(
      process.cwd(),
      'node_modules',
      'asciitorium',
      'public',
      relativePath
    );
    try {
      return await readFile(libPath, 'utf-8');
    } catch {
      // Both failed
    }

    throw new Error(
      `Failed to load ${relativePath} - not found in project (${projectPath}) or library (${libPath})`
    );
  }
}

export async function start(app: { handleKey: (key: string) => void; render: () => void }): Promise<void> {
  validateWebEnvironment();
  await setupKeyboardHandling((key) => app.handleKey(key));
  setRenderCallback(() => app.render());
}
