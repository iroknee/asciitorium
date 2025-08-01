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
const message = new State("Click a button!");

const app = (
  <App width={64} height={32} border={true} fit={false} renderer={new DomRenderer(screen)}>
    <AsciiArt content={a1982} align="center" />
    <HorizontalLine length={42} align="center"/>
    <Text value="An ASCII GUI Framework" align="center"/>
    <Button name="Button A" onClick={() => message.value = "A Clicked!"} />
    <Button name="Button B" onClick={() => message.value = "B Clicked!"} />
    <Text border={true} value={message} align="bottom-left"/> 
    <Text value="Footer: Press Ctrl+C to exit." height={13} align="bottom-right"/>
  </App>
);