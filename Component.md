# Component Class Documentation

The `Component` class is the abstract base class for all UI components in the asciitorium framework. It provides the core functionality for rendering, layout management, state binding, and user interaction in ASCII-based interfaces.

## Overview

Every UI element in asciitorium extends from the `Component` class, which provides a consistent foundation for:

- **Character-based rendering** using 2D string arrays
- **Hierarchical component management** with parent-child relationships
- **Focus management** with visual indicators
- **Layout calculation** and automatic sizing
- **State binding** for reactive updates
- **Event handling** for user interaction

## Key Responsibilities

### 1. Rendering System

Components render themselves to a 2D character array buffer using ASCII characters. The rendering system supports:

- **Transparency**: Using the `‽` character for overlay effects
- **Borders**: Single-line borders (`╭╮╰╯─│`) that switch to double-line (`╔╗╚╝═║`) when focused
- **Labels**: Optional labels displayed on the top border
- **Z-index ordering**: Components render in order of their `z` property

```typescript
// Components render to a 2D string array
const buffer: string[][] = component.draw();
```

### 2. Layout Management

Components can manage child components using various layout algorithms:

- **Column Layout** (default): Children stacked vertically
- **Row Layout**: Children arranged horizontally
- **Fixed Layout**: Children positioned absolutely
- **Aligned Layout**: Children positioned with alignment options

```typescript
const container = new MyComponent({
  layout: 'column',
  layoutOptions: { spacing: 2 },
  children: [child1, child2, child3]
});
```

### 3. Size Management

Components support flexible sizing options:

- **Fixed sizes**: Explicit width/height in characters
- **Percentage sizes**: Relative to parent dimensions (`"50%"`)
- **Auto-sizing**: Automatically calculated from children
- **Responsive sizing**: Recalculated when parent or children change

```typescript
const component = new MyComponent({
  width: 20,        // Fixed width
  height: "50%",    // Percentage height
  // width omitted = auto-size based on children
});
```

### 4. Focus System

Components can participate in keyboard navigation:

- **Focusable components**: Set `focusable = true` to receive focus
- **Visual indicators**: Borders automatically change style when focused
- **Focus management**: Automatic focus traversal and management
- **Event handling**: Override `handleEvent()` for custom key handling

```typescript
class MyButton extends Component {
  constructor(props: ComponentProps) {
    super(props);
    this.focusable = true; // Can receive focus
  }

  handleEvent(event: string): boolean {
    if (event === 'Enter' || event === ' ') {
      this.onClick();
      return true; // Event handled
    }
    return false; // Event not handled
  }
}
```

### 5. State Binding

Components can bind to reactive state for automatic updates:

```typescript
const counter = new State(0);

const component = new MyComponent({});
component.bind(counter, (value) => {
  // Update component when counter changes
  this.updateDisplay(value);
});
```

### 6. Conditional Rendering

For dynamic content switching, use the dedicated `ConditionalRenderer` component:

```typescript
const selectedView = new State('home');

const container = (
  <ConditionalRenderer
    selectedKey={selectedView}
    componentMap={{
      'home': HomeComponent,
      'settings': () => new SettingsComponent({}),
      'about': new AboutComponent({})
    }}
    fallback={NotFoundComponent}
  />
);
```

## Core Properties

### Position and Size
- `x`, `y`: Absolute position coordinates
- `z`: Z-index for rendering order (higher values on top)
- `width`, `height`: Component dimensions
- `fixed`: Whether component uses fixed positioning

### Styling
- `border`: Whether to render a border
- `fill`: Character used for background fill
- `align`: Content alignment within the component
- `gap`: Spacing around the component

### Behavior
- `focusable`: Whether component can receive keyboard focus
- `hasFocus`: Current focus state
- `label`: Optional label displayed on border
- `showLabel`: Whether to display the label

## Component Lifecycle

### 1. Construction
```typescript
constructor(props: ComponentProps) {
  // Initialize properties from props
  // Set up children and layout
}
```

### 2. Layout Calculation
```typescript
recalculateLayout() {
  // Apply layout algorithm to children
  // Update auto-sizing based on children
  // Propagate changes up the hierarchy
}
```

### 3. Rendering
```typescript
draw(): string[][] {
  // Recalculate layout
  // Create render buffer
  // Draw borders and labels
  // Composite child components
  // Return final buffer
}
```

### 4. Cleanup
```typescript
destroy() {
  // Clean up state subscriptions
  // Remove event listeners
}
```

## Built-in Components

The framework includes many pre-built components that extend the base `Component` class:

- **Layout**: `Row`, `Column`, `Box`, `ConditionalRenderer`
- **Text**: `Text`, `TextInput`
- **Controls**: `Button`, `Select`, `MultiSelect`, `Tabs`
- **Visual**: `AsciiArt`, `AsciiMaze`, `CelticBorder`, `HR`, `VR`
- **Interactive**: `Sliders`, `GaugeSlider`
- **System**: `PerfMonitor`

## ConditionalRenderer Component

The `ConditionalRenderer` component provides React-inspired conditional rendering for dynamic content switching:

```typescript
import { ConditionalRenderer, State } from 'asciitorium';

const currentView = new State('dashboard');

const app = (
  <ConditionalRenderer
    selectedKey={currentView}
    componentMap={{
      'dashboard': DashboardComponent,
      'settings': SettingsComponent,
      'profile': () => new ProfileComponent({ userId: 123 })
    }}
    fallback={NotFoundComponent}
  />
);
```

**Key Features:**
- **Reactive Updates**: Automatically switches content when state changes
- **Multiple Component Types**: Supports instances, classes, and factory functions
- **Fallback Support**: Optional fallback component for missing keys
- **React-like API**: Familiar conditional rendering patterns

## Creating Custom Components

To create a custom component, extend the `Component` class:

```typescript
class CustomButton extends Component {
  private text: string;

  constructor(props: ComponentProps & { text: string }) {
    super(props);
    this.text = props.text;
    this.focusable = true;
    this.border = true;
  }

  draw(): string[][] {
    // Call parent draw for basic structure
    const buffer = super.draw();

    // Add custom rendering logic
    const startX = this.border ? 1 : 0;
    const startY = this.border ? 1 : 0;

    for (let i = 0; i < this.text.length && i < this.width - (this.border ? 2 : 0); i++) {
      if (startY < this.height && startX + i < this.width) {
        buffer[startY][startX + i] = this.text[i];
      }
    }

    return buffer;
  }

  handleEvent(event: string): boolean {
    if (event === 'Enter' || event === ' ') {
      // Handle button click
      return true;
    }
    return false;
  }
}
```

## Best Practices

### 1. Size Management
- Use auto-sizing when possible to create responsive layouts
- Provide explicit sizes for containers that need fixed dimensions
- Consider parent-child size relationships

### 2. Event Handling
- Always return `true` from `handleEvent()` if you handle the event
- Call `super.handleEvent()` if you need parent behavior
- Set `focusable = true` for interactive components

### 3. Performance
- Avoid unnecessary layout recalculations
- Use appropriate z-index values for layering
- Clean up state subscriptions in `destroy()`

### 4. Accessibility
- Use meaningful labels for components
- Ensure logical focus order
- Provide visual feedback for interactive elements

## Advanced Features

### State Integration
Components integrate seamlessly with the State system for reactive updates.

### Layout Flexibility
Multiple layout algorithms support different UI patterns from simple lists to complex aligned layouts.

### Cross-Platform Rendering
The same component code renders correctly in both web browsers (DOM) and terminal environments.

### Performance Monitoring
Built-in performance monitoring helps identify rendering bottlenecks in complex UIs.

---

The Component class provides a robust foundation for building ASCII-based user interfaces that work consistently across web and CLI environments. Its flexible architecture supports everything from simple text displays to complex interactive applications.