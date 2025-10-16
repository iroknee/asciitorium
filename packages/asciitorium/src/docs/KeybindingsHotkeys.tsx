import {
  Button,
  Column,
  Row,
  State,
  Text,
  Keybind,
  Line,
  TextInput,
} from '../index';
import { BaseStyle } from './constants';

/**
 * Keybindings & Hot Keys Guide
 *
 * Demonstrates global keybindings and component hotkeys for keyboard navigation.
 */
export const KeybindingsHotkeysDoc = () => {
  const inputValue = new State('');
  const submittedValue = new State('');
  const keybindEnabled = new State(true);

  const submit = () => {
    submittedValue.value = inputValue.value;
  };

  const clear = () => {
    inputValue.value = '';
    submittedValue.value = '';
  };

  const toggleKeybind = () => {
    keybindEnabled.value = !keybindEnabled.value;
  };

  return (
    <Column style={BaseStyle} label="Keybindings & Hot Keys">
      <Text width="90%" align="left" gap={{ top: 1, left: 2 }}>
        Global/Local Keybindings
      </Text>
      <Line width="90%" align="left" gap={{ left: 2, bottom: 1 }} />
      <Text width="85%" align="center" gap={{ left: 2, bottom: 1 }}>
        asciitorium does NOT support mouse events but instead exposes a
        Keybinding and HotKey components enabling your app to call custom
        actions or logic.
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

      <Column
        label="Example"
        align="center"
        width="fill"
        gap={1}
        height={19}
        border
      >
        <Keybind
          keyBinding="Enter"
          action={submit}
          global
          disabled={!keybindEnabled.value}
        />
        <Keybind
          keyBinding="Escape"
          action={clear}
          global
          disabled={!keybindEnabled.value}
        />

        <TextInput
          gap={{ top: 1 }}
          hotkey="n"
          value={inputValue}
          width="fill"
          placeholder="Enter your name"
        />

        <Row width="fill" gap={{ top: 1 }}>
          <Text width="fill" />
          <Button hotkey="s" onClick={submit}>
            Submit
          </Button>
          <Button hotkey="c" onClick={clear} gap={{ right: 2 }}>
            Clear
          </Button>
        </Row>

        <Text label="Saved Data" gap={1} width="fill" height={5} border>
          {submittedValue}
        </Text>
      </Column>

      <Text align="center" gap={1}>
        Press [`] to make hotkeys visible • Tab/Shift+Tab to navigate
      </Text>
    </Column>
  );
};
