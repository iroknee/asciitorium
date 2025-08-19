import { App, Box, Text, State, AsciiArt, CelticBorder, Select, HR } from './index';
import { loadAsciiAsset } from './core/utils';

const selectedOption = new State('Option 1');

// Load the title ASCII art
const titleArt = await loadAsciiAsset('./art/asciitorium.txt');

// Construct the app
const app = (
  <App width={64} height={20} layout="relaxed">
    <CelticBorder align="top-left" />
    <CelticBorder align="top-right" />
    <CelticBorder align="bottom-left" />
    <CelticBorder align="bottom-right" />

    <Box align="top" layout="vertical" gap={2}>
      <AsciiArt content={titleArt} align="top" />
      <HR length={48} align="center" />
      <Text value="a ui framework for cli and web" align="top" gap={3} />
    </Box>

    <Select 
      width={24}
      items={['Option 1', 'Option 2', 'Option 3', 'Long Option Name 4', 'Final Choice']} 
      selectedItem={selectedOption} 
      gap={5} 
      align="bottom" 
    />

    <Text value={selectedOption} width={24} align="bottom" gap={2} />
  </App>
);

await app.start();
