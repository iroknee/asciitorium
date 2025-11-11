import {
  Art,
  Line,
  Column,
  Text,
  Keybind,
  State,
  MobileController,
} from './index.js';
import { BaseStyle } from './constants.js';

/**
 * Keybindings Basics
 *
 * Guide to using global keybindings and component hotkeys in asciitorium.
 */
export const KeybindingsBasics = () => {
  const message = new State<string>('Press X or Y on either the keyboard or mobile controller');

  const setMessage = (msg: string) => {
    message.value = msg;
    setTimeout(() => {
      message.value = 'Press X or Y on either the keyboard or mobile controller';
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

  const handleXButton = () => {
    setMessage('X pressed - Firework launched!');
    spawnFirework();
  };

  const handleYButton = () => {
    setMessage('Y pressed - Firework launched!');
    spawnFirework();
  };

  const container = (
    <Column style={BaseStyle} label="Keybindings & Mobile Basics">
      <Text width="90%" gap={{ bottom: 2, top: 1 }}>
        Asciitorium provides global Keybindings for app-level shortcuts in
        addition to Hotkeys. A virtual Mobile Controller
        component will show if being displayed on a touch devices
      </Text>

      <Text width="90%">Keybindings</Text>
      <Line width="90%" />

      <Text width="90%" gap={{ left: 4, bottom: 1 }}>
        Use the Keybind component to create global keyboard shortcuts that
        execute custom logic anywhere in your app.
      </Text>

      <Keybind
        keyBinding="x"
        action={handleXButton}
        description="Launch firework with X"
      />
      <Keybind
        keyBinding="y"
        action={handleYButton}
        description="Launch firework with Y"
      />
      <MobileController
        buttons={{
          x: handleXButton,
          y: handleYButton,
        }}
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

      <Text width="90%">Keybind Properties</Text>
      <Line width="90%" />

      {/* prettier-ignore */}
      <Text width="90%" gap={{ left: 6 }}>
        • keyBinding — Key to bind (e.g., "F12", "j", "Escape") ¶
        • action — Function to execute when key is pressed ¶
        • description — Optional description for documentation ¶
        • disabled — Disable keybinding (supports State for reactive control) ¶
      </Text>

      <Text width="90%">
        Tip: Keybindings are always global and work as long as the Keybind
        component is part of the app tree and not disabled. They automatically
        deactivate when their parent component is removed from the tree or when
        visibility is turned off.
      </Text>

      <Text width="90%" align="center" gap={{ top: 1 }}>
        Mobile Controller
      </Text>
      <Line width="90%" />
      <Text width="90%" gap={{ left: 4, bottom: 1 }}>
        The MobileController component lets you handle virtual D-pad and button
        events, making it possible to support touch devices. You
        can map D-pad directions and buttons (A/B/X/Y/Menu) to any actions in
        your app, just like with keybindings.
      </Text>
      
      <Text width="90%" gap={{ left: 6 }}>
        • dpad — up/down/left/right handlers ¶
        • action buttons — a/b/x/y handlers ¶
        • menu — Handler for the menu button ¶
        • enabled — Enable/disable the controller (can be reactive) ¶
        • priority — which input takes priority if multiple are present
      </Text>
    </Column>
  );

  return container;
};
