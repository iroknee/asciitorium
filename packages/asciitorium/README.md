# asciitorium

**asciitorium** is a UI framework for building retro terminal interfaces that fully function in the browser as well as the terminal.  
Why? I am still not sure 🙂. But it started with wanting to create a text-based game reminiscent of **Wizardry I**, **Zork**, and **Bard's Tale** from the 80s. I realized it would be fun to create a UI framework while I was at it — given my experience with React, here is that first pass.

## Installation

```bash
npm install asciitorium
```

## Quick Start

### Basic Example

```tsx
import { App, Text, TextInput, State, start } from 'asciitorium';

const message = new State('Hello, World!');

const app = (
  <App width={50} height={10}>
    <Text value="Enter your message:" />
    <TextInput value={message} width={40} />
    <Text value={message} />
  </App>
);

await start(app);
```

### JSX Configuration

Add to your `tsconfig.json`:

```json
{
  "compilerOptions": {
    "jsx": "react-jsx",
    "jsxImportSource": "asciitorium/jsx"
  }
}
```

## Use Cases

- Terminal-style web apps
- ASCII dashboards
- Text-driven games
- BBS-inspired experiments
- Developer tools with retro aesthetics

## Features

- Support for TypeScript
- Works in both **Web** and **CLI** (DOM or stdout)
- Built-in components (`Text`, `Button`, `ListBox`, `ProgressBar`, etc.)
- Reactive `State<T>` system for live updates
- Custom JSX runtime (like React, minus the baggage)

## Built-in Components

- **`Text`** - Display static or dynamic text
- **`Button`** - Interactive buttons with click handlers
- **`TextInput`** - Text input fields
- **`ListBox`** - Selectable lists with keyboard navigation
- **`ProgressBar`** - Visual progress indicators
- **`Tabs`** - Tabbed interface containers
- **`HorizontalLine`** - Decorative dividers
- **`AsciiArt`** - Display ASCII art from files
- **`CelticBorder`** - Decorative borders

### Layout Components

- **`HorizontalLayout`** - Arrange components horizontally
- **`VerticalLayout`** - Arrange components vertically (default)

---

## 🚀 Developing

### 1️⃣ Install dependencies

```bash
npm install
```

### 2️⃣ Run in the browser (Web mode)

```bash
npm run web
```

- Starts the Vite dev server
- Open your browser at **http://localhost:5173** (or the port Vite displays)
- Uses the `DomRenderer` to draw into a `<pre>` block

### 3️⃣ Run in the terminal (CLI mode)

```bash
npm run cli
```

- Renders directly to stdout
- Uses the `TerminalRenderer` for an interactive terminal UI

### 4️⃣ Build for production

```bash
npm run build
```

- Builds both the browser bundle and TypeScript definitions

### 5️⃣ Preview the production build

```bash
npm run preview
```

- Serves the `dist/` output locally using Vite

### 6️⃣ Format the code

```bash
npm run format
```

- Runs Prettier across the entire project

### 7️⃣ Generate FIGlet ASCII art assets

```bash
npm run art FIGlet-font-name "phrase" 
```

- Runs the `scripts/generate-art.js` tool to build `.txt` ASCII art files

To list available FIGlet fonts:

```bash
npm run art:fonts
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
│   └── demo.tsx           # Demo application
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
