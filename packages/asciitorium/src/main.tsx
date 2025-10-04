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
  FirstPersonViewExample,
} from './examples';

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
  'FirstPersonView',
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
  FirstPersonView: FirstPersonViewExample,
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
  <App font="PrintChar21">
    <Keybind
      keyBinding="p"
      action={togglePerfMonitor}
      global
    />

    <Art src="asciitorium" style={{ align: 'center', gap: 0 }}/>
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
