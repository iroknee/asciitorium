import { Column, Row, Maze, FirstPersonView, State, Text, Direction, Button } from '../index';
import { SceneryTheme } from '../sprites/ScenerySprites';
import { BaseStyle } from './constants';

// Player position state - start in the open area
const playerPosition = new State({
  x: 2,
  y: 1,
  direction: 'east' as Direction,
});

// Explored tiles for fog of war
const exploredTiles = new State(new Set<string>());

// Fog of war toggle state
const fogOfWarEnabled = new State(false);

// Scenery theme state
const sceneryThemes: SceneryTheme[] = ['brick'];
const currentSceneryTheme = new State<SceneryTheme>('brick');

export const FirstPersonViewExample = () => (
  <Column label="FirstPersonView Example" style={BaseStyle}>
    <Row>
      <Maze
        style={{ width: 24, height: 16 }}
        src="./art/mazes/example.txt"
        player={playerPosition}
        fogOfWar={fogOfWarEnabled}
        exploredTiles={exploredTiles}
        hotkey="m"
      />

      <FirstPersonView
        width={32}
        height={32}
        src="./art/mazes/example.txt"
        player={playerPosition}
        sceneryTheme={currentSceneryTheme}
      />
    </Row>

    <Row>
      <Button
        onClick={() => (fogOfWarEnabled.value = !fogOfWarEnabled.value)}
        hotkey="f"
      >
        Fog of War
      </Button>
    </Row>

    <Text align="bottom" width="90%">
      Navigate using arrow keys in the maze view.
      The first person view shows what you see ahead.
      Use button to toggle fog of war.
      Both views share the same player state and update together.
    </Text>
  </Column>
);