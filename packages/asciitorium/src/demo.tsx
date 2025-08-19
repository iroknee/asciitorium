import { App, Text, State, Select, MultiSelect } from './index';
const select = new State('Option 1');
const multi = new State(['Option 2']);

// Construct the app
const app = (
  <App width={48} height={24} layout="relaxed" border>

    <Select 
      label="Select"
      width={16}
      height={10}
      items={['Option 1', 'Option 2', 'Option 3', 'Option 4']} 
      selectedItem={select} 
      align="top-left"
      gap={2} 
    />

    <MultiSelect 
      label="MultiSelect"
      width={16}
      height={10}
      items={['Option 1', 'Option 2', 'Option 3', 'Option 4', 'Option 5']} 
      selectedItems={multi} 
      align="top-right"
      gap={2} 
    />

    <Text width={24} align="bottom-left" gap={3}>{select}</Text>
    <Text width={24} content={multi} align="bottom-right" gap={2} />
  </App>
);

await app.start();
