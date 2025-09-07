# asciitorium

A UI framework for building retro terminal interfaces that run in both web browsers and CLI environments. Designed to help develop cli interfaces quickly.

## Installation

```bash
npm create asciitorium@latest my-app
```

Or install directly:

```bash
npm install asciitorium
```

## Quick Start

```tsx
import { App, Text, TextInput, State } from 'asciitorium';

const message = new State('Hello, World!');

const app = (
  <App>
    <Text>Enter your message:</Text>
    <TextInput value={message} width={40} />
    <Text content={message} />
  </App>
);

await app.start();
```

## Features

- **Cross-platform**: Runs identically in web browsers and terminals
- **Responsive**: Auto-detects screen size and supports percentage-based sizing
- **Zero dependencies**: Lightweight with no runtime dependencies
- **TypeScript**: Full TypeScript support with custom JSX runtime
- **Component-based**: Supports JSX and React-like component architecture

## Built-in Components

### Layout

- `App` - Root container with screen detection
- `Row` / `Column` - Flexbox-style layouts
- `Component` - Base component with positioning

### UI Elements

- `Text` - Static and dynamic text display with word wrapping
- `Button` - Interactive buttons with press effects
- `TextInput` - Text input fields with Enter key handling
- `Select` / `MultiSelect` - Selection lists with improved focus indicators
- `Tab` / `TabContainer` - Individual tabs and tabbed interface containers
- `Sliders` - Various slider components (ProgressBar, Gauge, Dot, Vertical)
- `PerfMonitor` - Performance monitoring display

### Decorative

- `AsciiArt` - Display ASCII art images and animations
- `AsciiMaze` - ASCII maze display
- `CelticBorder` - Decorative borders
- `HR` / `VR` - Horizontal/vertical rules

## Styling Components

All components support both individual styling properties and a consolidated `style` prop for cleaner code organization.

### Style Property

Use the `style` prop to group related styling properties:

```tsx
// Using style object
<Text
  style={{
    width: 200,
    height: 50,
    border: true,
    align: "center",
    fill: '·'
  }}>
  centered text
</Text>

// Individual properties
<Text
  width={200}
  height={50}
  border
  align="center"
  fill='·'
  content="Styled text"
/>

// Mixing both (individual props take precedence)
const formText = {
    width: 10, 
    border: true
};

<Text
  style={formText}
  align="center"
  content="Mixed styling"
/>
```

### Available Style Properties

- `width` / `height` - Size values (number, percentage, 'auto', 'fill')
- `border` - Show border around component
- `fill` - Fill character for component background
- `align` - Alignment ('left', 'center', 'right', 'top', 'bottom', etc.)
- `x` / `y` / `z` - Positioning coordinates and layer depth
- `gap` - Spacing around component (number or object with top/bottom/left/right)

## Development

### Web Mode

```bash
npm run web
```

Opens in browser at http://localhost:5173

### CLI Mode

```bash
npm run cli
```

Renders directly to terminal

## Documentation

- [Examples](src/examples/) - Component examples and demos
- [GitHub Repository](https://github.com/iroknee/asciitorium)

## License

MIT
