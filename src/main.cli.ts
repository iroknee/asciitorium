import App from './core/App';
import { TerminalRenderer } from './core/TerminalRenderer';
import { Text } from './components/Text';

const app = new App({
  width: 80,
  height: 24,
  renderer: new TerminalRenderer(),
});

const hello = new Text({ value: 'Hello from the terminal!' });
app.add({ component: hello, alignX: 'center', alignY: 'center' });

process.stdin.setRawMode(true);
process.stdin.resume();

process.stdin.on('data', (data) => {
  const key = data.toString();

  if (key === '\u0003') process.exit(); // Ctrl+C
  app.handleKey(key);
});