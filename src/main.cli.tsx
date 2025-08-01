import App from './core/App.js';
import { TerminalRenderer } from './core/TerminalRenderer.js';
import { Text } from './components/Text.js';
import { AsciiArt } from './components/AsciiArt.js';
import { State } from 'core/State.js';
import { HorizontalLine } from 'components/HorizonalLine.js';
import { Button } from 'components/Button.js';


// Create a stateful label to update when button is clicked
const message = new State("Click a button!");

const app = (
  <App width={64} height={32} border renderer={new TerminalRenderer()}>
    {/* <AsciiArt content={a1982} align="center" /> */}
    <HorizontalLine length={42} align="center"/>
    <Text value="an ASCII-based UI framework" align="center"/>
    <Button name="Button A" onClick={() => message.value = "A Clicked!"} align="center" />
    <Button name="Button B" onClick={() => message.value = "B Clicked!"} align="center" />
    <Text value="Fixed Position" fixed x={2} y={0} />
    <Text border={true} value={message} align="bottom-left"/> 
    <Text value="© 1982" align="bottom-right"/>
  </App>
);

process.stdin.setRawMode(true);
process.stdin.resume();
process.stdin.on('data', (data) => {
  const key = data.toString();
  if (key === '\u0003') process.exit(); // Ctrl+C
  app.handleKey(key);
});
