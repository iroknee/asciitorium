import { AsciiArt } from './components/AsciiArt';
import { Box } from './components/Box';
import { PerfMonitor } from './components/PerfMonitor';
import { Text } from './components/Text';
import { HorizontalLine } from './components/HorizontalLine';
import { App } from './core/App';
import { State } from './core/State';
import { loadAsciiAsset } from './core/utils';
import { TextInput } from './components/TextInput';

const appWidth = 64;
const appHeight = 30;

const helloWorld = new State('Hello, World!');

// Load the title ASCII art
const titleArt = await loadAsciiAsset('./art/asciitorium.txt');

// Construct the app
const app = (
  <App width={appWidth} height={appHeight} border>

    <AsciiArt content={titleArt} align="center" label="Asciitorium" />
    <HorizontalLine length={48} align="center" />
    <Text value="a ui framework for cli and web" align="top" gap={3} />

    <Box align="center" layout="horizontal" gap={3} border>
      <Text value="Text Input:" align="center" />
      <TextInput width={30} value={helloWorld} />
    </Box>

    <Text value={helloWorld} width={appWidth - 24} align="center" gap={3} />

    <PerfMonitor align="center" time memory fps cpu />
  </App>
);

await app.start();
