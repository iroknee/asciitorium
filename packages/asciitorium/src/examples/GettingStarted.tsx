import { Art, Column, Text } from "../index.js";
import { BaseStyle } from './constants.js';

/**
 * Getting Started Guide
 *
 * Welcome documentation for new developers using asciitorium.
 */
export const GettingStarted = () => {
  return (
    <Column style={BaseStyle} label="Getting Started">
      <Art gap={{ top: 1, bottom: 1 }} sprite="welcome" />

      <Text width="80%">
        Asciitorium is an ASCII-based CLUI (Command Line User Interface)
        framework for building interactive applications that run in both web
        browsers and terminals. ¶¶ Asciitorium is both a Component Framework and
        a lightweight ASCII art and game engine. You can build UIs with reactive
        components, create ASCII art with sprites and materials, or develop
        retro-style games with first-person rendering and map-based movement
        systems.¶¶ To view the documentation, use the Select menu on the left to
        explore components, layouts, and features. Navigate with: ¶¶
        {`• [↑],[↓] keys to navigate within the menu,
        • [Enter] to select a documentation item.`}
        ¶¶ We hope you enjoy building ASCII experiences with Asciitorium!
      </Text>

      <Text width="80%" textAlign="right">
        - The Asciitorium Team
      </Text>
    </Column>
  );
};
