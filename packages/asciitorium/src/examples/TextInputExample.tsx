import { Text, State, TextInput, HR, Component } from '../index';

export const TextInputExample = () => {
  // States for text input components - local to each component instance
  const textInputValue = new State('Hello World');

  return (
    <Component width={42} height={28} label="TextInput Example:" border>
      <TextInput
        gap={{ top: 2 }}
        width={20}
        align="center"
        value={textInputValue}
        placeholder="Enter text here..."
      />
      <Text width={20} align="center" height={3} gap={{ left: 5, bottom: 4 }}>
        {textInputValue}
      </Text>

      <Text align="center" width={30} height={3}>
        Use arrow keys to move cursor. Numeric input restricts to numbers only.
      </Text>
    </Component>
  );
};
