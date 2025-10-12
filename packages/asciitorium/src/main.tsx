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
  ButtonExample,
  FormExample,
  ModalExample,
  MultiSelectExample,
  LayoutSizingExample,
  ScrollableTextExample,
  TabsExample,
  ArtExample,
  SlidersExample,
  DungeonCrawlerExample,
} from './examples';

// Main state for component selection with persistence
const selected = new State<any>(ArtExample);

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
      <Select label="Examples" width="33%" height="fill" selected={selected}>
        <Option value={ArtExample}>Art</Option>
        <Option value={ButtonExample}>Button</Option>
        <Option value={FormExample}>Form</Option>
        <Option value={ModalExample}>Modal</Option>
        <Option value={DungeonCrawlerExample}>Dungeon Crawler</Option>
        <Option value={MultiSelectExample}>MultiSelect</Option>
        <Option value={LayoutSizingExample}>LayoutSizing</Option>
        <Option value={ScrollableTextExample}>ScrollableText</Option>
        <Option value={SlidersExample}>Sliders</Option>
        <Option value={TabsExample}>Tabs</Option>
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
