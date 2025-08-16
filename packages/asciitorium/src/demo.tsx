import { AsciiArt } from './components/AsciiArt';
import { Box } from './components/Box';
import { PerfMonitor } from './components/PerfMonitor';
import { Text } from './components/Text';
import { HorizontalLine } from './components/HorizontalLine';
import { App } from './core/App';
import { State } from './core/State';
import { start } from './core/bootstrap';
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
  <App width={appWidth} height={appHeight}>
    <CelticBorder corner="topLeft" fixed x={0} y={0} />
    <CelticBorder corner="topRight" fixed x={appWidth - 8} y={0} />
    <CelticBorder corner="bottomLeft" fixed x={0} y={appHeight - 8} />
    <CelticBorder corner="bottomRight" fixed x={appWidth - 8} y={appHeight - 8} />

    <Text value="" align="center" height={2} comment="vertical spacing" />
    <AsciiArt content={titleArt} align="center" />
    <HorizontalLine length={48} align="center" />
    <Text value="a ui framework for cli and web" align="top" height={5} />

    <Box width={appWidth - 21} height={3} align="center" layout="horizontal">
      <Text value="Text Input:" align="center" />
      <TextInput width={30} value={helloWorld} />
    </Box>

    <Text value="" align="top" height={3} comment="vertical spacing" />
    <Text value={helloWorld} width={appWidth - 24} align="center" />
    <Text value="" align="top" height={3} comment="vertical spacing" />

    <PerfMonitor align="center" time memory fps cpu />
  </App>
);

await start(app);

// --- Demo: Set progress to a random value every 10s ---
const randInt = (min: number, max: number) =>
  Math.floor(Math.random() * (max - min + 1)) + min;

setInterval(() => {
  const newLoadingvalue = randInt(0, 100);
  loading.value = newLoadingvalue;
}, 5_000);
