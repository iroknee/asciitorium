import { Component, MapView, State, Button, Text, Row, Direction } from '../index';

// Large dungeon map for testing centering logic
const largeDungeonMap = {
  title: "Large Dungeon",
  map: [
    "####################################################################################################",
    "#                                   #              #                                               #",
    "# ### ##### ### ##### ### ##### ### # ##### ### ## # ### ##### ### ##### ### ##### ### ##### ### #",
    "# #   #   # #   #   # #   #   # #   # #   # #   ## # #   #   # #   #   # #   #   # #   #   # #   # #",
    "# # ### # # # ### # # # ### # # # ### # # # # ### ## # # ### # # # ### # # # ### # # # ### # # # ### # #",
    "# #   # # #   #   # # #   # # #   #   # # # #   # ## # #   # # #   #   # # #   # # #   #   # # #   # #",
    "# ### # # ##### ### # ### # # ##### # # # # ### # ## # ### # # ##### ### # ### # # ##### ### # ### # #",
    "#   # # #       #   #   # # #       # # # #   # # ## #   # # #       #   #   # # #       #   #   # # #",
    "### # # ####### # ##### # # ####### # # # ### # # ## ### # # ####### # ##### # # ####### # ##### # # #",
    "#   # #         #       # #         # # #     # #    #   # #         #       # #         #       # # #",
    "# ### ########### ####### ########### # ##### # #### ### # ########### ####### ########### ##### # # #",
    "# #                                   #       # #    #   #                                       # # #",
    "# # ################################# ####### # # #### # ################################# ##### # # #",
    "# #   T                             #       # # #    # #                               # #     # # # #",
    "# ################################# # ##### # # #### # ################################# # ### # # # #",
    "#                                   # #     # # #      #                                 # #   # # # #",
    "##################################### ##### # # ###### ################################# # # # # # # #",
    "#                                           # # #        #                               # # # # # # #",
    "# ######################################### # # ######## ################################# # # # # # #",
    "# #   2     # #   3     # #   1     # #   4 # # #        # #   5     # #   6     # #   7 # # # # # # #",
    "# # ####### # # ####### # # ####### # # ### # # ######## # # ####### # # ####### # # ### # # # # # # #",
    "# #       # # #       # # #       # # #   # # #          # #       # # #       # # #   # # # # # # # #",
    "# ####### # # ####### # # ####### # # ### # # ################# ### # # ####### # # ### # # # # # # #",
    "#       # # #       # # #       # # #     # #                  #   # # #       # # #     # # # # # # #",
    "####### # # ####### # # ####### # # ##### # ################# # ### # # ####### # # ##### # # # # # #",
    "#     # # #       # # #       # # #       #                   #   # # #       # # #       # # # # # # #",
    "##### # # ####### # # ####### # # ####### ################### ### # # ####### # # ####### # # # # # #",
    "#   # # #       # # #       # # #       # #                   #   # # #       # # #       # # # # # # #",
    "### # # ####### # # ####### # # ####### # # ################# ### # # ####### # # ####### # # # # # #",
    "#   # #         # #         # #         # #                   #   # #         # #         # # # # # # #",
    "# # # ########### ########### ########### ################### ### # ########### ########### # # # # #",
    "# # #                                                         #   #                           # # # # #",
    "# # ################################################################### ####################### # # # #",
    "# #                                                                   #                         # # # #",
    "# ##################################################################### ######################### # # #",
    "#                                                                       #                         # # #",
    "####################################################################### ######################### # #",
    "#                                                                                                 # # #",
    "################################################################################################# # #",
    "#                                                                                                   # #",
    "##################################################################################################### #",
    "#                                                                                                     #",
    "####################################################################################################"
  ],
  objects: {
    "1": { "object": "sword" },
    "2": { "object": "shield" },
    "3": { "object": "potion" },
    "4": { "object": "key" },
    "5": { "object": "treasure" },
    "6": { "object": "scroll" },
    "7": { "object": "gem" },
    "T": { "object": "trap" }
  }
};

// Player position state - start in the open area
const playerPosition = new State({
  x: 15,
  y: 15,
  direction: 'east' as Direction
});

const movePlayer = (dx: number, dy: number) => {
  const current = playerPosition.value;
  const newX = Math.max(0, Math.min(largeDungeonMap.map[0].length - 1, current.x + dx));
  const newY = Math.max(0, Math.min(largeDungeonMap.map.length - 1, current.y + dy));
  
  let direction: Direction = current.direction;
  if (dx > 0) direction = 'east';
  else if (dx < 0) direction = 'west';
  else if (dy > 0) direction = 'south';
  else if (dy < 0) direction = 'north';
  
  playerPosition.value = { x: newX, y: newY, direction };
};

export const MapViewExample = () => (
  <Component border label="MapView Example:">
    <MapView
      align="center"
      map={largeDungeonMap}
      position={playerPosition}
      width={30}
      height={10}
      border
      gap={1}
    />
    
    <Text gap={1} width={50} wrap border>
      This is a test of very long text that should definitely wrap to multiple lines when the width is constrained to demonstrate the wrap functionality working properly.
    </Text>
    
    <Text gap={1} width={60} wrap border>
      Use the buttons to move the player around the large dungeon map. This text will wrap automatically and the component will grow in height to accommodate all the content, demonstrating the new wrap functionality!
      Current position: ({String(playerPosition.value.x)}, {String(playerPosition.value.y)}) facing {playerPosition.value.direction}
    </Text>
    
    <Row gap={1}>
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
    
    <Text gap={1} width="80%" wrap>
      Large Dungeon Map (100x43) - Test the centering logic! Navigate through corridors and rooms to see how the map viewport follows the player. The hash symbols (#) represent walls, numbers 1-7 represent different items you can find (sword, shield, potion, key, treasure, scroll, gem), and T represents a dangerous trap. The player is shown as a directional arrow (↑↓←→) at their current position in the dungeon.
    </Text>
  </Component>
);