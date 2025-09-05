import { Text, State, Button, Component, Row } from '../index';

export const ButtonExample = () => {
  // State for button click count - local to each component instance
  const buttonClickCount = new State(0);

  return (
    <Component height="fill" label="Button Example:" border>
      <Button
        label="I'm a Button!"
        align="center"
        onClick={() => (buttonClickCount.value = buttonClickCount.value + 1)}
        gap={2}
        height={10}
      />
      <Row align="center">
        <Text>Click Count:</Text>
        <Text width={4}>{buttonClickCount}</Text>
      </Row>
    </Component>
  );
};
