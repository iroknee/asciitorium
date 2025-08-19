import { App, Box, Text, State, AsciiArt, CelticBorder, Select, HR } from './index';
import { loadAsciiAsset } from './core/utils';

const selectedA = new State('Option 1');
const selectedB = new State('Option 1');


// Construct the app
const app = (
  <App width={64} height={20} layout="relaxed" border>

    <Select 
      label="Select Option A"
      width={24}
      height={8}
      items={['Option 1', 'Option 2', 'Option 3', 'Long Option Name 4', 'Final Choice']} 
      selectedItem={selectedA} 
      align="top-left" 
    />

    <Select 
      label="Select an Option"
      width={24}
      height={3}
      items={['Option 1', 'Option 2', 'Option 3', 'Long Option Name 4', 'Final Choice']} 
      selectedItem={selectedB} 
      align="top-right" 
    />

    <Text value={selectedB} width={24} align="bottom-left" gap={2} />
  </App>
);

await app.start();
