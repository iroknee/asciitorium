import { Art, Line, Column, Text } from './index';
import { BaseStyle } from './constants';

/**
 * Component Basics
 *
 * Guide to creating custom components in asciitorium.
 */
export const ComponentBasics = () => {
  return (
    <Column style={BaseStyle} label="Component Basics">
      <Art gap={{ bottom: 1 }} src="components" align="left" />

      <Text width="90%" align="center" gap={{ bottom: 2 }}>
        The Component class is the foundation of all UI elements and they all
        extend this base class. It provides position management, layout,
        rendering, focus handling, and state binding.
      </Text>

      <Text width="90%" align="center">
        Common Component Properties
      </Text>
      <Line width="90%" align="center" />

      <Text width="90%" align="left" gap={{ left: 4 }}>
        • width — Component width
      </Text>

      <Text width="90%" align="left" gap={{ left: 4 }}>
        • height — Component height
      </Text>

      <Text width="90%" align="left" gap={{ left: 4 }}>
        • border — Border around component
      </Text>

      <Text width="90%" align="left" gap={{ left: 4 }}>
        • label — Border title (top centered)
      </Text>

      <Text width="90%" align="left" gap={{ left: 4 }}>
        • gap — Spacing around component
      </Text>

      <Text width="90%" align="left" gap={{ left: 4 }}>
        • align — Content alignment
      </Text>

      <Text width="90%" align="left" gap={{ left: 4 }}>
        • background — Fill character
      </Text>

      <Text width="90%" align="left" gap={{ left: 4 }}>
        • hotkey — Keyboard shortcut for quick access
      </Text>

      <Text width="90%" align="left" gap={{ left: 4 }}>
        • visible — Component visibility
      </Text>

      <Text width="90%" align="left" gap={{ left: 4 }}>
        • children — Child components
      </Text>

      <Text width="90%" align="center" gap={{ top: 2 }}>
        Simple component example:
      </Text>

      <Text width="90%" align="center" gap={{ bottom: 1 }} wrap={false} border>
        {`
 <Text label="Hi" align="center" border>
    Welcome to asciitorium!
 </Text>
`}
      </Text>

      <Text label="Hi" align="center" border>
        Welcome to asciitorium!
      </Text>
    </Column>
  );
};
