import { AsciiArt } from '../components/AsciiArt';
import { Text } from '../components/Text';
import { HorizontalLine } from '../components/HorizontalLine';
import { Asciitorium } from '../core/Asciitorium';
import { State } from '../core/State';
import { TextInput } from '../components/TextInput';
import { HorizontalLayout } from '../core/layouts/HorizontalLayout';
import { bootstrap } from '../core/bootstrap';
import { loadAsciiAsset } from '../core/utils';

const message = new State('Hi');
const appWidth = 64;
const appHeight = 34;
const titleArt = await loadAsciiAsset('./art/asciitorium.txt');

const app = (
  <Asciitorium width={appWidth} height={appHeight}>
    <AsciiArt content={titleArt} align="center"/>
    <HorizontalLine length={36} align="center" />
    <Text value="an ASCII-based UI framework" align="top" height={4} />
    <HorizontalLayout width={appWidth} border height={appHeight - 16}>
      <TextInput label="Input" width={16} text={message} align="center" />
      <Text value="Label:" align="center" />
      <Text value={message} width={15} align="center" />
    </HorizontalLayout>
  </Asciitorium>
);

(async () => {
  await bootstrap(app);
})();
