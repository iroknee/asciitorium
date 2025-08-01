import { AsciiArt } from './components/AsciiArt';
import { Text } from './components/Text';
import { ListBox } from './components/ListBox';
import { HorizontalLine } from './components/HorizonalLine';
import { ProgressBar } from './components/ProgressBar';
import a1982 from './1982.txt?raw';
import App from './core/App';
import { State } from './core/State';
import { TextInput } from './components/TextInput';
import { Button } from './components/Button';
import { CelticBorder } from './components/CelticBorder';
import { DomRenderer } from './core/DomRenderer';

const screen = document.getElementById('screen')!;
screen.style.fontFamily = 'PrintChar21';

// Create a stateful label to update when button is clicked
const message = new State('Click a button!');

const app = (
  <App width={64} height={32} border renderer={new DomRenderer(screen)}>
    <AsciiArt content={a1982} align="center" />
    <HorizontalLine length={42} align="center" />
    <Text value="an ASCII-based UI framework" align="center" />
    <Button
      name="Button A"
      onClick={() => (message.value = 'A Clicked!')}
      align="center"
    />
    <Button
      name="Button B"
      onClick={() => (message.value = 'B Clicked!')}
      align="center"
    />
    <Text value="Fixed Position" fixed x={2} y={0} />
    <Text border={true} value={message} align="bottom-left" />
    <Text value="© 1982" align="bottom-right" />
  </App>
);

// Global key listener
window.addEventListener('keydown', (event) => {
  app.handleKey(event.key);
});
