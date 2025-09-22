import { Column, Maze, State, Text, Direction, Button } from '../index';
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

export const MazeExample = () => (
  <Column label="AsciiMaze Example" style={BaseStyle}>
    <Maze
      style={{ width: '50%', height: 14, align: 'center' }}
      src="./art/mazes/example.txt"
      player={playerPosition}
      fogOfWar={fogOfWarEnabled}
      exploredTiles={exploredTiles}
      hotkey="m"
    />

    <Button
      onClick={() => (fogOfWarEnabled.value = !fogOfWarEnabled.value)}
      align="center"
      width={25}
      hotkey="f"
    >
      Fog of War
    </Button>

    <Text align="bottom" width="60%">
      {`
      Navigate using arrow keys. 
      The player is shown as an arrow (↑↓←→). 
      Click button to toggle fog of war.
    `}
    </Text>
  </Column>
);
