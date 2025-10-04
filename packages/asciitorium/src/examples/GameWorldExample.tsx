import {
  Column,
  Row,
  MapView,
  FirstPersonView,
  State,
  Keybind,
  GameWorld,
  Text,
} from '../index';
import { ProgressBarSlider } from '../components/Sliders';
import { BaseStyle } from './constants';

// Create GameWorld instance - manages map, legend, and player state
const gameWorld = new GameWorld({
  mapName: 'example',
  initialPosition: {
    x: 2,
    y: 1,
    direction: 'east',
  },
});

// Scene selection state - default to wireframe
const materialBackground = new State('brick-wall');

// Fog of war: track tiles that have been explored
const exploredTiles = new State(new Set<string>());

// Game stats - random initial values
const health = new State(Math.floor(Math.random() * 40) + 60); // 60-100
const magic = new State(Math.floor(Math.random() * 50) + 30); // 30-80
const hunger = new State(Math.floor(Math.random() * 60) + 20); // 20-80

export const GameWorldExample = () => (
  <Row label="GameWorld Example" style={BaseStyle}>
    {/* Global keybinds for movement */}
    <Keybind
      keyBinding="ArrowUp"
      action={() => gameWorld.moveForward()}
      global
    />
    <Keybind
      keyBinding="ArrowDown"
      action={() => gameWorld.moveBackward()}
      global
    />
    <Keybind
      keyBinding="ArrowLeft"
      action={() => gameWorld.turnLeft()}
      global
    />
    <Keybind
      keyBinding="ArrowRight"
      action={() => gameWorld.turnRight()}
      global
    />

    <FirstPersonView
      gap={{ top: 1 }}
      label="View"
      gameWorld={gameWorld}
      scene={materialBackground}
      transparency={false}
    />
    <Column style={{ gap: 1 }}>
      <Row gap={{ top: 1 }}>
        <Text width={8} align="left">
          Health:
        </Text>
        <ProgressBarSlider
          value={health}
          min={0}
          max={100}
          step={1}
          width={16}
        />
      </Row>
      <Row gap={{ top: 1 }}>
        <Text width={8} align="left">
          Magic:
        </Text>
        <ProgressBarSlider
          value={magic}
          min={0}
          max={100}
          step={1}
          width={16}
        />
      </Row>
      <Row gap={{ top: 1 }}>
        <Text width={8} align="left">
          Hunger:
        </Text>
        <ProgressBarSlider
          value={hunger}
          min={0}
          max={100}
          step={1}
          width={16}
        />
      </Row>

      <MapView
        gap={{ top: 1 }}
        label="Map"
        style={{ width: 26, height: 15 }}
        gameWorld={gameWorld}
        fogOfWar={true}
        exploredTiles={exploredTiles}
        hotkey="m"
      />
    </Column>
  </Row>
);
