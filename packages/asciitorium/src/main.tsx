import {
  App,
  Text,
  AsciiArt,
  Select,
  Box,
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

// Component mapping
const examples: Record<string, any> = {
  Button: ButtonExample,
  Select: SelectExample,
  MultiSelect: MultiSelectExample,
  TextInput: TextInputExample,
  ProgressBar: ProgressBarExample,
  Tabs: TabsExample,
  Text: TextExample,
  AsciiArt: AsciiArtExample
};

// Create a wrapper component that dynamically switches based on state

class DynamicExampleWrapper extends Box {
  constructor() {
    super({ width: 53, height: 28 });

    // Initially set the current example
    this.updateExample();

    // Subscribe to changes in selectedComponent
    selectedComponent.subscribe(() => {
      this.updateExample();
    });
  }

  private updateExample() {
    // Properly remove existing children using removeChild to notify parent
    const childrenToRemove = [...this.children]; // Create copy to avoid mutation during iteration
    for (const child of childrenToRemove) {
      child.destroy();
      this.removeChild(child);
    }

    // Get the current example factory function
    const exampleFactory = examples[selectedComponent.value];
    if (exampleFactory) {
      // Call the factory function to create a new component instance
      const exampleComponent = exampleFactory();
      this.addChild(exampleComponent);
    } else {
      // Fallback for unknown component
      this.addChild(
        new Text({
          width: 40,
          height: 5,
          border: true,
          children: ['Unknown component'],
        })
      );
    }

    // Find the root App component and reset focus manager
    this.notifyAppOfFocusChange();
  }

  private notifyAppOfFocusChange() {
    // Walk up the parent chain to find the App
    let current: Component | undefined = this;
    while (current && current.constructor.name !== 'App') {
      current = current.parent;
    }

    // If we found the App, reset its focus manager
    if (current && (current as any).focus) {
      (current as any).focus.reset(current);
    }
  }
}

// Construct the app with horizontal layout
const app = (
  <App width={67} height={35}>
    <AsciiArt content={titleArt} align="center" gap={{ bottom: 2 }} />
    <Box layout="horizontal">
      {/* Left Panel - Navigation */}
      <Select
        label="Components:"
        width={25}
        height={28}
        items={componentList}
        selectedItem={selectedComponent}
        border
      />
      {/* Right Panel - Dynamic content */}
      {new DynamicExampleWrapper()}
    </Box>
  </App>
);

await app.start();
