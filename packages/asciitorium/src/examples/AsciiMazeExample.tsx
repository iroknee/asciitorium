import { AsciiMaze, State, Button, Row, Text, Direction, loadArt, Column } from '../index';

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

const movePlayer = (dx: number, dy: number) => {
  const current = playerPosition.value;
  
  // Get map dimensions from loaded map
  if (!dungeonMap) return;
  const mapLines = dungeonMap.split('\n');
  const mapWidth = mapLines.length > 0 ? mapLines[0].length : 0;
  const mapHeight = mapLines.length;
  
  const newX = Math.max(0, Math.min(mapWidth - 1, current.x + dx));
  const newY = Math.max(0, Math.min(mapHeight - 1, current.y + dy));
  
  // Check for collision with walls along the path
  const isWall = (x: number, y: number) => {
    if (y < 0 || y >= mapLines.length || x < 0 || x >= mapLines[y].length) return true;
    const char = mapLines[y][x];
    // Check for box drawing characters used in the maze
    const wallChars = ['╭', '╮', '╯', '╰', '─', '│', '┬', '┴', '├', '┤', '┼', '╷', '╵', '╴', '╶'];
    return wallChars.includes(char);
  };
  
  // Check intermediate positions when moving 2 spaces
  const stepX = dx === 0 ? 0 : (dx > 0 ? 1 : -1);
  const stepY = dy === 0 ? 0 : (dy > 0 ? 1 : -1);
  
  // Check first step
  const midX = current.x + stepX;
  const midY = current.y + stepY;
  if (isWall(midX, midY)) {
    // Hit a wall on first step, don't move but update direction
    let direction: Direction = current.direction;
    if (dx > 0) direction = 'east';
    else if (dx < 0) direction = 'west';
    else if (dy > 0) direction = 'south';
    else if (dy < 0) direction = 'north';
    
    playerPosition.value = { x: current.x, y: current.y, direction };
    return;
  }
  
  // Check final destination
  if (isWall(newX, newY)) {
    // Hit a wall at destination, don't move but update direction
    let direction: Direction = current.direction;
    if (dx > 0) direction = 'east';
    else if (dx < 0) direction = 'west';
    else if (dy > 0) direction = 'south';
    else if (dy < 0) direction = 'north';
    
    playerPosition.value = { x: current.x, y: current.y, direction };
    return;
  }
  
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
      content={dungeonMap || 'Loading map...'}
      position={playerPosition}
      width={45}
      height={10}
      // fogOfWar
      // exploredTiles={exploredTiles}
      border
      gap={1}
    />
    
    <Row gap={1} width={56} height={4} align="center">
      <Button 
        label="↑ North" 
        onClick={() => movePlayer(0, -2)}
      />
      <Button 
        label="↓ South" 
        onClick={() => movePlayer(0, 2)}
      />
      <Button 
        label="← West" 
        onClick={() => movePlayer(-2, 0)}
      />
      <Button 
        label="→ East" 
        onClick={() => movePlayer(2, 0)}
      />
    </Row>
    
    <Text gap={1} width={60} height="fill" align="center">
      Example Dungeon Map loaded from art/mazes/example.txt - Navigate through corridors and rooms. The plus symbols (+) and pipes (|) represent walls, and 'o' symbols are doors to rooms. The player is shown as an arrow (↑↓←→).
    </Text>
  </Column>
);