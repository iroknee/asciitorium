import {
  App,
  AsciiArt,
  Select,
  Component,
  Row,
  PersistentState,
  loadArt,
} from './index';

import {
  ButtonExample,
  CelticBorderExample,
  SelectExample,
  MultiSelectExample,
  RelativeSizingExample,
  TextInputExample,
  TabsExample,
  TextExample,
  AsciiArtExample,
  SlidersExample,
} from './examples';

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
  'Button',
  'CelticBorder',
  'MultiSelect',
  'RelativeSizing',
  'Select',
  'Sliders',
  'Tabs',
  'Text',
  'TextInput',
];

// Component mapping for dynamic content
const examples = {
  Button: ButtonExample,
  CelticBorder: CelticBorderExample,
  Select: SelectExample,
  MultiSelect: MultiSelectExample,
  RelativeSizing: RelativeSizingExample,
  TextInput: TextInputExample,
  Sliders: SlidersExample,
  Tabs: TabsExample,
  Text: TextExample,
  AsciiArt: AsciiArtExample,
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
