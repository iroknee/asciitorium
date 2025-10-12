import {
  App,
  Select,
  Switch,
  Row,
  Text,
  PerfMonitor,
  State,
  Keybind,
  PersistentState
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
  GameWorldExample,
} from 'asciitorium/examples';

// Main state for component selection with persistence
const selectedComponent = new PersistentState('Art', 'demo-selected-component');

// State for PerfMonitor visibility (F12 toggle)
const showPerfMonitor = new State(false);

// Component list for navigation
const componentList = [
  'Art',
  'Button',
  'CelticBorder',
  'Form',
  'Modal',
  'GameWorld',
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
  GameWorld: GameWorldExample,
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

    {/* <Art src="asciitorium" style={{ align: 'center', gap: 0 }}/> */}
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
