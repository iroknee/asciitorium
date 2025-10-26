import { Art, Column, Text } from './index';
import { BaseStyle } from './constants';

/**
 * ASCII Art Overview
 *
 * Guide to creating and managing ASCII art assets in asciitorium.
 */
export const AsciiArt = () => {
  return (
    <Column style={BaseStyle} label="Ascii Art">
      <Art gap={{ top: 2, bottom: 2 }} src="balloon" align="center" />

      <Text width="90%" align="center" gap={{ bottom: 2 }}>
        Asciitorium uses three types of ASCII art assets: sprites, materials,
        and maps. All assets live in the public/art/ directory.
      </Text>

      <Text width="90%" align="center" gap={{ bottom: 2 }}>
        Sprites are animated ASCII art stored in art/sprites/. They support
        multiple frames with timing control and are used for characters,
        creatures, and UI elements.
      </Text>

      <Text width="90%" align="center" gap={{ bottom: 2 }}>
        Materials are layered textures in art/materials/ used for first-person
        rendering. They define visual representations at different distances
        (here, near, middle, far).
      </Text>

      <Text width="90%" align="center" gap={{ bottom: 2 }}>
        Maps are game environments in art/maps/ with a map.art layout file and
        legend.json defining what each character represents, including collision
        and entity properties.
      </Text>

      <Text width="90%" align="center" gap={{ bottom: 2 }}>
        Assets use special markers: § for global properties and ¶ to separate
        frames/layers. See public/art/ART-DESIGN-SPEC.md for details.
      </Text>
    </Column>
  );
};
