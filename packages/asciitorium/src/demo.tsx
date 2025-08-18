import { App, Box, Text, State, AsciiArt, CelticBorder, TextInput, HR } from './index';
import { loadAsciiAsset } from './core/utils';

const helloWorld = new State('Hello, World!');

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

    <TextInput width={30} value={helloWorld} gap={5} align="bottom" />

    <Text value={helloWorld} width={24} align="bottom" gap={2} />
  </App>
);

await app.start();
