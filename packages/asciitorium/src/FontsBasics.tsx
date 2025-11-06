import { Art, Line, Column, Text } from './index.js';
import { BaseStyle } from './constants.js';

/**
 * Guide to using Asciitorium Fonts.
 */
export const FontsBasics = () => {
  return (
    <Column style={BaseStyle} label="Fonts Basics">
      <Art
        gap={{ top: 2 }}
        font="marker"
        text="opqrstuvwxyz"
        letterSpacing={1}
        align="center"
      />

      <Text width="90%" align="center" gap={{ bottom: 2 }}>
        Asciitorium Fonts are text art sprites, allowing you to display large
        letter phrases from ASCII characters. ¶¶ Fonts are stored in the
        art/fonts/ directory with the .art extension, like other asciitorium
        assets. The Art component loads and displays fonts by specifying the
        font property.
      </Text>

      <Text width="90%" align="center">
        Using Fonts
      </Text>
      <Line width="90%" align="center" />

      <Text width="90%" align="left" gap={{ left: 4 }}>
        Display font art using the Art component with the text property:
      </Text>
      <Art font="pencil" text="Hello World" align="center" />
      <Text
        width={48}
        align="center"
        textAlign="center"
        gap={{ left: 4, top: 1 }}
        border
      >
        {`<Art font="pencil" text="Hello World" align="center" />`}
      </Text>

      <Text width="90%" align="center" gap={{ top: 2 }}>
        Common Use Cases
      </Text>
      <Line width="90%" align="center" />

      <Text width="90%" align="left" gap={{ left: 6 }}>
        • Title screens and splash pages ¶ • Section headers and banners ¶ •
        Game titles and credits ¶
      </Text>

      <Text width="90%" align="center" gap={{ top: 1 }}>
        * To create your own font art review the documentation in public/art
        directory.
      </Text>
    </Column>
  );
};
