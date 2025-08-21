import { App, Text, Select, Box, Component, PersistentState } from './index';

// Import example components
import { ButtonExample } from './examples/ButtonExample';
import { SelectExample } from './examples/SelectExample';
import { TextInputExample } from './examples/TextInputExample';
import { ProgressBarExample } from './examples/ProgressBarExample';
import { TabsExample } from './examples/TabsExample';
import { TextExample } from './examples/TextExample';
import { LayoutExample } from './examples/LayoutExample';

// Main state for component selection with persistence
const selectedComponent = new PersistentState('Button', 'demo-selected-component');

// Component list for navigation
const componentList = [
  'Button',
  'Select & MultiSelect',
  'TextInput',
  'ProgressBar',
  'Tabs',
  'Text & AsciiArt',
  'Layout Components',
];

// Component mapping
const examples: Record<string, any> = {
  Button: ButtonExample,
  'Select & MultiSelect': SelectExample,
  TextInput: TextInputExample,
  ProgressBar: ProgressBarExample,
  Tabs: TabsExample,
  'Text & AsciiArt': TextExample,
  'Layout Components': LayoutExample,
};

// Create a wrapper component that dynamically switches based on state

class DynamicExampleWrapper extends Box {
  constructor() {
    super({ width: 53, height: 28, layout: 'relaxed' });

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
  <App width={80} height={30} layout="horizontal">
    {/* Left Panel - Navigation */}
    <Select
      label="Components"
      width={25}
      height={28}
      items={componentList}
      selectedItem={selectedComponent}
      border
    />
    {/* Right Panel - Dynamic content */}
    {new DynamicExampleWrapper()}
  </App>
);

await app.start();
