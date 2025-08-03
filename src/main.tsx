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
const loading = new State(0);

const app = (
  <App width={64} height={34} border renderer={new DomRenderer(screen)}>
    <AsciiArt content={a1982} align="center" />
    <HorizontalLine length={42} align="center" />
    <Text value="an ASCII-based UI framework" align="center" height={5} />
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
    <Button
      name="Button C"
      onClick={() => (message.value = 'C Clicked!')}
      align="center"
    />
    <Button
      name="Button D"
      onClick={() => (message.value = 'D Clicked!')}
      align="center"
    />
    <Text value=" Project 1982 " fixed x={2} y={0} />
    <Text value={message} height={5} align="center" />
    <Text value="©1982" fixed x={58} y={30} />
    <ProgressBar label="Loading..." progress={loading} width={32} />
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
