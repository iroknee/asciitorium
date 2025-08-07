# ASCIITORIUM

**asciitorium** is a ui framework for building retro interfaces — in the browser and terminal.

## What is this?

**asciitorium** is a TypeScript-based, ASCII-first UI framework that brings old-school charm.

- Terminal-style web apps
- ASCII dashboards
- Text-driven games
- BBS-inspired experiments
- And other projects that deserve to glow green

Built with no virtual DOM, no fluff, just raw characters and structured rendering — the way nature intended.

## ✨ Features

- Pure TypeScript — no frameworks, just components
- Works in both **Web** and **CLI** (DOM or stdout)
- Built-in components
- Reactive `State<T>` system for live updates
- Custom JSX runtime (like React, minus baggage)

## Installation

```bash
npm install asciitorium
```

or if you prefer `pnpm`:

```bash
pnpm install asciitorium
```

## Hello World (Web Demo)

main.tsx

```tsx
import { Asciitorium, HorizontalLine, Text, TextInput, State, bootstrap } from 'asciitorium';

const reactiveState = new State('Say Hello!');

const app = (
  <Asciitorium width={64} height={16}>
    <Text value="a ui for cli" align="center" />
    <HorizontalLine align="center" />
    <TextInput value={reactiveState} width={32} align="center" border />
    <Text value={reactiveState} border width={32} align="center" />
  </Asciitorium>
);

await bootstrap(app);

```

index.html

```html
<!-- index.html -->
<!doctype html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <title>asciitorium</title>
    <link rel="stylesheet" href="index.css" />
  </head>
  <body>
    <pre id="screen">Loading...</pre>
    <script type="module" src="/src/main.tsx"></script>
  </body>
</html>
```

---

## Local Development

```bash
git clone https://github.com/tgruby/asciitorium
cd asciitorium
pnpm install
```

### Run web demo

```bash
pnpm start:web
```

### Run terminal demo

```bash
pnpm start:cli
```

### Build it all

```bash
pnpm build
```

### Format with Prettier

```bash
pnpm format
```

## Components in the Emporium

- **AsciiArt** – render figlet-style banners
- **TextInput** – editable single-line fields
- **Button** – clickable or enterable UI actions
- **ListBox** – vertically scrollable list with selection
- **Tabs** – horizontal tabbed navs
- **ProgressBar** – animated status indicators
- **Text** – styled text blocks
- **HorizontalLine** – just what it sounds like

## Philosophy

No pixels.  
No distractions.  
Just terminal-flavored components you can compose and style like you're building a spaceship dashboard in 1982.

## License

MIT — fork it, break it, remake it, just leave the logo glowing green.

## Homages & Inspirations

- The Apple ][ I learned to code on
- **Wizardry I** and its dungeon of doom
- **FIGlet**, the original big text machine
- The green glow of a forgotten CRT monitor
