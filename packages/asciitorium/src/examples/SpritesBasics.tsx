import { Art, Line, Column, Text } from "../index.js";
import { BaseStyle } from './constants.js';

/**
 * Sprites Basics
 *
 * Guide to using animated ASCII sprites in asciitorium.
 */
export const SpritesBasics = () => {
  const spawnFirework = () => {
    // Random x position, fixed y position
    const x = Math.floor(Math.random() * 60) + 10;
    const y = 1;

    const firework = new Art({
      src: 'firework',
      position: { x, y },
    });

    container.addChild(firework);

    // Remove firework after animation completes (~800ms for 8 frames at 100ms each)
    setTimeout(() => {
      container.removeChild(firework);
    }, 800);
  };

  // Spawn a firework every 2 seconds
  setInterval(() => {
    spawnFirework();
  }, 2000);

  const container = (
    <Column style={BaseStyle} label="Sprites Basics">
      <Art src="balloon" />

      <Text width="90%">
        What are Sprites?
      </Text>
      <Line width="90%" />

      <Text width="90%" gap={{ left: 4, bottom: 1 }}>
        Sprites store ASCII art for characters, creatures, and other game
        entities. Sprites support multiple frames with configurable timing and
        can be referenced for dynamic visual representation.
      </Text>

      <Text width="90%" gap={{ left: 4 }}>
        Sprites are stored in the art/sprites/ directory and can be loaded using
        the Art component or referenced in map legends via the asset property.
      </Text>

      <Text width="90%" gap={{ top: 2 }}>
        Using Sprites
      </Text>
      <Line width="90%" />

      <Text width="90%" gap={{ left: 4 }}>
        Display sprites using the Art component:
      </Text>

      <Text
        width={56}
        textAlign="center"
        border
        align="center"
        gap={{ left: 4, top: 1, bottom: 1 }}
      >
        {`<Art src="firework" />`}
      </Text>

      <Text width="90%">
        Sprites automatically cycle through their frames based on the timing
        configuration in the sprite file. The Art component handles all
        animation playback automatically. To learn how to create your own
        sprites, check out the documentation in the public/art/sprites
        directory.
      </Text>
    </Column>
  );

  return container;
};
