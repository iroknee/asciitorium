import { Column, Row, Maze, FirstPersonView, State, Text, Direction, Button } from '../index';
import { BaseStyle } from './constants';

// Player position state - start in the open area
const playerPosition = new State({
  x: 2,
  y: 1,
  direction: 'east' as Direction,
});


export const FirstPersonViewExample = () => (
  <Column label="FirstPersonView Example" style={BaseStyle}>
    <Row gap={2}>
      <Maze
        style={{ width: 24, height: 27 }}
        src="./art/mazes/example.txt"
        player={playerPosition}
        fogOfWar={false}
        hotkey="m"
      />

      <FirstPersonView
        src="./art/mazes/example.txt"
        player={playerPosition}
        transparency={false}
      />
    </Row>

  </Column>
);