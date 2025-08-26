import { Text, State, TextInput, Component, Row, VR } from '../index';

export const TextInputExample = () => {
  // States for text input components - local to each component instance
  const textInputValue = new State('Hello World');

  return (
    <Row label="TextInput Example:" border>
      <Component layout="aligned" width="60%">
        <Text>CLI Side</Text>
        <Text width={20} align="center" height={3} gap={{ left: 5, bottom: 4 }}>
          {textInputValue}
        </Text>
        <TextInput width="100%" align="bottom-left" value={textInputValue} />
      </Component>
      <VR height="100%" />
      <Component layout="aligned">
        <Text>LLM Side</Text>
        <Text width={20} align="center" height={3} gap={{ left: 5, bottom: 4 }}>
          {textInputValue}
        </Text>
        <TextInput
          width="100%"
          align="bottom"
          value={textInputValue}
          placeholder="Enter text here..."
        />
      </Component>
    </Row>
  );
};
