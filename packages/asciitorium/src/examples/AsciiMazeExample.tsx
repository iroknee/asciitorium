import { Component, AsciiMaze, State, Button, Row, Text, Direction, loadArt, Column } from '../index';

let dungeonMap: string | null = null;

// Load map asynchronously
loadArt('./art/maps/example.txt').then(art => {
  dungeonMap = art;
}).catch(err => {
  console.warn('Failed to load example map:', err);
  dungeonMap = 'Failed to load map';
});

// Player position state - start in the open area
const playerPosition = new State({
  x: 15,
  y: 10,
  direction: 'east' as Direction
});

const movePlayer = (dx: number, dy: number) => {
  const current = playerPosition.value;
  
  // Get map dimensions from loaded map
  if (!dungeonMap) return;
  const mapLines = dungeonMap.split('\n');
  const mapWidth = mapLines.length > 0 ? mapLines[0].length : 0;
  const mapHeight = mapLines.length;
  
  const newX = Math.max(0, Math.min(mapWidth - 1, current.x + dx));
  const newY = Math.max(0, Math.min(mapHeight - 1, current.y + dy));
  
  let direction: Direction = current.direction;
  if (dx > 0) direction = 'east';
  else if (dx < 0) direction = 'west';
  else if (dy > 0) direction = 'south';
  else if (dy < 0) direction = 'north';
  
  playerPosition.value = { x: newX, y: newY, direction };
};

export const AsciiMazeExample = () => (
  <Column border label="AsciiMaze Example:">
    <AsciiMaze
      align="center"
      map={dungeonMap || 'Loading map...'}
      position={playerPosition}
      width={45}
      height={10}
      border
      gap={1}
    />
    
    <Row gap={1} width={56} height={4} align="center">
      <Button 
        label="↑ North" 
        onClick={() => movePlayer(0, -1)}
      />
      <Button 
        label="↓ South" 
        onClick={() => movePlayer(0, 1)}
      />
      <Button 
        label="← West" 
        onClick={() => movePlayer(-1, 0)}
      />
      <Button 
        label="→ East" 
        onClick={() => movePlayer(1, 0)}
      />
    </Row>
    
    <Text gap={1} width={60} height="fill" align="center">
      Example Dungeon Map loaded from art/maps/example.txt - Navigate through corridors and rooms. The plus symbols (+) and pipes (|) represent walls, and 'o' symbols are doors to rooms. The player is shown as an arrow (↑↓←→).
    </Text>
  </Column>
);