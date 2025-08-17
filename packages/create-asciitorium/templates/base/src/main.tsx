/** Single entry that runs on Web (DOM) and CLI (Terminal) */
import {
  App,
  Box,
  Text,
  State,
  AsciiArt,
  TextInput,
  PerfMonitor,
  HorizontalLine,
  loadAsciiAsset
} from 'asciitorium';


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

    <Box align="center" layout="horizontal" gap={3} >
      <Text value="Text Input:" align="center" />
      <TextInput width={30} value={helloWorld} />
    </Box>

    <Text value={helloWorld} width={appWidth - 24} align="center" gap={3} />

    <PerfMonitor align="center" time memory fps cpu />
  </App>
);

await app.start();
