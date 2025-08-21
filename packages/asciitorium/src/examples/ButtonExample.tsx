import { Text, State, Button, HR, Box } from '../index';

export const ButtonExample = () => {
  // State for button click count - local to each component instance
  const buttonClickCount = new State(0);

  return (
    <Box width={53} height={28} border={true} layout="vertical">
      <Text align="top" gap={{ top: 1, bottom: 1 }}>Button Example</Text>
      <HR align="top" length={51} />
      <Text align="center">Interactive button with click handling</Text>
      <Button
        label="I'm a Button!"
        align="center"
        onClick={() => (buttonClickCount.value = buttonClickCount.value + 1)}
        gap={{top: 4, bottom: 3}}
      />
      <Box layout="horizontal" gap={{left: 2, right: 2}} align="center">
        <Text>Click Count: </Text>
        <Text width={4}>{buttonClickCount}</Text>
      </Box>
      <Text align="center" width={40} height={3} gap={{top: 5}}>
        Use [Tab] to change component focus. Press [Enter] or [Space] to 'click it'.
      </Text>
    </Box>
  );
};
