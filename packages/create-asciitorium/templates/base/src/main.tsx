import {
  App,
  AsciiArt,
  Select,
  Component,
  Row,
  Text,
  PersistentState,
  loadArt,
} from 'asciitorium';

import {
  ButtonExample,
  CelticBorderExample,
  FormExample,
  MultiSelectExample,
  RelativeSizingExample,
  TabsExample,
  AsciiArtExample,
  SlidersExample,
  AsciiMazeExample,
} from 'asciitorium/examples';

// Load the title ASCII art
const titleArt = await loadArt('./art/asciitorium.txt');

// Main state for component selection with persistence
const selectedComponent = new PersistentState(
  'AsciiArt',
  'demo-selected-component'
);

// Component list for navigation
const componentList = [
  'AsciiArt',
  'AsciiMaze',
  'Button',
  'CelticBorder',
  'Form',
  'MultiSelect',
  'RelativeSizing',
  'Sliders',
  'Tabs',
];

// Component mapping for dynamic content
const examples = {
  AsciiArt: AsciiArtExample,
  AsciiMaze: AsciiMazeExample,
  Button: ButtonExample,
  CelticBorder: CelticBorderExample,
  Form: FormExample,
  MultiSelect: MultiSelectExample,
  RelativeSizing: RelativeSizingExample,
  Sliders: SlidersExample,
  Tabs: TabsExample,
};

const app = (
  <App>
    <AsciiArt
      content={titleArt}
      style={{ align: 'center', gap: { bottom: 2 } }}
    />
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
      <Component
        style={{
          width: 'fill',
          height: 'fill',
        }}
        dynamicContent={{
          selectedKey: selectedComponent,
          componentMap: examples,
        }}
      />
    </Row>
    <Text
      content="Navigation: ↑↓ or W/S to browse • [Space]/[Enter] to select • [Tab] to switch focus"
      style={{ align: 'center', gap: { top: 1 } }}
    />
  </App>
);

await app.start();
