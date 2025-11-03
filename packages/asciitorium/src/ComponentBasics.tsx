import { Line, Column, Text } from './index.js';
import { BaseStyle } from './constants.js';

/**
 * Component Basics
 *
 * Guide to creating custom components in asciitorium.
 */
export const ComponentBasics = () => {
  return (
    <Column style={BaseStyle} label="Component Basics">
      <Text width="90%" align="center" gap={{ bottom: 1, top: 2 }}>
        All components extend the base Component class. It provides position
        management, layout, rendering, focus handling, and state binding. This
        allows you to adjust a standard set of properties and behaviors across
        all components.
      </Text>

      <Text width="90%" align="center">
        Common Component Properties
      </Text>
      <Line width="90%" align="center" />

      {/* prettier-ignore */}
      <Text width="90%" align="left" gap={{ left: 6 }}>
        • Width — width of Component ¶
        • Height — height of component ¶
        • Border — use a border? ¶
        • Label — show a title in the border ¶
        • Align — align Component ¶
        • Gap — Spacing within the component ¶
        • Background — fill character ¶
        • Hotkey — keyboard shortcut for quick access ¶
        • Visible — component visibility ¶
        • Children/Content — child / content
      </Text>

      <Text
        gap={2}
        width={32}
        label="Component Example"
        height={5}
        align="center"
        textAlign="center"
        border
      >
        Hello World!
      </Text>
    </Column>
  );
};
