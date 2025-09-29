import { Column, Row, MapView, FirstPersonView, State, Text, Direction, Button, Select } from '../index';
import { BaseStyle } from './constants';

// Player position state - start in the open area
const playerPosition = new State({
  x: 2,
  y: 1,
  direction: 'east' as Direction,
});

// Scene selection state - default to wireframe
const selectedScene = new State('wireframe');


export const FirstPersonViewExample = () => (
  <Column label="FirstPersonView Example" style={BaseStyle}>
    <Row width="fill">
      <Text align="center">Scene:</Text>
      <Select
        items={['wireframe', 'brick']}
        selectedItem={selectedScene}
        hotkey="s"
        width="fill"
      />
    </Row>

    <Row gap={2}>
      <MapView
        style={{ width: 24, height: 27 }}
        src="./art/maps/example/map.txt"
        player={playerPosition}
        fogOfWar={false}
        hotkey="m"
      />

      <FirstPersonView
        src="./art/maps/example/map.txt"
        player={playerPosition}
        scene={selectedScene}
        transparency={false}
      />
    </Row>

  </Column>
);