import readline from 'readline';
import { App } from '../core/App.js';
import { TerminalRenderer } from '../core/renderers/TerminalRenderer.js';
import { Text } from '../components/Text.js';
import { ProgressBar } from '../components/ProgressBar.js';
import { State } from 'core/State.js';
import { HorizontalLine } from 'components/HorizontalLine.js';
import { Button } from 'components/Button.js';
import { CelticBorder } from 'components/CelticBorder.js';
import { AsciiArt } from 'components/AsciiArt.js';
import { HorizontalLayout } from 'core/layouts/HorizontalLayout.js';
import { TextInput } from 'components/TextInput.js';
import { Tabs } from 'components/Tabs.js';
import { ListBox } from 'components/ListBox.js';

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

// __dirname workaround in ESModules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Load ASCII art files
const a1982 = fs.readFileSync(path.join(__dirname, '../art/1982.txt'), 'utf-8');
const owl = fs.readFileSync(path.join(__dirname, '../art/owl.txt'), 'utf-8');

const message = new State('');
const selected = new State('Item 1');
const loading = new State(0);
const appWidth = 64;
const appHeight = 44;

const app = (
  <App
    width={appWidth}
    height={appHeight}
    border
    renderer={new TerminalRenderer()}
  >
    <CelticBorder corner="topLeft" fixed x={0} y={0} />
    <CelticBorder corner="topRight" fixed x={appWidth - 8} y={0} />
    <CelticBorder corner="bottomLeft" fixed x={0} y={appHeight - 8} />
    <CelticBorder
      corner="bottomRight"
      fixed
      x={appWidth - 8}
      y={appHeight - 8}
    />
    <AsciiArt content={a1982} align="center" />
    <HorizontalLine length={42} align="center" />
    <Text value="an ASCII-based UI framework" align="center" />
    <HorizontalLayout width={appWidth - 2} border height={5}>
      <TextInput label="Input" width={16} text={message} align="center" />
      <Text value="Label:" align="center" />
      <Text value={message} width={15} align="center" />
    </HorizontalLayout>

    <Tabs
      tabs={['Overview', 'Details', 'Settings', 'Help']}
      selectedTab={new State('Overview')}
      align="center"
    />

    <AsciiArt content={owl} frameDurationMs={1000} align="center" loop />

    <ListBox
      label="List Box"
      items={[
        'Item 1',
        'Item 2',
        'Item 3',
        'Iteddm 4',
        'em 5',
        'Item 6',
        'Item 7',
      ]}
      selectedItem={selected}
      width={20}
      height={8}
      align="center"
    />

    <Button
      name="A"
      align="center"
      width={14}
      onClick={() => (message.value = 'A Clicked!')}
    />
    <Button
      name="Btn B"
      onClick={() => (message.value = 'B Clicked!')}
      width={14}
      align="center"
    />

    <ProgressBar
      label="Loading..."
      progress={loading}
      width={32}
      align="center"
    />
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
