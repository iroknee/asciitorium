import { AsciiArt } from './components/AsciiArt';
import { Box } from './components/Box';
import { PerfMonitor } from './components/PerfMonitor';
import { Text } from './components/Text';
import { HorizontalLine } from './components/HorizontalLine';
import { App } from './core/App';
import { State } from './core/State';
import { loadAsciiAsset } from './core/utils';
import { TextInput } from './components/TextInput';
import { CelticBorder } from './components/CelticBorder';

const appWidth = 64;
const appHeight = 30;

const helloWorld = new State('Hello, World!');

// Load the title ASCII art
const titleArt = await loadAsciiAsset('./art/asciitorium.txt');

// Construct the app
const app = (
  <App width={appWidth} height={appHeight} layout="relaxed">
    <CelticBorder edge="top-left" align="top-left" />
    <CelticBorder edge="top-right" align="top-right" />
    <CelticBorder edge="bottom-left" align="bottom-left" />
    <CelticBorder edge="bottom-right" align="bottom-right" />

    <Box align="top" layout="vertical" gap={2}>
      <AsciiArt content={titleArt} align="top" />
      <HorizontalLine length={48} align="center" />
      <Text value="a ui framework for cli and web" align="top" gap={3} />
    </Box>

    <TextInput label="TextInput:" width={30} value={helloWorld} gap={2} align="center" />

    <Text value={helloWorld} width={appWidth - 24} align="bottom" gap={8} />
    <PerfMonitor align="bottom-right" gap={1} time memory fps cpu />
  </App>
);

await app.start();
