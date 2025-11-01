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

      <Text width="90%" align="center" gap={{ bottom: 2, top: 2 }}>
        Maps are ASCII layouts that define game environments, combining visual
        representation with legend files that specify gameplay properties.
      </Text>

      <Text width="90%" align="center">
        Interactive Map Example
      </Text>
      <Line width="90%" align="center" />

      <Text width="90%" align="center" gap={{ top: 1, bottom: 1 }}>
        Controls: [W] forward • [S] backward • [A] turn left • [D] turn right
      </Text>

      <Row width="90%" align="center" gap={{ bottom: 2 }}>
        <MapView
          mapAsset={map}
          player={player}
          fogOfWar={true}
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

      <Text width="90%" align="left" gap={{ left: 4, top: 1 }}>
        Maps use ASCII text files where each character represents a different
        terrain type, object, or game element. Common characters include:
      </Text>

      <Text width="90%" align="left" gap={{ left: 4 }}>
        • Box-drawing characters for walls and structures
      </Text>
      <Text width="90%" align="left" gap={{ left: 4 }}>
        • Special characters for doors, spawn points, items
      </Text>
      <Text width="90%" align="left" gap={{ left: 4 }}>
        • Spaces for walkable floor areas
      </Text>
      <Text width="90%" align="left" gap={{ left: 4, bottom: 2 }}>
        • Custom characters assigned through legends
      </Text>

      <Text width="90%" align="center" gap={{ top: 2 }}>
        Legend Files
      </Text>
      <Line width="90%" align="center" />

      <Text width="90%" align="left" gap={{ left: 4, top: 1 }}>
        Each map has an accompanying legend.json file that defines what each
        character represents, including:
      </Text>

      <Text width="90%" align="left" gap={{ left: 4 }}>
        • kind - Type of asset (material or sprite)
      </Text>
      <Text width="90%" align="left" gap={{ left: 4 }}>
        • solid - Whether it blocks player movement
      </Text>
      <Text width="90%" align="left" gap={{ left: 4 }}>
        • asset - Reference to visual asset file
      </Text>
      <Text width="90%" align="left" gap={{ left: 4 }}>
        • entity - Gameplay type (door, enemy, treasure, trap)
      </Text>
      <Text width="90%" align="left" gap={{ left: 4, bottom: 2 }}>
        • variant - Specific subtype (wooden, iron, wolf, etc.)
      </Text>

      <Text width="90%" align="center" gap={{ top: 2 }}>
        Common Entity Types
      </Text>
      <Line width="90%" align="center" />

      <Text width="90%" align="left" gap={{ left: 4 }}>
        • door - Openable/closable passages
      </Text>
      <Text width="90%" align="left" gap={{ left: 4 }}>
        • enemy - Hostile creatures or NPCs
      </Text>
      <Text width="90%" align="left" gap={{ left: 4 }}>
        • treasure - Collectible currency or valuables
      </Text>
      <Text width="90%" align="left" gap={{ left: 4 }}>
        • item - Pickup-able objects for inventory
      </Text>
      <Text width="90%" align="left" gap={{ left: 4 }}>
        • trap - Hazards that trigger on interaction
      </Text>
      <Text width="90%" align="left" gap={{ left: 4, bottom: 2 }}>
        • mechanism - Switches, levers, pressure plates
      </Text>

      <Text width="90%" align="center" gap={{ top: 2 }}>
        Map Generation
      </Text>
      <Line width="90%" align="center" />

      <Text width="90%" align="left" gap={{ left: 4, top: 1, bottom: 2 }}>
        Use the map-builder.js script to quickly generate maze-like dungeon
        layouts that you can customize. Maps are stored in art/maps/ with each
        map in its own directory containing map.art and legend.json files.
      </Text>

      <Text width="90%" align="center" gap={{ top: 1 }}>
        TIP: The entity and variant system allows shared behavior across
        similar entities while maintaining variant-specific properties for
        rich gameplay variety.
      </Text>
    </Column>
  );
};
