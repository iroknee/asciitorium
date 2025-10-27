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
        Asciitorium is an ASCII-based CLUI (Command Line User Interface)
        framework for building interactive applications that run in both web
        browsers and terminals.
      </Text>

      <Text width="90%" align="center">
        To view the documentation, use the Select menu on the left to explore
        components, layouts, and features. Navigate with:
      </Text>
      <Text width="90%" align="center" gap={{ top: 2, bottom: 2, left: 2 }}>
        {`• [↑],[↓] keys to navigate within the menu,
          • [Enter] to select a documentation item.`}
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
