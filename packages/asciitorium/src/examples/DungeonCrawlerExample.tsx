import {
  Column,
  Row,
  MapView,
  FirstPersonView,
  State,
  Keybind,
  GridMovement,
  Text,
  AssetManager,
  type MapAsset,
  type Player,
} from '../index';
import { BaseStyle } from './constants';

// Initialize state containers
const map = new State<MapAsset | null>(null);
const player = new State<Player>({
  x: 2,
  y: 1,
  direction: 'east',
});

// Load map asset asynchronously and populate state
AssetManager.getMap('example')
  .then((mapAsset) => {
    map.value = mapAsset;
  })
  .catch((error) => {
    console.error('Failed to load map:', error);
  });

// Create GridMovement controller, passing it the assets and player state
const gridMovement = new GridMovement({
  mapAsset: map,
  player: player,
});

// Fog of war: track tiles that have been explored
const exploredTiles = new State(new Set<string>());

export const DungeonCrawlerExample = () => (
  <Column label="Dungeon Crawler Example" style={BaseStyle}>
    Global keybinds for movement - use GridMovement's methods
    <Keybind keyBinding="w" action={() => gridMovement.moveForward()} global />
    <Keybind keyBinding="s" action={() => gridMovement.moveBackward()} global />
    <Keybind keyBinding="a" action={() => gridMovement.turnLeft()} global />
    <Keybind keyBinding="d" action={() => gridMovement.turnRight()} global />
    <Text
      align="center"
      gap={1}
      content="A grid-based dungeon crawler with first-person view, top-down map, and fog of war exploration."
      style={{ align: 'center' }}
    />
    <Row>
      {/* Pass the same mapAsset and player to FirstPersonView */}
      <FirstPersonView
        gap={1}
        label="First Person View"
        mapAsset={map}
        player={player}
        transparency={false}
      />

      {/* Pass the same mapAsset and player to MapView */}
      <MapView
        gap={1}
        label="Map"
        style={{ width: 'fill', height: 'fill' }}
        mapAsset={map}
        player={player}
        fogOfWar={true}
        exploredTiles={exploredTiles}
        hotkey="m"
      />
    </Row>
    <Text
      gap={1}
      align="center"
      content="Controls: [W] Move Forward • [S] Move Backward • [A] Turn Left • [D] Turn Right"
      style={{ align: 'center' }}
    />
  </Column>
);
