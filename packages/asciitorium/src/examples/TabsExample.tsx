import { Component, TabContainer, Tab, Text, Button, State } from '../index';

export function TabsExample() {
  const selectedIndex = new State(0);
  const clickCount = new State(0);
  const clickCountText = new State(`Button clicked: ${clickCount.value} times`);

  // Update text when click count changes
  clickCount.subscribe((count) => {
    clickCountText.value = `Button clicked: ${count} times`;
  });

  return (
    <Component height="fill" border label="TabContainer Example:">
      <TabContainer 
        selectedIndex={selectedIndex}
        gap={1}
      >
        <Tab label="Welcome">
          <Text 
            value="Welcome to TabContainer!\n\nThis demonstrates the new\ncomposition-based tab system.\n\nEach tab can contain any\ncomponent as its content."
            width={40}
            height={8}
          />
        </Tab>
        
        <Tab label="Interactive">
          <Text 
            value={clickCountText}
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
          <Text
            width={40}
            height={12}
          >
            TabContainer Features:
             - Composition-based design
             - Reuses existing Tabs component
             - Clean separation of concerns
             - Easy to extend and maintain

            Compare this to the original
            TabsExample to see the difference!
          </Text>
        </Tab>
      </TabContainer>
    </Component>
  );
}