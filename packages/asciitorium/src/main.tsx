import {
  App,
  Art,
  Select,
  Option,
  Switch,
  Row,
  Text,
  PerfMonitor,
  State,
  Keybind,
  Line,
} from './index';

import {
  ButtonDoc,
  FormDoc,
  ModalDoc,
  LayoutSizingDoc,
  ScrollableTextDoc,
  TabsDoc,
  ArtDoc,
  SlidersDoc,
  DungeonCrawlerDoc,
} from './docs';

// Main state for component selection with persistence
const selected = new State<any>(ArtDoc);

// State for PerfMonitor visibility (F12 toggle)
const showPerfMonitor = new State(false);

// toggle PerfMonitor with "P" key
const togglePerfMonitor = () => {
  showPerfMonitor.value = !showPerfMonitor.value;
};

const app = (
  <App font="PrintChar21" height={42}>
    <Keybind keyBinding="p" action={togglePerfMonitor} global />

    <Art src="title" align="center" />
    <Text align="center" gap={1}>
      an ascii ui + game engine for web and cli
    </Text>
    <Line />
    <Row height="fill">
      <Select label="Docs" width="33%" height="fill" selected={selected}>
        <Option value={ArtDoc}>Art</Option>
        <Option value={ButtonDoc}>Button</Option>
        <Option value={FormDoc}>Form</Option>
        <Option value={ModalDoc}>Modal</Option>
        <Option value={DungeonCrawlerDoc}>Dungeon Crawler</Option>
        <Option value={LayoutSizingDoc}>Layout & Sizing</Option>
        <Option value={ScrollableTextDoc}>Scrollable Text</Option>
        <Option value={SlidersDoc}>Sliders</Option>
        <Option value={TabsDoc}>Tabs</Option>
      </Select>
      <Switch width="fill" height="fill" component={selected} />
    </Row>
    <Text
      content="Navigation: ↑↓ • [Space]/[Enter] to select • [Tab]/[Tab+Shift] to switch focus • [P] toggles performance monitor"
      align="center"
      gap={1}
    />
    <PerfMonitor visible={showPerfMonitor} />
  </App>
);

await app.start();
