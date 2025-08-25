# asciitorium

**asciitorium** is a UI framework for building retro terminal interfaces that fully function in the browser as well as on the cli.  
Why? I am still not sure 🙂. But it started with wanting to create a text-based game reminiscent of **Wizardry I**, **Zork**, and **Bard's Tale** from the 80s. I realized it would be fun to create a UI framework while I was at it — given my experience with React, here is that first pass.

## Installation

> It is recommended that you use the create-asciitorium installer.

```bash
npm create asciitorium@latest my-app
```

## Quick Start

### Basic Example

update the src/main.tsx:

```tsx
import { App, Text, TextInput, State } from 'asciitorium';

const message = new State('Hello, World!');

const app = (
  <App width={50} height={10}>
    <Text content="Enter your message:" />
    <TextInput value={message} width={40} />
    <Text content={message} />
  </App>
);

await app.start();
```

## 🖥️ Screen Size Detection & Responsive Design

Asciitorium automatically detects the available screen size in both web and terminal environments:

### Auto-sizing to Screen

```tsx
// App automatically sizes to fill available screen space
const app = (
  <App>
    {' '}
    {/* No width/height = auto-detect screen size */}
    <Text content="This app fills the entire screen!" />
  </App>
);
```

### Screen Size Detection

- **Web Environment**: Measures character dimensions and calculates available space
- **Terminal Environment**: Uses `process.stdout.columns` and `process.stdout.rows`
- **Dynamic Resizing**: Automatically adjusts when window/terminal is resized
- **Fallback Values**: Defaults to 80x24 if detection fails

### Relative Sizing System

Asciitorium supports flexible sizing with multiple unit types:

```tsx
// Percentage-based responsive layout
<App>
  <Row width="100%" height="50%">
    <Text width="25%">Quarter</Text>
    <Text width="50%">Half</Text>
    <Text width="25%">Quarter</Text>
  </Row>
  <Text width="fit" height={10}>
    Fill remaining space
  </Text>
</App>
```

#### Size Value Types

- **`number`** - Absolute size in characters (e.g., `width={20}`)
- **`"50%"`** - Percentage of parent container
- **`"auto"`** - Size automatically to content
- **`"fit"`** - Fill all available space

#### Nested Responsive Containers

```tsx
<Component width="80%" height="60%">
  <Component width="50%" height="100%">
    {' '}
    {/* 50% of 80% = 40% of screen */}
    <Text width="100%">Nested content</Text>
  </Component>
</Component>
```

#### Mixed Sizing Approaches

```tsx
<Row width="100%">
  <Text width={20}>Fixed 20 chars</Text>
  <Text width="30%">30% of parent</Text>
  <Text width="fit">Fill remaining</Text>
</Row>
```

## Built-in Components

### Layout Components

- **`App`** - Root application container with automatic screen size detection
- **`Component`** - Base component class with responsive sizing and customizable layout
- **`Row`** - Horizontal layout container (convenience wrapper)
- **`Column`** - Vertical layout container (convenience wrapper)

### UI Components

- **`Tabs`** - Tabbed interface containers
- **`Text`** - Display static or dynamic text
- **`Button`** - Interactive buttons with click handlers
- **`Select`** - Selectable lists with keyboard navigation
- **`AsciiArt`** - Display ASCII art from files
- **`TextInput`** - Text input fields
- **`GaugeSlider`** - Horizontal slider with diamond indicator
- **`ProgressBarSlider`** - Progress bar style slider with filled track
- **`DotSlider`** - Dot-based horizontal slider
- **`VerticalSlider`** - Vertical slider with filled bar
- **`MultiSelect`** - Multi-selection lists with checkboxes
- **`PerfMonitor`** - Performance monitoring display
- **`CelticBorder`** - Decorative borders
- **`HR`** - Decorative horizontal dividers
- **`VR`** - Decorative vertical dividers

### Component Reference

#### App Component

The root application container with built-in screen size detection and responsive capabilities.

**Features:**

- **Auto Screen Size Detection**: Automatically detects terminal/browser dimensions
- **Dynamic Resizing**: Responds to window/terminal resize events
- **Responsive Sizing**: Supports percentage-based and flexible sizing for children
- **Cross-Platform**: Works identically in web browsers and terminal environments

**Props:**

- `width?: SizeValue` - App width (defaults to detected screen width)
- `height?: SizeValue` - App height (defaults to detected screen height)
- `fit?: boolean` - Whether children should fit available space
- All standard `ComponentProps`

**Examples:**

```tsx
// Auto-size to screen
<App>
  <Text content="Fills entire screen" />
</App>

// Fixed size
<App width={80} height={24}>
  <Text content="Fixed 80x24 terminal size" />
</App>

// Responsive with percentage
<App width="90%" height="100%">
  <Text content="90% of screen width, full height" />
</App>
```

#### Row and Column

Convenience components that extend `Component` with predefined layouts:

**Row Component:**

- Automatically applies `layout="row"` (horizontal layout)
- Children are arranged left-to-right
- Supports optional `fit` prop to make children fill available width

**Column Component:**

- Automatically applies `layout="column"` (vertical layout)
- Children are arranged top-to-bottom (default behavior)
- Supports optional `fit` prop to make children fill available height

**Props:**

- `fit?: boolean` - Whether children should fit/fill available space
- All standard `ComponentProps` except `layout` (which is fixed)

**Examples:**

```tsx
// Horizontal layout with fitted children
<Row fit border width={40} height={5}>
  <Button>Left</Button>
  <Button>Center</Button>
  <Button>Right</Button>
</Row>

// Responsive horizontal layout
<Row width="100%" height={5}>
  <Button width="25%">Quarter</Button>
  <Button width="50%">Half</Button>
  <Button width="fit">Remaining</Button>
</Row>

// Vertical layout with percentage sizing
<Column border width="50%" height="100%">
  <Text height="30%">Top text</Text>
  <Text height="40%">Middle text</Text>
  <Text height="fit">Bottom fills remaining</Text>
</Column>

// Equivalent using Component directly
<Component layout="row" fit width="100%">
  <Button width="fit">Button 1</Button>
  <Button width="fit">Button 2</Button>
</Component>
```

### Layout System

Asciitorium provides a flexible, responsive layout system that automatically positions components within their parent containers.

#### Layout Types

- **`column`** - Arranges components top-to-bottom (default)
- **`row`** - Arranges components left-to-right
- **`fixed`** - Uses fixed x,y positioning
- **`aligned`** - Uses alignment-based positioning without flow

#### Responsive Layout Features

- **Percentage Sizing**: Children can specify percentage-based dimensions
- **Flexible Fitting**: `fit` and `auto` sizing adapts to available space
- **Nested Responsiveness**: Percentages cascade through container hierarchies
- **Backward Compatibility**: Existing numeric sizes work unchanged

```tsx
// Traditional fixed sizing
<Component layout="row" width={40} height={10}>
  <Text content="Left" width={20} />
  <Text content="Right" width={20} />
</Component>

// Modern responsive sizing
<Row width="100%" height={10}>
  <Text content="Left" width="25%" />
  <Text content="Center" width="50%" />
  <Text content="Right" width="fit" />
</Row>

// Mixed approach (absolute + relative)
<Column height="100%">
  <Text content="Fixed header" height={3} />
  <Text content="Flexible content" height="fit" />
  <Text content="Fixed footer" height={2} />
</Column>
```

## Positioning & Spacing

### Gap System

The `gap` property controls spacing around components. Gaps are applied **before** alignment, meaning they reserve space first, then alignment happens within the remaining space.

#### Gap Syntax Options

```tsx
// Uniform spacing on all sides
<Text gap={2} content="Spaced text" />

// Specific sides
<Text gap={{ top: 1, bottom: 2, left: 3, right: 1 }} />

// Shorthand for axes
<Text gap={{ x: 2, y: 1 }} />  // x = left+right, y = top+bottom

// CSS-style arrays
<Text gap={[2]} />                    // All sides: 2
<Text gap={[1, 3]} />                // Vertical: 1, Horizontal: 3
<Text gap={[1, 2, 3]} />             // Top: 1, Horizontal: 2, Bottom: 3
<Text gap={[1, 2, 3, 4]} />          // Top: 1, Right: 2, Bottom: 3, Left: 4
```

### Alignment

The `align` property controls how components position themselves within their available space (after gaps are applied).

#### Alignment Keywords

```tsx
// String-based alignment
<Text align="center" />
<Text align="top-right" />
<Text align="bottom-left" />

// Object-based alignment for precise control
<Text align={{ x: 'center', y: 'top' }} />
<Text align={{ x: 10, y: 'middle' }} />  // Absolute positioning
```

#### MultiSelect

Multi-selection list component with checkboxes.

**Props:**

- `options: string[]` - Array of selectable options
- `selected: State<string[]>` - Reactive state for selected items
- `width?: number` - Component width
- `height?: number` - Component height

**Keyboard Controls:**

- `↑` / `↓` - Navigate through options
- `Space` - Toggle selection of current item

#### PerfMonitor

Performance monitoring display component for debugging.

**Props:**

- Standard component props for positioning and sizing

Available alignment values:

- **Horizontal**: `'left'`, `'center'`, `'right'`, or a number (absolute position)
- **Vertical**: `'top'`, `'middle'`, `'bottom'`, or a number (absolute position)
- **Keywords**: `'top-left'`, `'top'`, `'top-right'`, `'left'`, `'center'`, `'right'`, `'bottom-left'`, `'bottom'`, `'bottom-right'`

### How Gap and Alignment Work Together

Gap and alignment work in sequence: **Gap → Alignment → Positioning**

```tsx
// Example: Left-align with 5-character indent
<Text align="left" gap={{ left: 5 }} content="Indented text" />
```

1. **Gap reservations**: 5 characters reserved on the left
2. **Available space calculation**: Container width minus gap (e.g., 40 - 5 = 35)
3. **Alignment**: Text positioned at left edge of remaining 35-character space
4. **Final position**: 5 characters from container edge

### Layout-Specific Behavior

#### Vertical Layout

- **Gap flow**: `top` → component → `bottom` → next component
- **Alignment**: Affects horizontal positioning within available width
- **Auto-sizing**: Components without explicit width fill available horizontal space

#### Horizontal Layout

- **Gap flow**: `left` → component → `right` → next component
- **Alignment**: Affects vertical positioning within available height
- **Auto-sizing**: Components without explicit height fill available vertical space

---

## 🚀 Developing with Asciitorium

### Run in the browser (Web mode)

```bash
npm run web
```

- Starts the Vite dev server
- Open your browser at **http://localhost:5173** (or the port Vite displays)

### Run in the terminal (CLI mode)

```bash
npm run cli
```

- Renders directly to stdout
- Uses the `TerminalRenderer` for an interactive terminal UI

### Build for production

```bash
npm run build
```

---

## 📂 Project Structure

```txt
asciitorium/
├── src/                    # Core source code
│   ├── components/         # UI components (Text, Button, etc.)
│   ├── core/              # Core framework code
│   │   ├── layouts/       # Layout components (Row, Column, etc.)
│   │   ├── renderers/     # DOM and Terminal renderers with screen detection
│   │   ├── utils/         # Utility functions (sizing, gap resolution, etc.)
│   │   ├── types.ts       # TypeScript definitions (SizeValue, etc.)
│   │   └── App.ts         # Main application class with auto-sizing
│   ├── examples/          # Example components and demos
│   ├── jsx/               # Custom JSX runtime
│   └── main.tsx           # Demo application
├── public/                # Static assets
│   ├── art/               # ASCII art files (.txt)
│   │   └── asciitorium.txt
│   ├── fonts/             # Custom fonts (.ttf, .woff, .woff2)
│   │   ├── PRNumber3.*    # Monospace font files
│   │   └── PrintChar21.*  # Pixel-style font files
│   └── images/            # Image assets
├── scripts/               # Helper scripts
│   └── generate-art.js    # ASCII art generator
├── package.json
└── README.md
```

---

## 📝 Changelog

### Latest Features (v0.1.22+)

- ✨ **Automatic Screen Size Detection**: Apps auto-size to terminal/browser dimensions
- ✨ **Responsive Sizing System**: Support for percentages (`"50%"`), fit (`"fit"`), and auto (`"auto"`) sizing
- ✨ **Dynamic Resizing**: Real-time adaptation to window/terminal size changes
- ✨ **Nested Responsiveness**: Percentage sizing cascades through component hierarchies
- 🔄 **Backward Compatibility**: All existing numeric sizing continues to work unchanged

See [CHANGELOG.md](../../CHANGELOG.md) for detailed release notes and migration guides.

---

## 📜 License

MIT
