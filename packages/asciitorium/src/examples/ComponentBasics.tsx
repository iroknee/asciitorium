import { Line, Column, Text } from "../index.js";
import { BaseStyle } from './constants.js';

/**
 * Component Basics
 *
 * Guide to creating custom components in asciitorium.
 */
export const ComponentBasics = () => {
  return (
    <Column style={BaseStyle} label="Component Basics">
      <Text width="90%" gap={{ bottom: 1, top: 2 }}>
        All components extend a base Component class. It provides sizing, rendering, focus handling, and state binding. This
        allows you to adjust a standard set of properties and behaviors across
        all components.
      </Text>

      <Text width="90%">
        Common Component Properties
      </Text>
      <Line width="90%" />

      {/* prettier-ignore */}
      <Text width="90%" gap={{ left: 6 }}>
        • width — width of Component ¶
        • height — height of component ¶
        • border — use a border? ¶
        • label — show a title in the border ¶
        • align — align component's children ¶
        • gap — Spacing within the component ¶
        • background — character to use as fill ¶
        • hotkey — keyboard shortcut for quick access ¶
        • visible — component visibility ¶
      </Text>

      <Text
        gap={1}
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
