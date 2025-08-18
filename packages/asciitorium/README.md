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
- **`Box`** - Simple wrapper to wrap components
- **`Tabs`** - Tabbed interface containers
- **`Text`** - Display static or dynamic text
- **`Button`** - Interactive buttons with click handlers
- **`Select`** - Selectable lists with keyboard navigation
- **`AsciiArt`** - Display ASCII art from files
- **`TextInput`** - Text input fields
- **`ProgressBar`** - Visual progress indicators
- **`CelticBorder`** - Decorative borders
- **`HR`** - Decorative horizontal dividers

### Layout Components

- **`FixedLayout`** - Place components by x y positions only
- **`FlexibleLayout`** - Place components by alignment
- **`HorizontalLayout`** - Arrange components horizontally
- **`VerticalLayout`** - Arrange components vertically (default)

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
