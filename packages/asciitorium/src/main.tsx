import {
  App,
  AsciiArt,
  Select,
  Component,
  PersistentState,
  loadArt,
} from './index';

// Import example components
import { ButtonExample } from './examples/ButtonExample';
import { SelectExample } from './examples/SelectExample';
import { MultiSelectExample } from './examples/MultiSelectExample';
import { TextInputExample } from './examples/TextInputExample';
import { ProgressBarExample } from './examples/ProgressBarExample';
import { TabsExample } from './examples/TabsExample';
import { TextExample } from './examples/TextExample';
import { AsciiArtExample } from './examples/AsciiArtExample';

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
  'MultiSelect',
  'ProgressBar',
  'Select',
  'Tabs',
  'Text',
  'TextInput'
];

// Component mapping for dynamic content
const examples = {
  Button: ButtonExample,
  Select: SelectExample,
  MultiSelect: MultiSelectExample,
  TextInput: TextInputExample,
  ProgressBar: ProgressBarExample,
  Tabs: TabsExample,
  Text: TextExample,
  AsciiArt: AsciiArtExample
};


// Construct the app with row layout
const app = (
  <App width={67} height={35}>
    <AsciiArt content={titleArt} align="center" gap={{ bottom: 2 }} />
    <Component layout="row">
      <Select
        label="Components:"
        width={25}
        height={28}
        items={componentList}
        selectedItem={selectedComponent}
        border
      />
      <Component 
        width={53} 
        height={28}
        dynamicContent={{
          selectedKey: selectedComponent,
          componentMap: examples
        }}
      />
    </Component>
  </App>
);

await app.start();
