import { Line, Column, Text } from './index';
import { BaseStyle } from './constants';

/**
 * Component Basics
 *
 * Guide to creating custom components in asciitorium.
 */
export const ComponentBasics = () => {
  return (
    <Column style={BaseStyle} label="Component Basics">
      <Text width="90%" align="center" gap={{ bottom: 2, top: 2 }}>
        All components extend the base Component class. It provides position
        management, layout, rendering, focus handling, and state binding. This
        allows you to adjust a standard set of properties and behaviors across
        all components.
      </Text>

      <Text width="90%" align="center">
        Common Component Properties
      </Text>
      <Line width="90%" align="center" />

      <Text width="90%" align="left" gap={{ left: 4 }}>
        • Width — width of component
      </Text>

      <Text width="90%" align="left" gap={{ left: 4 }}>
        • Height — height of component
      </Text>

      <Text width="90%" align="left" gap={{ left: 4 }}>
        • Border — use a border?
      </Text>

      <Text width="90%" align="left" gap={{ left: 4 }}>
        • Label — show a title in the border
      </Text>

      <Text width="90%" align="left" gap={{ left: 4 }}>
        • Align — align component
      </Text>

      <Text width="90%" align="left" gap={{ left: 4 }}>
        • Gap — Spacing within the component
      </Text>

      <Text width="90%" align="left" gap={{ left: 4 }}>
        • Background — fill character
      </Text>

      <Text width="90%" align="left" gap={{ left: 4 }}>
        • Hotkey — keyboard shortcut for quick access
      </Text>

      <Text width="90%" align="left" gap={{ left: 4 }}>
        • Visible — component visibility
      </Text>

      <Text width="90%" align="left" gap={{ left: 4, bottom: 2 }}>
        • Children/Content — child / content
      </Text>


      <Text width="90%" label="Component Example" height={5} align="center" textAlign="center" border>
        Hello World!
      </Text>
    </Column>
  );
};
