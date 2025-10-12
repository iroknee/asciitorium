import { Text, State, Button, Component, Row } from '../index';
import { BaseStyle } from './constants';

/**
 * Button Component Reference
 *
 * Interactive button with click handling and hotkey support.
 */
export const ButtonDoc = () => {
  // State for button click count - local to each component instance
  const buttonClickCount = new State(0);

  return (
    <Component style={BaseStyle} label="Button Component">
      <Button
        label="I'm a Button!"
        align="center"
        onClick={() => (buttonClickCount.value = buttonClickCount.value + 1)}
        gap={2}
        height={10}
        hotkey="B"
      />
      <Row align="center" width="fill">
        <Text>Click Count:</Text>
        <Text width={2} gap={1} align="center">
          {buttonClickCount}
        </Text>
      </Row>
    </Component>
  );
};
