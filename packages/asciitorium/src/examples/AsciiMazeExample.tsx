import { Column, AsciiMaze, State, Text, Direction, Button } from '../index';
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

export const AsciiMazeExample = () => (
  <Column label="AsciiMaze Example:" style={BaseStyle}>
    <AsciiMaze
      width="50%"
      height={20}
      align="top"
      src="./art/mazes/example.txt"
      position={playerPosition}
      fogOfWar={fogOfWarEnabled}
      exploredTiles={exploredTiles}
      border
    />

    <Button
      onClick={() => (fogOfWarEnabled.value = !fogOfWarEnabled.value)}
      align="center"
      width={25}
    >
      Fog of War
    </Button>

    <Text align="bottom" width="60%">
      {`
      Navigate using arrow keys or WASD. 
      The player is shown as an arrow (↑↓←→). 
      Click button to toggle fog of war.
    `}
    </Text>
  </Column>
);
