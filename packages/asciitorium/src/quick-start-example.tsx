import { App, Text, State, Art, TextInput, Line } from './index';

// Reactive state for user input
const userInput = new State('Hello, World!');

const app = (
  <App>
    <Art src="./art/asciitorium.txt" align="center" />
    <Line style={{ width: 60, align: 'center' }} />
    <Text style={{ align: 'center', gap: { bottom: 3 } }}>
      A UI framework for CLI and web
    </Text>

    <TextInput
      style={{ width: 40, align: 'center', gap: { bottom: 2 } }}
      value={userInput}
    />

    <Text align="center">{userInput}</Text>
  </App>
);

await app.start();
