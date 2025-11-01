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

      <Text width="90%" align="center" gap={{ bottom: 2, top: 2 }}>
        First Person View (FPV) provides immersive ASCII-based 3D perspective
        rendering for dungeon crawlers and exploration games.
      </Text>

      <Text width="90%" align="center">
        Interactive First Person Example
      </Text>
      <Line width="90%" align="center" />

      <Text width="90%" align="center" gap={{ top: 1, bottom: 1 }}>
        Controls: [W] forward • [S] backward • [A] turn left • [D] turn right
      </Text>

      <Row width="90%" align="center" gap={{ bottom: 2 }}>
        <FirstPersonView
          mapAsset={map}
          player={player}
          width={40}
          height={20}
          border
        />
        <MapView
          mapAsset={map}
          player={player}
          fogOfWar={true}
          exploredTiles={exploredTiles}
          width={25}
          height={20}
          border
        />
      </Row>

      <Text width="90%" align="center">
        What is First Person View?
      </Text>
      <Line width="90%" align="center" />

      <Text width="90%" align="left" gap={{ left: 4, top: 1 }}>
        The FirstPersonView component renders a first-person perspective of
        the game world using ASCII art materials. It creates depth perception
        through layered rendering and distance-based detail levels.
      </Text>

      <Text width="90%" align="left" gap={{ left: 4, bottom: 2 }}>
        FPV works with GameWorld to manage player position, direction, and
        map data, automatically updating the view as the player moves.
      </Text>

      <Text width="90%" align="center" gap={{ top: 2 }}>
        Raycasting System
      </Text>
      <Line width="90%" align="center" />

      <Text width="90%" align="left" gap={{ left: 4, top: 1 }}>
        FirstPersonView uses raycasting with predefined offset cubes to
        determine what the player can see in each direction:
      </Text>

      <Text width="90%" align="left" gap={{ left: 4 }}>
        • Casts rays at multiple depths (here, near, middle, far)
      </Text>
      <Text width="90%" align="left" gap={{ left: 4 }}>
        • Uses GameWorld.isSolid() for wall detection
      </Text>
      <Text width="90%" align="left" gap={{ left: 4, bottom: 2 }}>
        • Composites materials based on distance and position
      </Text>

      <Text width="90%" align="center" gap={{ top: 2 }}>
        Scene Switching
      </Text>
      <Line width="90%" align="center" />

      <Text width="90%" align="left" gap={{ left: 4, top: 1, bottom: 2 }}>
        FirstPersonView supports different visual styles through the scene
        property, allowing you to switch between wireframe, brick-wall, and
        other material sets for varied aesthetics.
      </Text>

      <Text width="90%" align="center" gap={{ top: 2 }}>
        GameWorld Integration
      </Text>
      <Line width="90%" align="center" />

      <Text width="90%" align="left" gap={{ left: 4, top: 1 }}>
        Use FirstPersonView with GameWorld for automatic reactive rendering:
      </Text>

      <Text width="90%" align="left" gap={{ left: 4, top: 1, bottom: 2 }}>
        {`<FirstPersonView gameWorld={gameWorld} scene="brick-wall" />`}
      </Text>

      <Text width="90%" align="center" gap={{ top: 1 }}>
        TIP: FirstPersonView is display-only and subscribes to GameWorld's
        player State. Handle movement through global keybinds that call
        GameWorld methods (moveForward, turnLeft, etc).
      </Text>
    </Column>
  );
};
