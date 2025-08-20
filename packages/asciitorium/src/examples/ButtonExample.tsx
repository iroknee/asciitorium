import { Text, State, Button, HR, Box } from '../index';

export const ButtonExample = () => {
  // State for button click count - local to each component instance
  const buttonClickCount = new State(0);

  return (
    <Box width={53} height={28} border={true} layout="relaxed">
      <Text align="top" gap={1} content="Button Example" />
      <HR align="top" length={51} gap={3} />
      <Text
        align="top"
        gap={5}
        content="Interactive button with click handling"
      />
      <Button
        label="Click Me!"
        align="center"
        onClick={() => (buttonClickCount.value = buttonClickCount.value + 1)}
        gap={2}
      />
      <Text align="bottom" width={2} gap={7} children={[buttonClickCount]} />
      <Text
        align="bottom"
        width={40}
        height={3}
        gap={2}
        children={[
          'Use [Tab] to navigate between buttons. Press [Enter] or [Space] to activate.',
        ]}
      />
    </Box>
  );
};
