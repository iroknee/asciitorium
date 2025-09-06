import {
  App,
  AsciiArt,
  Select,
  Component,
  Row,
  PersistentState,
  loadArt,
} from 'asciitorium';

import {
  ButtonExample,
  CelticBorderExample,
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
  'Button',
  'demo-selected-component'
);

// Component list for navigation
const componentList = [
  'AsciiArt',
  'AsciiMaze',
  'Button',
  'CelticBorder',
  'MultiSelect',
  'RelativeSizing',
  'Select',
  'Sliders',
  'Tabs',
  'Text',
];

// Component mapping for dynamic content
const examples = {
  AsciiArt: AsciiArtExample,
  AsciiMaze: AsciiMazeExample,
  Button: ButtonExample,
  CelticBorder: CelticBorderExample,
  MultiSelect: MultiSelectExample,
  RelativeSizing: RelativeSizingExample,
  Sliders: SlidersExample,
  Tabs: TabsExample,
};

const app = (
  <App>
    <AsciiArt content={titleArt} align="center" gap={{ bottom: 2 }} />
    <Row height="fill">
      <Select
        label="Components:"
        width="30%"
        height="fill"
        items={componentList}
        selectedItem={selectedComponent}
        border
      />
      <Component
        width="fill"
        height="fill"
        dynamicContent={{
          selectedKey: selectedComponent,
          componentMap: examples,
        }}
      />
    </Row>
  </App>
);

await app.start();
