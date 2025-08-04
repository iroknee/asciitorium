import readline from 'readline';
import { App } from './core/App.js';
import { TerminalRenderer } from './core/renderers/TerminalRenderer.js';
import { Text } from './components/Text.js';
import { ProgressBar } from './components/ProgressBar.js';
import { State } from 'core/State.js';
import { HorizontalLine } from 'components/HorizonalLine.js';
import { Button } from 'components/Button.js';

// Create a stateful label to update when button is clicked
const message = new State('Click a button!');

const app = (
  
);

// --- Terminal Input Setup ---
readline.emitKeypressEvents(process.stdin);
if (process.stdin.isTTY) {
  process.stdin.setRawMode(true);
}

// Normalize terminal keypresses to browser-style keys
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

// Handle keypress
process.stdin.on('keypress', (str, key) => {
  const normalized = normalizeKey(key);
  app.handleKey(normalized);
});
