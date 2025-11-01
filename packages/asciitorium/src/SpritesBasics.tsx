import { Art, Line, Column, Text } from './index';
import { BaseStyle } from './constants';

/**
 * Sprites Basics
 *
 * Guide to using animated ASCII sprites in asciitorium.
 */
export const SpritesBasics = () => {
  return (
    <Column style={BaseStyle} label="Sprites Basics">
      <Art gap={{ top: 2, bottom: 2 }} src="firework" align="center" />

      <Text width="90%" align="center" gap={{ bottom: 2, top: 2 }}>
        Sprites are animated ASCII art assets that can represent characters,
        creatures, effects, and other dynamic game entities.
      </Text>

      <Text width="90%" align="center">
        What are Sprites?
      </Text>
      <Line width="90%" align="center" />

      <Text width="90%" align="left" gap={{ left: 4, top: 1 }}>
        Sprites store animated sprite files for characters, creatures, and other
        game entities. Sprites support multiple frames with configurable timing
        and can be referenced by map legends for dynamic visual representation.
      </Text>

      <Text width="90%" align="left" gap={{ left: 4, bottom: 2 }}>
        Sprites are stored in the art/sprites/ directory and can be loaded using
        the Art component or referenced in map legends via the asset property.
      </Text>

      <Text width="90%" align="center" gap={{ top: 2 }}>
        Using Sprites
      </Text>
      <Line width="90%" align="center" />

      <Text width="90%" align="left" gap={{ left: 4, top: 1 }}>
        Display sprites using the Art component:
      </Text>

      <Text width="90%" align="left" gap={{ left: 4, top: 1, bottom: 2 }}>
        {`<Art src="firework" align="center" />`}
      </Text>

      <Text width="90%" align="center" gap={{ top: 1 }}>
        TIP: Sprites automatically cycle through their frames based on the
        timing configuration in the sprite file. The Art component handles
        all animation playback automatically.
      </Text>
    </Column>
  );
};
