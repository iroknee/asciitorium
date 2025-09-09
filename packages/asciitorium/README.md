# asciitorium

**asciitorium** (pronounced ascii-or-ium ,similar to plane-arium seen [here](https://youtu.be/oK5n9lPvaQk?feature=shared&t=5), is an ASCII-based ui framework that runs in both the web and cli. Designed to help develop cli interfaces quickly. Originally it was purposed to allow a Gen Xer to build games to the flavor of Wizardy I, Zork, etc. but frankly has gotten out of hand.

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
import { App, Text, State, AsciiArt, TextInput, HR } from 'asciitorium';

// Reactive state for user input
const userInput = new State('Hello, World!');

const app = (
  <App>
    <AsciiArt src="./art/asciitorium.txt" align="center" />
    <HR style={{ width: 60, align: 'center' }} />
    <Text style={{ align: 'center', gap: { bottom: 3 } }}>
      A UI framework for CLI and web
    </Text>

    <TextInput
      style={{ width: 40, align: 'center', gap: { bottom: 2 } }}
      value={userInput}
    />

    <Text align="center">{userInput}</Text>
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

Use the `style` prop to group related styling properties using either the style object, individual jsx properties, or both (individual props take precedence).

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

- [Examples](https://github.com/iroknee/asciitorium/tree/main/packages/asciitorium/src/examples) - Component examples and demos
- [GitHub Repository](https://github.com/iroknee/asciitorium)

## License

MIT
