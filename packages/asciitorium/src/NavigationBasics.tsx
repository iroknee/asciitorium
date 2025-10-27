import { Art, Line, Column, Row, Text, Button, State } from './index';
import { BaseStyle } from './constants';

/**
 * Navigation Basics
 *
 * Guide to keyboard navigation and focus management in asciitorium.
 */
export const NavigationBasics = () => {
  const message = new State('Press Tab to navigate between buttons');

  return (
    <Column style={BaseStyle} label="Navigation Basics">
      <Art gap={{ top: 1, bottom: 1 }} src="nav-basics" align="center" />

      <Text width="90%" align="center" gap={{ bottom: 2 }}>
        {`Asciitorium uses [Tab] + [Shift+Tab] for moving between focusable components. In addition, components can befocused accessed directly via hotkeys. Focused components use a '>' to indicate focus.`}
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

      <Text width="90%" align="center" gap={{ top: 2 }}>
        Try navigating between these buttons:
      </Text>

      <Row width="90%" align="center" gap={{ bottom: 2 }}>
        <Button
          hotkey="a"
          onClick={() => (message.value = 'Button A activated!')}
        >
          Button A
        </Button>

        <Button
          hotkey="b"
          onClick={() => (message.value = 'Button B activated!')}
        >
          Button B
        </Button>

        <Button
          hotkey="c"
          onClick={() => (message.value = 'Button C activated!')}
        >
          Button C
        </Button>
      </Row>

      <Text width="90%" align="center" border>
        {message}
      </Text>

      <Text width="90%" align="center" gap={{ top: 2 }}>
        For implementation details, see
        packages/asciitorium/src/core/FocusManager.ts
      </Text>
    </Column>
  );
};
