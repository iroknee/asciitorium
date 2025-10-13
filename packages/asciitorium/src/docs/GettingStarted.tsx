import { Art, Column, Text } from '../index';
import { BaseStyle } from './constants';

/**
 * Getting Started Guide
 *
 * Welcome documentation for new developers using asciitorium.
 */
export const GettingStartedDoc = () => {
  return (
    <Column style={BaseStyle} label="Getting Started">
      <Text align="center" gap={1}>
        Welcome to Asciitorium!
      </Text>

      <Art gap={1} src="castle" align="center" />

      <Text width="90%" align="left" gap={{ left: 2, bottom: 2 }}>
        Asciitorium is an ASCII-based ui and game framework that runs in
        both web browsers and CLI environments. It uses 
        React-like JSX syntax with zero dependencies. Important concepts include:
      </Text>

      <Text width="90%" align="left" gap={{ left: 4, bottom: 1 }}>
        1. Components & States
      </Text>

      <Text width="90%" align="left" gap={{ left: 4, bottom: 1 }}>
        2. Layouts & Styles
      </Text>

      <Text width="90%" align="left" gap={{ left: 4, bottom: 1 }}>
        3. Keybindings & Navigation
      </Text>

      <Text width="90%" align="left" gap={{ left: 4, bottom: 1 }}>
        4. Game Controllers & Views
      </Text>

      <Text align="center" gap={{ top: 2 }}>
        Select a component from the left menu to see it in action!
      </Text>
    </Column>
  );
};
