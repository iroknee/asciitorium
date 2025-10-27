import { Art, Column, Line, Text } from './index';
import { BaseStyle } from './constants';

/**
 * ASCII Art - Sprites
 *
 * Guide to creating and using sprite assets in asciitorium.
 */
export const ArtBasics = () => {
  return (
    <Column style={BaseStyle} label="Ascii Art - Sprites">
      <Art gap={{ left: 2, top: 1, bottom: 2 }} src="sprites" align="left" />

      <Text width="90%" align="center" gap={{ bottom: 3 }}>
        Sprites are animated ASCII art assets stored in art/sprites/ directory.
        They can support multiple frames with timing control and are used for
        characters, creatures, and UI elements.
      </Text>


      <Text width="90%" align="center">
        To display a sprite, use the Art component
      </Text>
      <Line width="90%" align="center" />

      <Art gap={{ bottom: 2 }} src="balloon" align="center" />

      <Text width="90%" align="center" gap={{ bottom: 4 }} wrap={false} border>
        {`
           <Art src="balloon" />
        `}
      </Text>

      <Text width="90%" align="center">
        For documentation on creating sprite assets, see
        public/art/sprites/README.md
      </Text>
    </Column>
  );
};
