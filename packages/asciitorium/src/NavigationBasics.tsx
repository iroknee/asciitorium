import {
  Art,
  Line,
  Column,
  Row,
  Text,
  Button,
  State,
  ProgressBarSlider,
  DotSlider,
  GaugeSlider,
} from './index.js';
import { BaseStyle } from './constants.js';

/**
 * Navigation Basics
 *
 * Guide to keyboard navigation and focus management in asciitorium.
 */
export const NavigationBasics = () => {
  const counter = new State<number>(0);

  return (
    <Column style={BaseStyle} label="Navigation Basics">
      <Art gap={{ top: 1, bottom: 1 }} src="nav-basics" />

      <Text width="90%" gap={{ bottom: 2 }}>
        Asciitorium uses [Tab] + [Tab+Shift] for moving between focusable
        components. Some components can be focused on directly via hotkeys, such
        as Buttons. Focused components use a {'>'} key to indicate they have
        focus.
      </Text>

      <Text width="90%">
        Navigation Keys
      </Text>
      <Line width="90%" />

      {/* prettier-ignore */}
      <Text width="90%" gap={{ left: 6 }}>
        • Tab — Move focus to next focusable component ¶
        • Shift+Tab — Move focus to previous component ¶
        • F1 or ` — Toggle hotkey visibility ¶
        • Letter keys — Jump to component with matching Hotkey ¶
        • Enter/Space — Activate focused buttons or toggles ¶
        • Arrow keys — Component-specific navigation (e.g., Select, Tabs) ¶
      </Text>

      <Text width="90%" gap={{ bottom: 1 }}>
        Try navigating between these buttons using [Tab], [Shift+Tab] or press
        [F1] to see their hotkeys:{' '}
      </Text>

      <Column width="90%" align="center" gap={{ bottom: 1 }}>
        <ProgressBarSlider
          width={50}
          align="center"
          gap={{ bottom: 1 }}
          value={counter}
          min={0}
          max={20}
        />
        <DotSlider
          width={50}
          align="center"
          gap={{ bottom: 1 }}
          value={counter}
          min={0}
          max={20}
        />

        <GaugeSlider
          width={50}
          align="center"
          gap={{ bottom: 1 }}
          value={counter}
          min={0}
          max={20}
        />
      </Column>

      <Row width="fill" align="center" gap={{ bottom: 2 }}>
        <Button
          height={6}
          hotkey="a"
          onClick={() => {
            if (counter.value > 0) counter.value--;
          }}
        >
          Decrement
        </Button>
        <Button
          height={6}
          hotkey="s"
          onClick={() => {
            if (counter.value < 20) counter.value++;
          }}
        >
          Increment
        </Button>
      </Row>
    </Column>
  );
};
