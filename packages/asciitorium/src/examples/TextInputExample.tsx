import { Text, State, TextInput, HR, Box } from '../index';

export const TextInputExample = () => {
  // States for text input components - local to each component instance
  const textInputValue = new State('Hello World');
  const numericInputValue = new State(42);

  return (
    <Box width={53} height={27} border={true} layout="vertical">
      <Text
        width={40}
        height={2}
        children={['TextInput Examples - String and Numeric inputs']}
      />
      <TextInput
        width={30}
        height={3}
        value={textInputValue}
        placeholder="Enter text here..."
        gap={1}
      />
      <TextInput
        width={30}
        height={3}
        value={numericInputValue}
        placeholder="Enter number..."
        numeric={true}
        gap={1}
      />
      <Text
        width={40}
        height={3}
        gap={1}
        children={[
          new State(
            `Text: "${textInputValue.value}"\nNumber: ${numericInputValue.value}`
          ),
        ]}
      />
      <HR length={40} gap={1} />
      <Text
        width={40}
        height={3}
        children={[
          'Focus inputs and type. Use arrow keys to move cursor.\nNumeric input restricts to numbers only.',
        ]}
      />
    </Box>
  );
};
