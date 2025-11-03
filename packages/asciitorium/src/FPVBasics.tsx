import {
  Line,
  Column,
  Row,
  Text,
  FirstPersonView,
  MapView,
  State,
  Keybind,
  GridMovement,
  AssetManager,
  type MapAsset,
  type Player,
} from './index';
import { BaseStyle } from './constants';

// Initialize state containers
const map = new State<MapAsset | null>(null);
const player = new State<Player>({
  x: 2,
  y: 1,
  direction: 'east',
});

// Load map asset asynchronously
AssetManager.getMap('example')
  .then((mapAsset) => {
    map.value = mapAsset;
  })
  .catch((error) => {
    console.error('Failed to load map:', error);
  });

// Create GridMovement controller
const gridMovement = new GridMovement({
  mapAsset: map,
  player: player,
});

// Fog of war tracking
const exploredTiles = new State(new Set<string>());

/**
 * First Person View Basics
 *
 * Guide to using first-person perspective rendering in asciitorium games.
 */
export const FPVBasics = () => {
  return (
    <Column style={BaseStyle} label="First Person View Basics">
      <Keybind keyBinding="w" action={() => gridMovement.moveForward()} />
      <Keybind keyBinding="s" action={() => gridMovement.moveBackward()} />
      <Keybind keyBinding="a" action={() => gridMovement.turnLeft()} />
      <Keybind keyBinding="d" action={() => gridMovement.turnRight()} />

      <Text width="90%" align="center" gap={{ bottom: 2, top: 1 }}>
        First Person View (FPV) provides immersive ASCII-based 3D perspective
        rendering for dungeon crawlers and exploration games.
      </Text>

      <Text width="90%" align="center">
        Interactive First Person Example
      </Text>
      <Line width="90%" align="center" />

      <Text width="90%" align="center" gap={{ bottom: 1 }}>
        Controls: [W] forward • [S] backward • [A] turn left • [D] turn right
      </Text>

      <FirstPersonView
        align="center"
        gap={{ bottom: 2 }}
        mapAsset={map}
        player={player}
      />

      <Text width="90%" align="center">
        Raycasting System
      </Text>
      <Line width="90%" align="center" />

      <Text width="90%" align="left" gap={{ left: 4 }}>
        FirstPersonView uses raycasting with predefined offset cubes to
        determine what the player can see in each direction:
      </Text>

      <Text width="90%" align="left" gap={{ left: 6 }}>
        • Casts rays at multiple depths (here, near, middle, far) ¶ • Uses
        GameWorld.isSolid() for wall detection ¶ • Composites materials based on
        distance and position
      </Text>

      <Text width="90%" align="center" gap={{ top: 2 }}>
        Scene Switching
      </Text>
      <Line width="90%" align="center" />

      <Text width="90%" align="left" gap={{ left: 4, bottom: 2 }}>
        FirstPersonView supports different visual styles through the scene
        property, allowing you to switch between wireframe, brick-wall, and
        other material sets for varied aesthetics.
      </Text>
    </Column>
  );
};
