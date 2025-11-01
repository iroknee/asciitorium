import { Line, Column, Text } from './index';
import { BaseStyle } from './constants';

/**
 * Materials Basics
 *
 * Guide to using materials for first-person rendering in asciitorium.
 */
export const MaterialsBasics = () => {
  return (
    <Column style={BaseStyle} label="Materials Basics">
      <Text width="90%" align="center" gap={{ bottom: 2, top: 2 }}>
        Materials are ASCII art representations of textures and surfaces used
        in first-person perspective rendering for game environments.
      </Text>

      <Text width="90%" align="center">
        What are Materials?
      </Text>
      <Line width="90%" align="center" />

      <Text width="90%" align="left" gap={{ left: 4, top: 1 }}>
        Materials define the visual appearance of walls, floors, doors, and
        other environmental elements in first-person view. They use a layered
        system to show different levels of detail at various distances.
      </Text>

      <Text width="90%" align="left" gap={{ left: 4, bottom: 2 }}>
        Materials are stored in the art/materials/ directory and referenced
        through map legends using the asset property.
      </Text>

      <Text width="90%" align="center" gap={{ top: 2 }}>
        Layer System
      </Text>
      <Line width="90%" align="center" />

      <Text width="90%" align="left" gap={{ left: 4, top: 1 }}>
        Materials use a sophisticated layering system for perspective:
      </Text>

      <Text width="90%" align="left" gap={{ left: 4 }}>
        • here - Immediate foreground (closest to viewer)
      </Text>
      <Text width="90%" align="left" gap={{ left: 4 }}>
        • near - Close objects with full detail
      </Text>
      <Text width="90%" align="left" gap={{ left: 4 }}>
        • middle - Mid-distance with moderate detail
      </Text>
      <Text width="90%" align="left" gap={{ left: 4, bottom: 2 }}>
        • far - Distant objects with minimal detail
      </Text>

      <Text width="90%" align="center" gap={{ top: 2 }}>
        Material Properties
      </Text>
      <Line width="90%" align="center" />

      <Text width="90%" align="left" gap={{ left: 4, top: 1 }}>
        Materials support various properties for rich environments:
      </Text>

      <Text width="90%" align="left" gap={{ left: 4 }}>
        • placement - Surface type (ground, ceiling, scenery)
      </Text>
      <Text width="90%" align="left" gap={{ left: 4 }}>
        • onEnterSound - Sound when player steps on tile
      </Text>
      <Text width="90%" align="left" gap={{ left: 4 }}>
        • onExitSound - Sound when player leaves tile
      </Text>
      <Text width="90%" align="left" gap={{ left: 4, bottom: 2 }}>
        • ambientSound - Looping sound while visible
      </Text>

      <Text width="90%" align="center" gap={{ top: 2 }}>
        Using Materials
      </Text>
      <Line width="90%" align="center" />

      <Text width="90%" align="left" gap={{ left: 4, top: 1, bottom: 2 }}>
        Materials are referenced in map legends and automatically loaded by
        FirstPersonView components based on the player's position and viewing
        direction.
      </Text>

      <Text width="90%" align="center" gap={{ top: 1 }}>
        TIP: Materials separate visual presentation from gameplay behavior,
        allowing artists to focus on appearance while game designers handle
        interactions through legend entities.
      </Text>
    </Column>
  );
};
