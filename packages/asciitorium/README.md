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
    <Text content="Enter your message:" />
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
