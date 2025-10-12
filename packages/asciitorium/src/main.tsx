import {
  App,
  Art,
  Select,
  Switch,
  Row,
  Text,
  PersistentState,
  PerfMonitor,
  State,
  Keybind,
  Line,
} from './index';

import {
  ButtonExample,
  CelticBorderExample,
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
const selectedComponent = new PersistentState('Art', 'selected-example');

// State for PerfMonitor visibility (F12 toggle)
const showPerfMonitor = new State(false);

// Component list for navigation
const componentList = [
  'Art',
  'Button',
  'CelticBorder',
  'Form',
  'Modal',
  'DungeonCrawler',
  'MultiSelect',
  'LayoutSizing',
  'ScrollableText',
  'Sliders',
  'Tabs',
];

// Component mapping for dynamic content
const examples = {
  Art: ArtExample,
  Button: ButtonExample,
  CelticBorder: CelticBorderExample,
  Form: FormExample,
  Modal: ModalExample,
  DungeonCrawler: DungeonCrawlerExample,
  MultiSelect: MultiSelectExample,
  LayoutSizing: LayoutSizingExample,
  ScrollableText: ScrollableTextExample,
  Sliders: SlidersExample,
  Tabs: TabsExample,
};

// toggle PerfMonitor with "P" key
const togglePerfMonitor = () => {
  showPerfMonitor.value = !showPerfMonitor.value;
};

const app = (
  <App font="PrintChar21" height={42}>
    <Keybind keyBinding="p" action={togglePerfMonitor} global />

    <Art src="title" style={{ align: 'center', gap: 0 }} />
    <Text align="center" gap={1}>
      an ascii ui + game engine for web and cli
    </Text>
    <Line />
    <Row style={{ height: 'fill' }}>
      <Select
        label="Examples"
        style={{
          width: '30%',
          height: 'fill',
        }}
        items={componentList}
        selectedItem={selectedComponent}
      />
      <Switch
        style={{
          width: 'fill',
          height: 'fill',
        }}
        selectedKey={selectedComponent}
        componentMap={examples}
      />
    </Row>
    <Text
      content="Navigation: ↑↓ • [Space]/[Enter] to select • [Tab]/[Tab+Shift] to switch focus • [P] toggles performance monitor"
      style={{ align: 'center', gap: 1 }}
    />
    <PerfMonitor visible={showPerfMonitor} />
  </App>
);

await app.start();
