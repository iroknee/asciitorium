import { Art, Line, Column, Row, Text, Button, State } from './index';
import { BaseStyle } from './constants';

/**
 * Navigation Basics
 *
 * Guide to keyboard navigation and focus management in asciitorium.
 */
export const NavigationBasics = () => {
  const counter = new State<number>(0);

  return (
    <Column style={BaseStyle} label="Navigation Basics">
      <Art gap={{ top: 1, bottom: 1 }} src="nav-basics" align="center" />

      <Text width="90%" align="center" gap={{ bottom: 2 }}>
        Asciitorium uses [Tab] + [Tab+Shift] for moving between focusable
        components. Some components can be focused on directly via hotkeys, such
        as Buttons. Focused components use a {'>'} key to indicate they have
        focus.
      </Text>

      <Text width="90%" align="center">
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

      <Text width="90%" align="center" gap={{ bottom: 1 }}>
        Try navigating between these buttons using [Tab], [Shift+Tab] or press [F1] to see their hotkeys:      </Text>

      <Column width="90%" align="center" border gap={{ bottom: 1 }}>
        <Text align="center" gap={{ top: 1, bottom: 1 }}>
          Counter: {counter}
        </Text>
      </Column>

      <Row width="80%" align="center" gap={{ bottom: 2 }}>
        <Button height={6} hotkey="a" onClick={() => counter.value++}>
          Increment
        </Button>

        <Button height={6} hotkey="s" onClick={() => counter.value--}>
          Decrement
        </Button>

      </Row>
    </Column>
  );
};
