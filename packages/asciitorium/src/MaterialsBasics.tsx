import { Line, Column, Text } from './index.js';
import { BaseStyle } from './constants.js';

/**
 * Materials Basics
 *
 * Guide to using materials for first-person rendering in asciitorium.
 */
export const MaterialsBasics = () => {
  return (
    <Column style={BaseStyle} label="Materials Basics">
      <Text width="90%" align="left" gap={{ left: 4, top: 1 }}>
        Materials define the visual appearance of walls, floors, doors, and
        other environmental elements in first-person view or 2d views. They use
        a layered system to show different levels of detail at various
        distances. ¶¶ Materials are stored in the art/materials/ directory and
        referenced through map legends using the asset property.
      </Text>

      <Text width="90%" align="center" gap={{ top: 2 }}>
        Layer System
      </Text>
      <Line width="90%" align="center" />

      <Text width="90%" align="center" gap={{ left: 4 }}>
        Materials use a sophisticated layering system for perspective:
      </Text>

      <Text width="90%" align="center" gap={{ left: 6 }}>
        • here - Immediate foreground (closest to viewer) ¶ • near - Close
        objects with full detail ¶ • middle - Mid-distance with moderate detail
        ¶ • far - Distant objects with minimal detail ¶
      </Text>

      <Text width="90%" align="center" gap={{ top: 1 }}>
        Material Properties
      </Text>
      <Line width="90%" align="center" />

      <Text width="90%" align="center" gap={{ left: 4 }}>
        Materials support various properties for rich environments:
      </Text>

      <Text width="90%" align="center" gap={{ left: 6 }}>
        • placement - Surface type (ground, ceiling, scenery)¶ • onEnterSound -
        Sound when player steps on tile ¶ • onExitSound - Sound when player
        leaves tile ¶ • ambientSound - Looping sound while visible ¶
      </Text>

      <Text width="90%" align="center" gap={{ top: 1 }}>
        Using Materials
      </Text>
      <Line width="90%" align="center" />

      <Text width="90%" align="center" gap={{ left: 4, bottom: 2 }}>
        Materials are referenced in map legends and automatically loaded by
        FirstPersonView components based on the player's position and viewing
        direction.
      </Text>

      <Text width="80%" align="center">
        * To learn more about creating custom materials, check out the
        documentation in the public/art/materials directory.
      </Text>
    </Column>
  );
};
