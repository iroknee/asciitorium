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
    <Text value="Enter your message:" />
    <TextInput value={message} width={40} />
    <Text value={message} />
  </App>
);

await app.start();
```

## Built-in Components

- **`App`** - App to wrap all components in
- **`Tabs`** - Tabbed interface containers
- **`Text`** - Display static or dynamic text
- **`Button`** - Interactive buttons with click handlers
- **`Select`** - Selectable lists with keyboard navigation
- **`AsciiArt`** - Display ASCII art from files
- **`TextInput`** - Text input fields
- **`ProgressBar`** - Visual progress indicators
- **`CelticBorder`** - Decorative borders
- **`HR`** - Decorative horizontal dividers
- **`VR`** - Decorative vertical dividers

### Layout System

Asciitorium provides a flexible layout system that automatically positions components within their parent containers.

#### Layout Types

- **`column`** - Arranges components top-to-bottom (default)
- **`row`** - Arranges components left-to-right
- **`fixed`** - Uses fixed x,y positioning
- **`aligned`** - Uses alignment-based positioning without flow

```tsx
<Box layout="row" width={40} height={10}>
  <Text content="Left" />
  <Text content="Right" />
</Box>
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

Available alignment values:
- **Horizontal**: `'left'`, `'center'`, `'right'`, or a number (absolute position)
- **Vertical**: `'top'`, `'middle'`, `'bottom'`, or a number (absolute position)
- **Keywords**: `'top-left'`, `'top'`, `'top-right'`, `'left'`, `'center'`, `'right'`, `'bottom-left'`, `'bottom'`, `'bottom-right'`

### How Gap and Alignment Work Together

Gap and alignment work in sequence: **Gap → Alignment → Positioning**

```tsx
// Example: Left-align with 5-character indent
<Text 
  align="left" 
  gap={{ left: 5 }} 
  content="Indented text" 
/>
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
│   │   ├── layouts/       # Layout components
│   │   └── renderers/     # DOM and Terminal renderers
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

See [CHANGELOG.md](../../CHANGELOG.md) for detailed release notes and migration guides.

---

## 📜 License

MIT
