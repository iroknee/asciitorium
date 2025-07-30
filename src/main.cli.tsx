import App from './core/App.js';
import { TerminalRenderer } from './core/TerminalRenderer.js';
import { RowLayout } from './core/RowLayout.js';
import { Text } from './components/Text.js';
import { AsciiArt } from './components/AsciiArt.js';

const app = (
  <App width={80} height={24} border={true} renderer={new TerminalRenderer()}>
    <Text value="Header: Welcome to ASCII UI" />
    <RowLayout width={76} height={6} border={true} layout="row">
      <Text value="Left" />
      <AsciiArt
        content="
Hi There!!!
You can put ASCII art
here!"
        border={true}
      />
      <Text value="Right" />
    </RowLayout>
    <Text value="Footer: Press Ctrl+C to exit." />
  </App>
);

process.stdin.setRawMode(true);
process.stdin.resume();
process.stdin.on('data', (data) => {
  const key = data.toString();
  if (key === '\u0003') process.exit(); // Ctrl+C
  app.handleKey(key);
});
