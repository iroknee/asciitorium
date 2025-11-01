import { Line, Column, Row, Text, Button, Keybind, State } from './index';
import { BaseStyle } from './constants';

/**
 * Keybindings Basics
 *
 * Guide to using global keybindings and component hotkeys in asciitorium.
 */
export const KeybindingsBasics = () => {
  const message = new State<string>('Press J, K, or L to trigger keybindings');
  const counter = new State<number>(0);

  const setMessage = (msg: string) => {
    message.value = msg;
    setTimeout(() => {
      message.value = 'Press J, K, or L to trigger keybindings';
    }, 2000);
  };

  return (
    <Column style={BaseStyle} label="Keybindings Basics">
      <Text width="90%" align="center" gap={{ bottom: 2, top: 2 }}>
        Asciitorium provides two keyboard systems: Global Keybindings for
        app-level shortcuts and Hotkeys for quick component navigation.
      </Text>

      <Text width="90%" align="center">
        Global Keybindings (Keybind Component)
      </Text>
      <Line width="90%" align="center" />

      <Text width="90%" align="left" gap={{ left: 4, top: 1, bottom: 1 }}>
        Use the Keybind component to create global keyboard shortcuts that
        execute custom logic anywhere in your app.
      </Text>

      <Keybind
        keyBinding="j"
        action={() => {
          setMessage('J pressed - Decremented counter!');
          counter.value--;
        }}
        description="Decrement counter"
      />
      <Keybind
        keyBinding="k"
        action={() => {
          setMessage('K pressed - Reset counter!');
          counter.value = 0;
        }}
        description="Reset counter"
      />
      <Keybind
        keyBinding="l"
        action={() => {
          setMessage('L pressed - Incremented counter!');
          counter.value++;
        }}
        description="Increment counter"
      />

      <Column width="90%" align="center" border gap={{ bottom: 2 }}>
        <Text align="center" gap={{ top: 1 }}>
          {counter}
        </Text>
        <Text align="center" textAlign="center" width="80%" gap={{ bottom: 1 }}>
          {message}
        </Text>
      </Column>

      <Text width="90%" align="center">
        Component Hotkeys
      </Text>
      <Line width="90%" align="center" />

      <Text width="90%" align="left" gap={{ left: 4, top: 1, bottom: 1 }}>
        Focusable components can have hotkeys assigned for quick access. Press
        [F1] or [`] to toggle hotkey visibility, then press the letter key to
        jump directly to that component.
      </Text>

      <Row width="90%" align="center" gap={{ bottom: 2 }}>
        <Button
          hotkey="a"
          onClick={() => setMessage('Button A clicked!')}
        >
          Button A
        </Button>
        <Button
          hotkey="b"
          onClick={() => setMessage('Button B clicked!')}
        >
          Button B
        </Button>
        <Button
          hotkey="c"
          onClick={() => setMessage('Button C clicked!')}
        >
          Button C
        </Button>
      </Row>

      <Text width="90%" align="center" gap={{ top: 2 }}>
        Navigation Keys
      </Text>
      <Line width="90%" align="center" />

      <Text width="90%" align="left" gap={{ left: 4 }}>
        • Tab — Move focus to next focusable component
      </Text>
      <Text width="90%" align="left" gap={{ left: 4 }}>
        • Shift+Tab — Move focus to previous component
      </Text>
      <Text width="90%" align="left" gap={{ left: 4 }}>
        • F1 or ` — Toggle hotkey visibility
      </Text>
      <Text width="90%" align="left" gap={{ left: 4 }}>
        • Letter keys — Jump to component with matching hotkey
      </Text>
      <Text width="90%" align="left" gap={{ left: 4 }}>
        • Enter/Space — Activate focused button
      </Text>
      <Text width="90%" align="left" gap={{ left: 4, bottom: 2 }}>
        • Arrow keys — Component-specific navigation (e.g., Select, Tabs)
      </Text>

      <Text width="90%" align="center" gap={{ top: 2 }}>
        Keybind Properties
      </Text>
      <Line width="90%" align="center" />

      <Text width="90%" align="left" gap={{ left: 4 }}>
        • keyBinding — Key to bind (e.g., "F12", "j", "Escape")
      </Text>
      <Text width="90%" align="left" gap={{ left: 4 }}>
        • action — Function to execute when key is pressed
      </Text>
      <Text width="90%" align="left" gap={{ left: 4 }}>
        • description — Optional description for documentation
      </Text>
      <Text width="90%" align="left" gap={{ left: 4, bottom: 2 }}>
        • disabled — Disable keybinding (supports State for reactive control)
      </Text>

      <Text width="90%" align="center" gap={{ top: 2 }}>
        Reserved Keys
      </Text>
      <Line width="90%" align="center" gap={{ bottom: 1 }} />

      <Text width="90%" align="left" gap={{ left: 4, bottom: 2 }}>
        Arrow keys, Tab, Enter, Space, Escape, Backspace, Delete, Home, End,
        PageUp, and PageDown are reserved for component navigation and should
        not be used for hotkeys.
      </Text>

      <Text width="90%" align="center" gap={{ top: 1 }}>
        Tip: Keybindings are always global and work as long as the Keybind
        component is part of the app tree and not disabled.
      </Text>
    </Column>
  );
};
