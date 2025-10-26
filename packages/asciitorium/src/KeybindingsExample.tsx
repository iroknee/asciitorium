import { Column, State, Text, Keybind, Line, loadArt, Art } from './index';
import { BaseStyle } from './constants';

/**
 * Keybindings & Hot Keys Guide
 *
 * Demonstrates global keybindings and component hotkeys for keyboard navigation.
 */
export const KeybindingsExample = () => {
  const eyes = new State<string>('left');

  const look = (direction) => {
    eyes.value = direction;
  };

  return (
    <Column style={BaseStyle} label="Keybindings & Hot Keys">
      <Text width="90%" align="left" gap={{ top: 1, left: 2 }}>
        Global/Local Keybindings
      </Text>
      <Line width="90%" align="left" gap={{ left: 2, bottom: 1 }} />
      <Keybind keyBinding="j" action={look('left')} />
      <Keybind keyBinding="k" action={look('center')} />
      <Keybind keyBinding="l" action={look('right')} />
      <Art src="eyes" gap={{ bottom: 1 }} />
      <Text width="85%" align="center" gap={{ left: 2, bottom: 1 }}>
        asciitorium enables binding key presses to any custom logic to enable
        quick and responsive experience. Try pushing the [J] [K] [L] keys.
      </Text>

      <Text width="90%" align="left" gap={{ top: 1, left: 2 }}>
        Hot Keys
      </Text>
      <Line width="90%" align="left" gap={{ left: 2, bottom: 1 }} />

      <Text width="85%" align="center" gap={{ left: 2, bottom: 1 }}>
        Hotkeys jump focus to components that support focus. Press [`] or [F1]
        to toggle hotkey visibility. Press the letter key to jump directly to
        that component.
      </Text>

      <Text align="center" gap={1}>
        Press [`] to make hotkeys visible • Tab/Shift+Tab to navigate
      </Text>
    </Column>
  );
};
