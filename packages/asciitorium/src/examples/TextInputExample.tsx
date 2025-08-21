import { Text, State, TextInput, HR, Box } from '../index';

export const TextInputExample = () => {
  // States for text input components - local to each component instance
  const textInputValue = new State('Hello World');
  const numericInputValue = new State(42);

  return (
    <Box width={53} height={27} border={true} layout="vertical">
      <Text content="TextInput Examples" align="center" gap={1} border/>
      <HR length={51} gap={1} />

      <Text content="String and Numeric inputs" align="center" gap={4}/>
      <TextInput
        label="String"
        width={30}
        height={3}
        value={textInputValue}
        placeholder="Enter text here..."    
        gap={1}
      />
      <TextInput
        label="Number"
        width={30}
        height={3}
        value={numericInputValue}
        placeholder="Enter number..."
        numeric={true}
        gap={1}
      />
      <Text
        width={40}
        align="center"
        height={3}
        gap={1}
        children={[
          new State(
            `Text: "${textInputValue.value}", Number: ${numericInputValue.value}`
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
