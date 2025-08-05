import { AsciiArt } from '../components/AsciiArt';
import { Text } from '../components/Text';
import { HorizontalLine } from '../components/HorizontalLine';
import { Asciitorium } from '../core/Asciitorium';
import { State } from '../core/State';
import { HorizontalLayout } from '../core/layouts/HorizontalLayout';
import { bootstrap } from '../core/bootstrap';
import { loadAsciiAsset } from '../core/utils';
import { ListBox } from '../components/ListBox';

const slogans = [
  'A storefront for the command-line connoisseur.',
  'Every character counts.',
  'ASCII Emporium: Where text meets tech.',
  'Where devs shop in monospace...',
  'Every character matters. Even the @#$%! ones.',
  'It’s not just about good characters. It’s about strong alignment.',
];

const components = [
  'AsciiArt',
  'Button',
  'CelticBorder',
  'HorizontalLine',
  'ProgressBar',
  'Tabs',
  'Text',
  'TextInput',
  'VerticalLayout',
  'HorizontalLayout',
];

const randomSlogan = slogans[Math.floor(Math.random() * slogans.length)];
const appWidth = 64;
const appHeight = 34;

const selectedComponent = new State('AsciiArt');

// Load the title ASCII art
const titleArt = await loadAsciiAsset('./art/asciitorium.txt');
const owlArt = await loadAsciiAsset('./art/swing-stick.txt');

// Construct the app
const app = (
  <Asciitorium width={appWidth} height={appHeight}>
    <AsciiArt content={titleArt} align="center" />
    <HorizontalLine length={36} align="center" />
    <Text value="a ui framework for cli and web" align="top" height={3} />

    <HorizontalLayout width={appWidth} height={12}>
      <ListBox
        label="Components"
        width={appWidth / 2}
        height={12}
        items={components}
        selectedItem={selectedComponent}
      />
      <AsciiArt
        content={owlArt}
        border
        width={appWidth / 2}
        frameDurationMs={250}
        height={12}
      />
    </HorizontalLayout>
    <Text value={selectedComponent} width={appWidth} align="center" border />
    <Text value={randomSlogan} border width={appWidth} />
  </Asciitorium>
);

await bootstrap(app);
