import { Art, State, Text, Switch, Column } from "../index.js";

// Component with first sprite
const Part1 = () => {
  return <Text width={30} typewriter>Testing 1... 2... 3...</Text>;
};

// Component with second sprite - this should fail when switched to
const Part2 = () => {
  return (
    <Column>
      <Art src="pyramid" />
    </Column>
  );
};

export const ArtRaceConditionTest = () => {
  const currentPart = new State<any>(Part1);

  // Switch to Part2 after 500ms to trigger the race condition
  setTimeout(() => {
    console.log('Switching to Part2 (pyramid sprite)...');
    currentPart.value = Part2;
  }, 2000);

  return <Switch component={currentPart} />;
};
