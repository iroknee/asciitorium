import {
  Art,
  Line,
  Column,
  Row,
  Text,
  Button,
  State,
  TextInput,
} from './index';
import { BaseStyle } from './constants';

/**
 * State Basics
 *
 * Guide to reactive state management in asciitorium.
 */
export const StateBasics = () => {
  const counter = new State(0);
  const message = new State('Edit the text below and see it update!');
  const inputValue = new State('Hello, State!');

  // Subscribe to input changes to update message
  inputValue.subscribe((value) => {
    message.value = `You typed: ${value}`;
  });

  return (
    <Column style={BaseStyle} label="State Basics">
      <Art gap={{ bottom: 1 }} src="state-icon" align="left" />

      <Text width="90%" align="center" gap={{ bottom: 2 }}>
        State objects provide reactive state management with a subscribe pattern.
        Components automatically re-render when State values change, enabling
        dynamic UIs without manual DOM manipulation.
      </Text>

      <Text width="90%" align="center">
        Core State Features
      </Text>
      <Line width="90%" align="center" />

      <Text width="90%" align="left" gap={{ left: 4 }}>
        • State&lt;T&gt; — Generic reactive state container
      </Text>

      <Text width="90%" align="left" gap={{ left: 4 }}>
        • value — Get/set current state value
      </Text>

      <Text width="90%" align="left" gap={{ left: 4 }}>
        • subscribe() — Listen for state changes
      </Text>

      <Text width="90%" align="left" gap={{ left: 4 }}>
        • unsubscribe() — Remove change listener
      </Text>

      <Text width="90%" align="left" gap={{ left: 4 }}>
        • PersistentState&lt;T&gt; — State with localStorage persistence
      </Text>

      <Text width="90%" align="center" gap={{ top: 2, bottom: 1 }}>
        Simple counter example:
      </Text>

      <Text width="90%" align="center" gap={{ bottom: 1 }} wrap={false} border>
        {`
 const counter = new State(0);

 <Text>{counter}</Text>
 <Button onClick={() => counter.value++}>
   Increment
 </Button>
`}
      </Text>

      <Text width="90%" align="center" gap={{ bottom: 1 }}>
        Counter: {counter}
      </Text>

      <Row width="90%" align="center" gap={{ bottom: 2 }}>
        <Button hotkey="i" onClick={() => counter.value++}>
          Increment
        </Button>
        <Button hotkey="d" onClick={() => counter.value--}>
          Decrement
        </Button>
        <Button hotkey="r" onClick={() => (counter.value = 0)}>
          Reset
        </Button>
      </Row>

      <Text width="90%" align="center" gap={{ top: 1, bottom: 1 }}>
        Reactive input example:
      </Text>

      <TextInput
        width="90%"
        align="center"
        gap={{ bottom: 1 }}
        hotkey="e"
        value={inputValue}
      />

      <Text width="90%" align="center" gap={{ bottom: 1 }}>
        {message}
      </Text>

      <Text width="90%" align="center" gap={{ top: 2 }}>
        State Management Tips
      </Text>
      <Line width="90%" align="center" />

      <Text width="90%" align="left" gap={{ left: 4 }}>
        • Use State for values that change over time
      </Text>

      <Text width="90%" align="left" gap={{ left: 4 }}>
        • Pass State objects directly to component props
      </Text>

      <Text width="90%" align="left" gap={{ left: 4 }}>
        • Use PersistentState for values that should survive page reloads
      </Text>

      <Text width="90%" align="left" gap={{ left: 4 }}>
        • Subscribe manually for custom reactions to state changes
      </Text>

      <Text width="90%" align="left" gap={{ left: 4, bottom: 1 }}>
        • State changes automatically trigger component re-renders
      </Text>
    </Column>
  );
};
