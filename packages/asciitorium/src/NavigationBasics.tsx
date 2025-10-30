import { Art, Line, Column, Row, Text, Button } from './index';
import { BaseStyle } from './constants';

/**
 * Navigation Basics
 *
 * Guide to keyboard navigation and focus management in asciitorium.
 */
export const NavigationBasics = () => {

  const spawnFirework = () => {
    // Random position within a reasonable range
    const x = Math.floor(Math.random() * 60) + 10;
    const y = Math.floor(Math.random() * 20) + 5;

    const firework = new Art({
      src: 'firework',
      position: { x, y, z: 10 },
    });

    container.addChild(firework);

    // Remove firework after animation completes (~800ms for 8 frames at 100ms each)
    setTimeout(() => {
      container.removeChild(firework);
    }, 800);
  };

  const container = (
    <Column style={BaseStyle} label="Navigation Basics">
      <Art gap={{ top: 1, bottom: 1 }} src="nav-basics" align="center" />

      <Text width="90%" align="center" gap={{ bottom: 2 }}>
        {`Asciitorium uses [Tab] + [Tab+Shift] for moving between focusable components. In addition, components can befocused accessed directly via hotkeys. Focused components use a '>' to indicate focus.`}
      </Text>

      <Text width="90%" align="center">
        Navigation Methods
      </Text>
      <Line width="90%" align="center" />

      <Text width="90%" align="left" gap={{ left: 4 }}>
        • Tab — Move focus to next component
      </Text>

      <Text width="90%" align="left" gap={{ left: 4 }}>
        • Shift+Tab — Move focus to previous component
      </Text>

      <Text width="90%" align="left" gap={{ left: 4 }}>
        • F1 or ` — Toggle hotkey visibility
      </Text>

      <Text width="90%" align="left" gap={{ left: 4 }}>
        • Letter keys — Jump directly to component with matching hotkey
      </Text>

      <Text width="90%" align="center" gap={{ top: 2, bottom: 1 }}>
        Try navigating between these buttons:
      </Text>

      <Row width="90%" align="center" gap={{ bottom: 2 }}>
        <Button height={6} hotkey="a" onClick={spawnFirework}>
          Button A
        </Button>

        <Button height={6} hotkey="b" onClick={spawnFirework}>
          Button B
        </Button>

        <Button height={6} hotkey="c" onClick={spawnFirework}>
          Button C
        </Button>
      </Row>
    </Column>
  );

  return container;
};
