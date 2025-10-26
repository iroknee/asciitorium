import { Art, Column, Text } from './index';
import { BaseStyle } from './constants';

/**
 * Getting Started Guide
 *
 * Welcome documentation for new developers using asciitorium.
 */
export const GettingStarted = () => {
  return (
    <Column style={BaseStyle} label="Getting Started">
      <Art gap={{ top: 2, bottom: 4 }} src="welcome" align="center" />

      <Text width="90%" align="center" gap={{ bottom: 2 }}>
        Asciitorium is an ASCII CLUI (Command Line User Interface) framework for
        building interactive applications and games that run in both web browsers
        and terminals.
      </Text>

      <Text width="90%" align="center" gap={{ bottom: 2 }}>
        Use the Select menu on the left to explore components, layouts, and
        features. Navigate with Tab/Shift+Tab between components, arrow keys
        within menus, and Enter to select. Press F1 or ` to toggle hotkeys.
      </Text>

      <Text width="90%" align="center" gap={{ bottom: 2 }}>
        We hope you enjoy building ASCII experiences with Asciitorium!
      </Text>

      <Text align="right" gap={{ top: 4, right: 4 }}>
        - The Asciitorium Team
      </Text>
    </Column>
  );
};
