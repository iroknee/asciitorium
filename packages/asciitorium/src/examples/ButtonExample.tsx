import { Text, State, Button, Component, Column } from '../index';
import { BaseStyle } from './constants';

export const ButtonExample = () => {
  // State for button click count - local to each component instance
  const buttonClickCount = new State(0);

  return (
    <Component style={BaseStyle} label="Button Example">
      <Button
        label="I'm a Button!"
        align="center"
        onClick={() => (buttonClickCount.value = buttonClickCount.value + 1)}
        gap={2}
        height={10}
        hotkey="B"
      />
      <Column align="center">
        <Text>Click Count:</Text>
        <Text width={2} gap={1} align="center">
          {buttonClickCount}
        </Text>
      </Column>
    </Component>
  );
};
