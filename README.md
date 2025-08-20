# asciitorium

**asciitorium** is an ASCII-based ui framework that runs in both the web and cli, along with related tooling such as the `create-asciitorium` project scaffolder.

![example](asciitorium.png)

```jsx
import {
  App,
  Box,
  Text,
  State,
  AsciiArt,
  TextInput,
  CelticBorder,
  HR,
  loadAsciiAsset,
} from 'asciitorium';

const helloWorld = new State('Hello, World!');

// Load the title ASCII art
const titleArt = await loadAsciiAsset('./art/asciitorium.txt');

// Construct the app
const app = (
  <App width={64} height={20} layout="relaxed">
    <CelticBorder edge="top-left" align="top-left" />
    <CelticBorder edge="top-right" align="top-right" />

    <Box align="top" layout="vertical" gap={2}>
      <AsciiArt content={titleArt} align="top" />
      <HR length={48} align="center" />
      <Text value="a ui framework for cli and web" align="top" gap={3} />
    </Box>

    <TextInput width={30} value={helloWorld} gap={5} align="bottom" />

    <Text width={24} align="bottom" gap={2}>
      {helloWorld}
    </Text>

    <CelticBorder edge="bottom-left" align="bottom-left" />
    <CelticBorder edge="bottom-right" align="bottom-right" />
  </App>
);

await app.start();
```

## Key features

- Works in both Web (DOM) and CLI (Terminal)
- Pure TypeScript, lightweight, no external framework dependencies
- Built-in components (`Text`, `Button`, `Select`, `ProgressBar`, etc.)
- Stateful rendering with reactive `State<T>` objects
- Custom JSX runtime for declarative UI

See the [package README](packages/asciitorium/README.md) for full usage details.

## Installation

> NOTE: if you intend to build projects leveraging asciitorium you should use: [`create-asciitorium`](packages/create-asciitorium).  It's a CLI tool to scaffold new projects using **Vite + TypeScript** preconfigured:

Usage:

```bash
# Create a new project
npm create asciitorium my-app

# Move into your new project
cd my-app

# Start the dev server (web)
npm run web

# Run in the terminal (CLI)
npm run cli
```

> Otherwise if you want to extend, just fork the repo:

## 🛠 Development

This repo uses **npm** workspaces.

### Available Scripts

This monorepo provides several npm scripts for development, building, and testing.

#### Root Level Scripts (from repository root)

```bash
# Development
npm run web      # Start the core library demo in web mode (vite dev server)
npm run cli      # Run the core library demo in CLI/terminal mode

# Building
npm run build    # Build all packages in the workspace

# Testing & Release
npm run test     # Run full test suite (scaffolding + web demo)
npm run version  # Update version numbers across all packages
npm run release  # Publish all packages to npm
```

## 📂 Monorepo Structure

```bash
packages/
├──asciitorium/        # The core UI framework
└──create-asciitorium/ # CLI to scaffold new projects
package.json           # Root scripts and workspace configuration
```

## 📝 Changelog

See [CHANGELOG.md](CHANGELOG.md) for detailed release notes and migration guides.

## 📄 License

This repository is licensed under the MIT License. See the [LICENSE](packages/asciitorium/LICENSE) file for details.
