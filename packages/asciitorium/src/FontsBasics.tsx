import { Art, Line, Column, Text } from './index';
import { BaseStyle } from './constants';

/**
 * Fonts Basics
 *
 * Guide to using ASCII fonts in asciitorium.
 */
export const FontsBasics = () => {
  return (
    <Column style={BaseStyle} label="Fonts Basics">
      <Art gap={{ top: 2, bottom: 2 }} src="asciitorium" align="center" />

      <Text width="90%" align="center" gap={{ bottom: 2, top: 2 }}>
        ASCII fonts are pre-rendered text art stored as sprites, allowing you
        to display stylized text and logos in your applications.
      </Text>

      <Text width="90%" align="center">
        What are ASCII Fonts?
      </Text>
      <Line width="90%" align="center" />

      <Text width="90%" align="left" gap={{ left: 4, top: 1 }}>
        ASCII fonts are special sprite files that contain artistic renderings
        of text. Unlike standard fonts, these are hand-crafted ASCII art pieces
        that can include decorative elements, shadows, and unique styling.
      </Text>

      <Text width="90%" align="left" gap={{ left: 4, bottom: 2 }}>
        Fonts are stored in the art/sprites/ directory just like other sprites
        and are loaded using the Art component.
      </Text>

      <Text width="90%" align="center" gap={{ top: 2 }}>
        Using Fonts
      </Text>
      <Line width="90%" align="center" />

      <Text width="90%" align="left" gap={{ left: 4, top: 1 }}>
        Display font art using the Art component with the src property:
      </Text>

      <Text width="90%" align="left" gap={{ left: 4, top: 1, bottom: 2 }}>
        {`<Art src="asciitorium" align="center" />`}
      </Text>

      <Text width="90%" align="center" gap={{ top: 2 }}>
        Common Use Cases
      </Text>
      <Line width="90%" align="center" />

      <Text width="90%" align="left" gap={{ left: 4 }}>
        • Application logos and branding
      </Text>
      <Text width="90%" align="left" gap={{ left: 4 }}>
        • Title screens and splash pages
      </Text>
      <Text width="90%" align="left" gap={{ left: 4 }}>
        • Section headers and banners
      </Text>
      <Text width="90%" align="left" gap={{ left: 4, bottom: 2 }}>
        • Game titles and credits
      </Text>

      <Text width="90%" align="center" gap={{ top: 1 }}>
        TIP: Create your own font art using ASCII art generators or draw them
        by hand in a text editor. Save them as .art files in the sprites
        directory.
      </Text>
    </Column>
  );
};
