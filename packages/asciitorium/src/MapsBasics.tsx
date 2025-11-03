import {
  Line,
  Column,
  Row,
  Text,
  MapView,
  State,
  Keybind,
  GridMovement,
  AssetManager,
  type MapAsset,
  type Player,
} from './index.js';
import { BaseStyle } from './constants.js';

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
 * Maps Basics
 *
 * Guide to creating and using maps in asciitorium games.
 */
export const MapsBasics = () => {
  return (
    <Column style={BaseStyle} label="Maps Basics">
      <Keybind keyBinding="w" action={() => gridMovement.moveForward()} />
      <Keybind keyBinding="s" action={() => gridMovement.moveBackward()} />
      <Keybind keyBinding="a" action={() => gridMovement.turnLeft()} />
      <Keybind keyBinding="d" action={() => gridMovement.turnRight()} />

      <Text width="90%" align="center" gap={{ bottom: 2, top: 1 }}>
        Maps are ASCII layouts that define game environments, combining visual
        representation with legend files that specify gameplay properties.
      </Text>

      <Text width="90%" align="center">
        Interactive Map Example
      </Text>
      <Line width="90%" align="center" />

      <Text width="90%" align="center" gap={{ bottom: 1 }}>
        Controls: [W] forward • [S] backward • [A] turn left • [D] turn right
      </Text>

      <Row width={32} align="center" gap={{ bottom: 2 }}>
        <MapView
          mapAsset={map}
          player={player}
          fogOfWar={false}
          exploredTiles={exploredTiles}
          width={30}
          height={15}
          border
        />
      </Row>

      <Text width="90%" align="center">
        Map File Format
      </Text>
      <Line width="90%" align="center" />

      <Text width="90%" align="left" gap={{ left: 4 }}>
        Maps use ASCII text files where each character represents a different
        terrain type, object, or game element. Common characters include:
      </Text>

      <Text width="90%" align="center" gap={{ top: 2 }}>
        Legend Files
      </Text>
      <Line width="90%" align="center" />

      <Text width="90%" align="left" gap={{ left: 4 }}>
        Each map has an accompanying legend.json file that defines what each
        character represents, including:
      </Text>

      <Text width="90%" align="left" gap={{ left: 6 }}>
        • kind - Type of asset (material or sprite) ¶
        • solid - Whether it blocks player movement ¶
        • asset - Reference to visual asset file ¶
        • entity - Gameplay type (door, enemy, treasure, trap) ¶
        • variant - Specific subtype (wooden, iron, wolf, etc.)
      </Text>

      <Text width="90%" align="center" gap={{ top: 2 }}>
        Map Generation
      </Text>
      <Line width="90%" align="center" />

      <Text width="90%" align="left" gap={{ left: 4, bottom: 2 }}>
        Use the map-builder.js script to quickly generate maze-like dungeon
        layouts that you can customize. Maps are stored in art/maps/ with each
        map in its own directory containing map.art and legend.json files.
      </Text>

    </Column>
  );
};
