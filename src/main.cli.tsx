import readline from 'readline';
import App from './core/App.js';
import { TerminalRenderer } from './core/TerminalRenderer.js';
import { Text } from './components/Text.js';
import { ProgressBar } from './components/ProgressBar.js';
import { State } from 'core/State.js';
import { HorizontalLine } from 'components/HorizonalLine.js';
import { Button } from 'components/Button.js';

// Create a stateful label to update when button is clicked
const message = new State('Click a button!');

const app = (
  <App width={64} height={32} border renderer={new TerminalRenderer()}>
    <HorizontalLine length={42} align="center" />
    <Text value="an ASCII-based UI framework" align="center" height={5} />
    <Button
      name="A"
      align="center"
      width={16}
      onClick={() => (message.value = 'A Clicked!')}
    />
    <Button
      name="Button B"
      onClick={() => (message.value = 'B Clicked!')}
      align="center"
    />
    <Button
      name="Button C"
      onClick={() => (message.value = 'C Clicked!')}
      align="center"
      height={5}
    />
    <Text value=" Project 1982 " fixed x={2} y={0} />
    <Text value={message} height={5} align="center" />
    <Text value="©1982" fixed x={58} y={30} />
    <ProgressBar label="Loading..." progress={0.54} width={60} />
  </App>
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
