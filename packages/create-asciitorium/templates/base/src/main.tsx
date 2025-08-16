/** Single entry that runs on Web (DOM) and CLI (Terminal) */
import {
  Text,
  State,
  AsciiArt,
  TextInput,
  Asciitorium,
  ProgressBar,
  CelticBorder,
  HorizontalLine,
  HorizontalLayout,
  loadAsciiAsset,
  start,
} from 'asciitorium';

const appWidth = 64;
const appHeight = 26;

const loading = new State(0);
const helloWorld = new State('Hello, World!');

// Load the title ASCII art
const titleArt = await loadAsciiAsset('./art/asciitorium.txt');

// Construct the app
const app = (
  <Asciitorium width={appWidth} height={appHeight}>
    <CelticBorder corner="topLeft" fixed x={0} y={0} />
    <CelticBorder corner="topRight" fixed x={appWidth - 8} y={0} />
    <CelticBorder corner="bottomLeft" fixed x={0} y={appHeight - 8} />
    <CelticBorder
      corner="bottomRight"
      fixed
      x={appWidth - 8}
      y={appHeight - 8}
    />

    <Text value="" align="center" height={2} comment="vertical spacing" />
    <AsciiArt content={titleArt} align="center" />
    <HorizontalLine length={48} align="center" />
    <Text value="a ui framework for cli and web" align="top" height={5} />

    <HorizontalLayout width={appWidth - 22} height={3} align="center">
      <Text value="Text Input:" align="center" />
      <TextInput width={30} value={helloWorld} />
    </HorizontalLayout>

    <Text value={helloWorld} width={appWidth - 24} align="center" height={4} />

    <HorizontalLayout width={appWidth - 24} height={4} align="center">
      <Text value="loading:" align="center" />
      <ProgressBar width={30} percent={loading} align="center" showPercentage />
    </HorizontalLayout>
  </Asciitorium>
);

await start(app);

// --- Demo: Set progress to a random value every 10s ---
const randInt = (min: number, max: number) =>
  Math.floor(Math.random() * (max - min + 1)) + min;

setInterval(() => {
  const newLoadingvalue = randInt(0, 100);
  loading.value = newLoadingvalue;
}, 5_000);
