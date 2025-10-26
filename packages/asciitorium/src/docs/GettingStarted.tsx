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

      <Art gap={1} src="welcome" align="center" />

      <Text width="90%" align="center" gap={{ bottom: 2 }}>
        Asciitorium is an ASCII based CLUI (Command Line User Interface) & game
        framework that runs in both web browsers and terminals while enabling
        react-like development. Important concepts include:
      </Text>

      <Text width="90%" align="left" gap={{ left: 6, bottom: 1 }}>
        1. Keybindings & Navigation
      </Text>

      <Text width="90%" align="left" gap={{ left: 6, bottom: 1 }}>
        2. Components & States
      </Text>

      <Text width="90%" align="left" gap={{ left: 6, bottom: 1 }}>
        3. Layouts & Styles
      </Text>

      <Text width="90%" align="left" gap={{ left: 6, bottom: 1 }}>
        4. Game Controllers & Views
      </Text>
    </Column>
  );
};
