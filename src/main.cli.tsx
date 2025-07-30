import App from './core/App.js';
import { TerminalRenderer } from './core/TerminalRenderer.js';
import { Text } from './components/Text.js';

const app = (
  <App width={80} height={24} border={true} renderer={new TerminalRenderer()}>
    <Text value="Hello from JSX!" />
    <Text value="Press Ctrl+C to exit." />
  </App>
);

process.stdin.setRawMode(true);
process.stdin.resume();
process.stdin.on('data', (data) => {
  const key = data.toString();
  if (key === '\u0003') process.exit(); // Ctrl+C
  app.handleKey(key);
});
