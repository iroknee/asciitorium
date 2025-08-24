import {
  App,
  AsciiArt,
  Select,
  Component,
  PersistentState,
  loadArt,
} from './index';

import {
  ButtonExample,
  CelticBorderExample,
  SelectExample,
  MultiSelectExample,
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
  TextInput: TextInputExample,
  Sliders: SlidersExample,
  Tabs: TabsExample,
  Text: TextExample,
  AsciiArt: AsciiArtExample,
};

const app = (
  <App width={64} height={35}>
    <AsciiArt content={titleArt} align="center" gap={{ bottom: 2 }} />
    <Component layout="row">
      <Select
        label="Components:"
        width={16}
        height={28}
        items={componentList}
        selectedItem={selectedComponent}
        border
      />
      <Component
        width={48}
        height={28}
        dynamicContent={{
          selectedKey: selectedComponent,
          componentMap: examples,
        }}
      />
    </Component>
  </App>
);

await app.start();
