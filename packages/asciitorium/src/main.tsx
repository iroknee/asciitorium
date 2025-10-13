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
  GettingStartedDoc,
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
const selected = new State<any>(GettingStartedDoc);

// State for PerfMonitor visibility (F12 toggle)
const showPerfMonitor = new State(false);

// toggle PerfMonitor with "P" key
const togglePerfMonitor = () => {
  showPerfMonitor.value = !showPerfMonitor.value;
};

const app = (
  <App font="PrintChar21" width={80}>
    <Keybind keyBinding="p" action={togglePerfMonitor} global />

    <Art src="title" align="center" />
    <Text align="center" gap={1}>
      an ascii ui + game engine for web and cli
    </Text>
    <Row height="fill">
      <Select label="Docs" width="33%" height="fill" selected={selected}>
        <Option value={GettingStartedDoc}>Getting Started</Option>
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
    <Text align="center" gap={1}>
      ↑ ↓ to Nav • [Enter] to Select • [P] to enable Perf Monitor
    </Text>
    <PerfMonitor visible={showPerfMonitor} />
  </App>
);

await app.start();
