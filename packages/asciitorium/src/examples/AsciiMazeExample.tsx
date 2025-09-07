import { Component, AsciiMaze, State, Text, Direction, loadArt } from '../index';

let dungeonMap: string | null = null;

// Load map asynchronously
loadArt('./art/mazes/example.txt').then(art => {
  dungeonMap = art;
}).catch(err => {
  console.warn('Failed to load example map:', err);
  dungeonMap = 'Failed to load map';
});

// Player position state - start in the open area
const playerPosition = new State({
  x: 2,
  y: 1,
  direction: 'east' as Direction
});

// Explored tiles for fog of war
const exploredTiles = new State(new Set<string>());


export const AsciiMazeExample = () => (
  <Component layout="aligned" height="fill" border label="AsciiMaze Example:">
    <AsciiMaze
      width="50%"
      height={20}
      align="top"
      content={dungeonMap || 'Loading map...'}
      position={playerPosition}
      fogOfWar
      exploredTiles={exploredTiles}
      border
    />
    
    <Text align="bottom" width="60%">{`
      Example Dungeon Map loaded from art/mazes/example.txt
      Navigate through corridors and rooms using arrow keys or WASD. 
      The box drawing characters represent walls, and the player is shown as an arrow (↑↓←→). 
      Click on the maze to focus it, then use keyboard navigation.
    `}
      
    </Text>
  </Component>
);