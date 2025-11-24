import { Banner, Line, Column, Text } from "../index.js";
import { BaseStyle } from './constants.js';

/**
 * Guide to using Asciitorium Fonts.
 */
export const FontsBasics = () => {
  return (
    <Column style={BaseStyle} label="Fonts Basics">
      <Banner
        font="pencil"
        text="asciitorium"
        letterSpacing={0}
        align="center"
      />
      <Banner
        font="marker"
        text="asciitorium"
        letterSpacing={1}
        align="center"
      />
      <Banner
        font="pixel"
        text="asciitorium"
        letterSpacing={1}
        align="center"
      />
      <Banner
        font="shadows"
        text="asciitorium"
        letterSpacing={0}
        align="center"
      />

      <Text width="90%" gap={{ bottom: 2 }}>
        Asciitorium Fonts are text art sprites, allowing you to display large
        letter phrases from ASCII characters. ¶¶ Fonts are stored in the
        art/font/ directory with the .art extension, like other asciitorium
        assets. The Banner component loads and displays fonts by specifying the
        font property.
      </Text>

      <Text width="90%">
        * To create your own font art review the documentation in public/art
        directory.
      </Text>
    </Column>
  );
};
