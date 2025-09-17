import { Component, TabContainer, Tab, Text, Button, State } from '../index';
import { BaseStyle } from './constants';

export function TabsExample() {
  const selectedIndex = new State(0);
  const clickCount = new State(0);
  const clickCountText = new State(`Button clicked: ${clickCount.value} times`);

  // Update text when click count changes
  clickCount.subscribe((count) => {
    clickCountText.value = `Button clicked: ${count} times`;
  });

  return (
    <Component style={BaseStyle} label="TabContainer Example">
      <TabContainer gap={4}
        selectedIndex={selectedIndex}
      >
        <Tab label="Welcome">
          <Text align="center" width="60%">
            {`Welcome to the TabContainer example!
            This example showcases a TabContainer with three tabs:

            - Welcome
            - Interactive
            - Info

            Use the <- and -> arrow keys to switch between tabs.`}
          </Text>
        </Tab>
        <Tab label="Interactive">
          <Text 
            content={clickCountText}
            width={30}
            height={2}
            gap={1}
          />
          <Button
            label="Click Me!"
            onClick={() => clickCount.value++}
          />
        </Tab>
        
        <Tab label="Info">
          <Text width={40} align="center">
            {`TabContainer Features:

             - Composition-based design
             - Reuses existing Tabs component
             - Clean separation of concerns
             - Easy to extend and maintain

            Compare this to the original
            TabsExample to see the difference!`}
          </Text>
        </Tab>
      </TabContainer>
    </Component>
  );
}