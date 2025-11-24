import { Art, Column, Line, Text } from "../index.js";
import { BaseStyle } from './constants.js';

/**
 * ASCII Art - Sprites
 *
 * Guide to creating and using sprite assets in asciitorium.
 */
export const ArtBasics = () => {
  return (
    <Column style={BaseStyle} label="Ascii Art - Sprites">
      <Art gap={{ left: 2, top: 1, bottom: 2 }} sprite="sprites" />

      <Text width="90%" gap={{ bottom: 3 }}>
        Sprites are animated ASCII art assets stored in art/sprites/ directory.
        They can support multiple frames with timing control and are used for
        characters, creatures, and UI elements.
      </Text>


      <Text width="90%">
        To display a sprite, use the Art component
      </Text>
      <Line width="90%" />

      <Art gap={{ bottom: 2 }} sprite="balloon" />

      <Text width="90%" gap={{ bottom: 4 }} wrap={false} border>
        {`
           <Art sprite="balloon" />
        `}
      </Text>

      <Text width="90%">
        For documentation on creating sprite assets, see
        public/art/sprites/README.md
      </Text>
    </Column>
  );
};
