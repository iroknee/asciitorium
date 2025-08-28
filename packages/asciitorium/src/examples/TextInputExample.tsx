import { Text, State, TextInput, Column } from '../index';

export const TextInputExample = () => {
  const inputValue = new State('');
  const log = new State<string[]>([]);
  const logDisplay = new State('Welcome! Type something and press Enter...');

  const responses = [
    'Oh hello there!',
    'That\'s interesting!',
    'Tell me more about that.',
    'I see what you mean.',
    'Fascinating perspective!',
    'How intriguing!',
    'That makes sense.',
    'What an interesting observation!'
  ];

  const addToLog = (message: string) => {
    log.value = [...log.value, message].slice(-10);
    logDisplay.value = log.value.join('\n');
  };

  const simulateBotResponse = () => {
    // Add thinking indicator
    addToLog('...thinking...');
    
    // Replace with actual response after delay
    setTimeout(() => {
      log.value = log.value.slice(0, -1); // Remove thinking message
      const response = responses[Math.floor(Math.random() * responses.length)];
      addToLog(`Bot: ${response}`);
    }, 1500);
  };

  return (
    <Column label="TextInput Chat Demo" border>
      <Text width="100%" height="fill" content={logDisplay} border/>
      <TextInput
        width="100%"
        value={inputValue}
        placeholder="Type your message here..."
        onEnter={() => {
          if (inputValue.value.trim()) {
            addToLog(`You: ${inputValue.value}`);
            inputValue.value = '';
            simulateBotResponse();
          }
        }}
      />
    </Column>
  );
};
