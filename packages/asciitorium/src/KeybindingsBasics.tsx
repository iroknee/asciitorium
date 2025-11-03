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
      <Text width="90%" align="center" gap={{ bottom: 2, top: 1 }}>
        Asciitorium provides global Keybindings for app-level shortcuts in
        addition to Hotkeys. Use keybindings when you just want an action to
        occur, but want to maintain focus on the given component.
      </Text>

      <Text width="90%" align="center">
        Keybindings
      </Text>
      <Line width="90%" align="center" />

      <Text width="90%" align="left" gap={{ left: 4, bottom: 1 }}>
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
        <Text
          align="center"
          textAlign="center"
          width="80%"
          gap={{ top: 1, bottom: 1 }}
        >
          {message}
        </Text>
      </Column>

      <Text width="90%" align="center">
        Keybind Properties
      </Text>
      <Line width="90%" align="center" />

      {/* prettier-ignore */}
      <Text width="90%" align="left" gap={{ left: 6 }}>
        • keyBinding — Key to bind (e.g., "F12", "j", "Escape") ¶
        • action — Function to execute when key is pressed ¶
        • description — Optional description for documentation ¶
        • disabled — Disable keybinding (supports State for reactive control) ¶
      </Text>

      <Text width="90%" align="center">
        Reserved Keys
      </Text>
      <Line width="90%" align="center" />

      <Text width="90%" align="left" gap={{ left: 4, bottom: 1 }}>
        Arrow keys, Tab, Enter, Space, Delete, Home, End, PageUp, and PageDown
        are reserved for component navigation and should not be used for
        hotkeys.
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
