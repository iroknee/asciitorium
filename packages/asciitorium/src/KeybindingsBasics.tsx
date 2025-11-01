import { Art, Line, Column, Row, Text, Button, Keybind, State } from './index';
import { BaseStyle } from './constants';

/**
 * Keybindings Basics
 *
 * Guide to using global keybindings and component hotkeys in asciitorium.
 */
export const KeybindingsBasics = () => {
  const message = new State<string>('Press J, K, or L to trigger keybindings');

  const setMessage = (msg: string) => {
    message.value = msg;
    setTimeout(() => {
      message.value = 'Press J, K, or L to trigger keybindings';
    }, 2000);
  };

  const spawnFirework = () => {
    // Random position within a reasonable range
    const x = Math.floor(Math.random() * 60) + 10;
    const y = Math.floor(Math.random() * 20) + 5;

    const firework = new Art({
      src: 'firework',
      position: { x, y },
    });

    container.addChild(firework);

    // Remove firework after animation completes (~800ms for 8 frames at 100ms each)
    setTimeout(() => {
      container.removeChild(firework);
    }, 800);
  };

  const container = (
    <Column style={BaseStyle} label="Keybindings Basics">
      <Text width="90%" align="center" gap={{ bottom: 2, top: 2 }}>
        Asciitorium provides two keyboard systems: global Keybindings for
        app-level shortcuts and Hotkeys for quick component navigation (see Component Navigation).
        Use keybindings when you just want an action to occur, but want to maintain focus on the given component, and hotkeys when you want to focus a specific component.
      </Text>

      <Text width="90%" align="center">
        Keybindings
      </Text>
      <Line width="90%" align="center" />

      <Text width="90%" align="left" gap={{ left: 4, top: 1, bottom: 1 }}>
        Use the Keybind component to create global keyboard shortcuts that
        execute custom logic anywhere in your app.
      </Text>

      <Keybind
        keyBinding="j"
        action={() => {
          setMessage('J key pressed - Firework launched!');
          spawnFirework();
        }}
        description="Launch firework with J"
      />
      <Keybind
        keyBinding="k"
        action={() => {
          setMessage('K key pressed - Firework launched!');
          spawnFirework();
        }}
        description="Launch firework with K"
      />
      <Keybind
        keyBinding="l"
        action={() => {
          setMessage('L key pressed - Firework launched!');
          spawnFirework();
        }}
        description="Launch firework with L"
      />

      <Column width="90%" align="center" border gap={{ bottom: 2 }}>
        <Text align="center" textAlign="center" width="80%" gap={{ top: 1, bottom: 1 }}>
          {message}
        </Text>
      </Column>

      <Text width="90%" align="center">
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

      <Text width="90%" align="center">
        Reserved Keys
      </Text>
      <Line width="90%" align="center" gap={{ bottom: 1 }} />

      <Text width="90%" align="left" gap={{ left: 4, bottom: 2 }}>
        Arrow keys, Tab, Enter, Space, Delete, Home, End,
        PageUp, and PageDown are reserved for component navigation and should
        not be used for hotkeys.
      </Text>

      <Text width="90%" align="center" gap={{ top: 1 }}>
        Tip: Keybindings are always global and work as long as the Keybind
        component is part of the app tree and not disabled. They automatically
        deactivate when their parent component is removed from the tree or when
        visibility is turned off.
      </Text>
    </Column>
  );

  return container;
};
