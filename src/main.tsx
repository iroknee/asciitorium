import { AsciiArt } from './components/AsciiArt';
import { Text } from './components/Text';
import { ListBox } from './components/ListBox';
import { HorizontalLine } from './components/HorizonalLine';
import { ProgressBar } from './components/ProgressBar';
import a1982 from './1982.txt?raw';
import { App } from './core/App';
import { State } from './core/State';
import { TextInput } from './components/TextInput';
import { Button } from './components/Button';
import { CelticBorder } from './components/CelticBorder';
import { DomRenderer } from './core/DomRenderer';

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
    <Text value="an ASCII-based UI framework" align="center" height={5} />
    <Button
      name="Button A"
      align="center"
      width={14}
      onClick={() => (message.value = 'A Clicked!')}
    />
    <TextInput label="Input" width={16} align="center" text={message} />
    <Text value={message} width={15} align="center" />
    <ListBox
      label="List Box"
      items={['Item 1', 'Item 2', 'Item 3', 'Iteddm 4', 'em 5', 'Item 6', 'Item 7']}
      selectedItem={selected}
      width={20}
      height={8}
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

// Global key listener
window.addEventListener('keydown', (event) => {
  app.handleKey(event.key);
});

// Simulate loading progress
setTimeout(() => {
  loading.value = 0.56;
}, 1000);
setTimeout(() => {
  loading.value = 0.23;
}, 2000);
