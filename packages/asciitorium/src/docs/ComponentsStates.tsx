import {
  Button,
  Column,
  Row,
  State,
  Text,
  ProgressBarSlider,
  Line,
} from '../index';
import { BaseStyle } from './constants';

/**
 * Components & States Guide
 *
 * Demonstrates available components and reactive state management.
 */
export const ComponentsStatesDoc = () => {
  const sliderValue = new State(50);

  const increment = () => {
    sliderValue.value = Math.min(100, sliderValue.value + 10);
  };

  const decrement = () => {
    sliderValue.value = Math.max(0, sliderValue.value - 10);
  };

  return (
    <Column style={BaseStyle} label="Components & State Management">
      <Text width="90%" align="left" gap={{ top: 1, left: 2 }}>
        Components
      </Text>
      <Line width="90%" align="left" gap={{ left: 2, bottom: 1 }} />

      <Text width="85%" align="center" gap={{ left: 2, bottom: 1 }}>
        Built-in components to enable a fairly rich ui including: Buttons, Text
        blocks, TextInput, Selectors, Tabs, Sliders and more.
      </Text>

      <Text width="90%" align="left" gap={{ top: 1, left: 2 }}>
        State Management
      </Text>
      <Line width="90%" align="left" gap={{ left: 2, bottom: 1 }} />
      <Text width="85%" align="center" gap={{ left: 2, bottom: 2 }}>
        These components pass reactive State objects that automatically trigger
        re-renders when modified.
      </Text>

      <Column
        label="State Change Example"
        align="center"
        width="90%"
        height={15}
        border
      >
        <Row gap={{ left: 6, top: 2, bottom: 1 }}>
          <Button hotkey="d" onClick={decrement}>
            Decrease
          </Button>
          <Button hotkey="i" onClick={increment}>
            Increase
          </Button>
        </Row>

        <ProgressBarSlider
          width={36}
          value={sliderValue}
          label="Value"
          gap={{ left: 4 }}
        />

        <Text width={4} height={3} align="center">
          {sliderValue}
        </Text>
      </Column>

      <Text align="center" gap={{ bottom: 1 }}>
        Press [`] to make hotkeys visible
      </Text>
    </Column>
  );
};
