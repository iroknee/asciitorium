import {
  Component,
  AsciiMaze,
  State,
  Text,
  Direction,
  loadArt,
  Button,
} from '../index';

let dungeonMap: string | null = null;

// Load map asynchronously
loadArt('./art/mazes/example.txt')
  .then((art) => {
    dungeonMap = art;
  })
  .catch((err) => {
    console.warn('Failed to load example map:', err);
    dungeonMap = 'Failed to load map';
  });

// Player position state - start in the open area
const playerPosition = new State({
  x: 2,
  y: 1,
  direction: 'east' as Direction,
});

// Explored tiles for fog of war
const exploredTiles = new State(new Set<string>());

// Fog of war toggle state
const fogOfWarEnabled = new State(true);

export const AsciiMazeExample = () => (
  <Component layout="aligned" height="fill" border label="AsciiMaze Example:">
    <AsciiMaze
      width="50%"
      height={20}
      align="top"
      content={dungeonMap || 'Loading map...'}
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
  </Component>
);
