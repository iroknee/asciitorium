import { Art, Line, Column, Text } from "../index.js";
import { BaseStyle } from './constants.js';

/**
 * Sprites Basics
 *
 * Guide to using animated ASCII sprites in asciitorium.
 */
export const SpritesBasics = () => {
  return (
    <Column style={BaseStyle} label="Sprites Basics">
      <Text width="90%" gap={{ bottom: 2, top: 1 }}>
        Sprites are animated ASCII art assets used for characters, creatures,
        and visual effects in asciitorium applications.
      </Text>

      <Text width="90%">
        What are Sprites?
      </Text>
      <Line width="90%" />

      <Text width="90%" gap={{ left: 4, bottom: 1 }}>
        Sprites store ASCII art for characters, creatures, and other game
        entities. They support multiple frames with configurable timing and
        can be referenced for dynamic visual representation.
      </Text>

      <Text width="90%" gap={{ left: 4, bottom: 2 }}>
        Sprites are stored in the art/sprites/ directory and can be loaded using
        the Art component or referenced in map legends via the asset property.
      </Text>

      <Text width="90%">
        Displaying Sprites
      </Text>
      <Line width="90%" />

      <Text width="90%" gap={{ left: 4, bottom: 1 }}>
        Display sprites using the Art component with the src prop:
      </Text>

      <Column width="90%" align="center" gap={{ left: 4, bottom: 2 }}>
        <Art src="balloon" gap={{ bottom: 1 }} />
        <Text border textAlign="center" width={32}>
          {`<Art src="balloon" />`}
        </Text>
      </Column>

      <Text width="90%">
        Sprite Features
      </Text>
      <Line width="90%" />

      {/* prettier-ignore */}
      <Text width="90%" gap={{ left: 6, bottom: 2 }}>
        • Multi-frame animation — Sprites cycle through frames ¶
        • Configurable timing — Control frame duration ¶
        • Loop control — Enable or disable looping ¶
        • Transparency — Define transparent characters ¶
        • Sound markers — Tag frames with sound IDs ¶
      </Text>

      <Text width="90%">
        Sprite Animation
      </Text>
      <Line width="90%" />

      <Text width="90%" gap={{ left: 4, bottom: 1 }}>
        Sprites automatically cycle through their frames based on the timing
        configuration in the sprite file. The Art component handles all
        animation playback automatically.
      </Text>

      <Text width="90%" gap={{ left: 4 }}>
        To learn how to create your own sprites, check out the documentation
        in the public/art/sprites directory.
      </Text>
    </Column>
  );
};
