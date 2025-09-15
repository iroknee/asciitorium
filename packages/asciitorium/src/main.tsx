import {
  App,
  Art,
  Select,
  Switch,
  Row,
  Text,
  PersistentState,
} from './index';

import {
  ButtonExample,
  CelticBorderExample,
  FormExample,
  MultiSelectExample,
  LayoutSizingExample,
  TabsExample,
  ArtExample,
  SlidersExample,
  MazeExample,
} from './examples';

// Main state for component selection with persistence
const selectedComponent = new PersistentState(
  'Art',
  'demo-selected-component'
);

// Component list for navigation
const componentList = [
  'Art',
  'Button',
  'CelticBorder',
  'Form',
  'Maze',
  'MultiSelect',
  'LayoutSizing',
  'Sliders',
  'Tabs',
];

// Component mapping for dynamic content
const examples = {
  Art: ArtExample,
  Button: ButtonExample,
  CelticBorder: CelticBorderExample,
  Form: FormExample,
  Maze: MazeExample,
  MultiSelect: MultiSelectExample,
  LayoutSizing: LayoutSizingExample,
  Sliders: SlidersExample,
  Tabs: TabsExample,
};

const app = (
  <App>
    <Art src={'./art/asciitorium.txt'} style={{ align: 'center', gap: { bottom: 2 } }} />
    <Row style={{ height: 'fill' }}>
      <Select
        label="Components:"
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
      content="Navigation: ↑↓ or W/S to browse • [Space]/[Enter] to select • [Tab] to switch focus"
      style={{ align: 'center', gap: { top: 1 } }}
    />
  </App>
);

await app.start();
