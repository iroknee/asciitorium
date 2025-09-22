import {
  App,
  Art,
  Select,
  Switch,
  Row,
  Text,
  PerfMonitor,
  State,
  Keybind,
} from 'asciitorium';

import {
  ButtonExample,
  CelticBorderExample,
  FormExample,
  MultiSelectExample,
  LayoutSizingExample,
  ModalExample,
  TabsExample,
  ArtExample,
  SlidersExample,
  ScrollableTextExample,
  MazeExample,
} from 'asciitorium/examples';

// Main state for component selection with persistence
const selectedComponent = new State('Art');

// State for PerfMonitor visibility (P toggle)
const showPerfMonitor = new State(false);

// Component list for navigation
const componentList = [
  'Art',
  'Button',
  'CelticBorder',
  'Form',
  'Modal',
  'Maze',
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
  Maze: MazeExample,
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
  <App>
    <Keybind keyBinding="p" action={togglePerfMonitor} global />

    <Art
      src={'./art/asciitorium.txt'}
      style={{ align: 'center', gap: { bottom: 2 } }}
    />
    <Row style={{ height: 'fill' }}>
      <Select
        label="Components"
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
