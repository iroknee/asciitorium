import { Text, State, Button, HR, Box } from 'asciitorium';

export const ButtonExample = () => {
  // State for button click count - local to each component instance
  const buttonClickCount = new State(0);

  return (
    <Box width={42} height={28} label="Button Example:" border>
      <Button
        label="I'm a Button!"
        align="center"
        onClick={() => (buttonClickCount.value = buttonClickCount.value + 1)}
        gap={{top: 4, bottom: 3}}
      />
      <Box layout="row" gap={{left: 6, right: 2}} align="center">
        <Text>Click Count: </Text>
        <Text width={4}>{buttonClickCount}</Text>
      </Box>
    </Box>
  );
};
