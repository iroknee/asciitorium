import { AsciiArt } from '../components/AsciiArt';
import { Text } from '../components/Text';
import { ListBox } from '../components/ListBox';
import { HorizontalLine } from '../components/HorizontalLine';
import { ProgressBar } from '../components/ProgressBar';
import gscreen from './art/asciitorium.txt?raw';
import owl from './art/owl.txt?raw';
import { App } from '../core/App';
import { State } from '../core/State';
import { TextInput } from '../components/TextInput';
import { Button } from '../components/Button';
import { DomRenderer } from '../core/renderers/DomRenderer';
import { HorizontalLayout } from '../core/layouts/HorizontalLayout';
import { Tabs } from '../components/Tabs';

const screen = document.getElementById('screen')!;
screen.style.fontFamily = 'PrintChar21';

// Create a stateful label to update when button is clicked
const message = new State('');
const selected = new State('Item 1');
const loading = new State(0);
const appWidth = 64;
const appHeight = 44;

const app = (
  <App width={appWidth} height={appHeight} renderer={new DomRenderer(screen)}>
    <AsciiArt content={gscreen} align="center" height={7} />
    <HorizontalLine length={36} align="center" />
    <Text value="an ASCII-based UI framework" align="top" height={4} />
    <HorizontalLayout width={appWidth} border height={appHeight - 16}>
      <TextInput label="Input" width={16} text={message} align="center" />
      <Text value="Label:" align="center" />
      <Text value={message} width={15} align="center" />
    </HorizontalLayout>
  </App>
);

// Global key listener
window.addEventListener('keydown', (event) => {
  app.handleKey(event.key);
});

app.reportFPS(); // Start reporting FPS
