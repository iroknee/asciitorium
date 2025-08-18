/** Single entry that runs on Web (DOM) and CLI (Terminal) */
import {
  App,
  Box,
  Text,
  State,
  AsciiArt,
  TextInput,
  PerfMonitor,
  CelticBorder,
  HR,
  loadAsciiAsset
} from 'asciitorium';

const appWidth = 64;
const appHeight = 30;

const helloWorld = new State('Hello, World!');

// Load the title ASCII art
const titleArt = await loadAsciiAsset('./art/asciitorium.txt');

// Construct the app
const app = (
  <App width={appWidth} height={appHeight} layout="relaxed">
    <CelticBorder align="top-left" />
    <CelticBorder align="top-right" />
    <CelticBorder align="bottom-left" />
    <CelticBorder align="bottom-right" />

    <Box align="top" layout="vertical" gap={2}>
      <AsciiArt content={titleArt} align="top" />
      <HR length={48} align="center" />
      <Text value="a ui framework for cli and web" align="top" gap={3} />
    </Box>

    <TextInput label="TextInput:" width={30} value={helloWorld} gap={2} align="center" />

    <Text value={helloWorld} width={appWidth - 24} align="bottom" gap={8} />
    <PerfMonitor align="bottom-right" gap={1} time memory fps cpu />
  </App>
);

await app.start();