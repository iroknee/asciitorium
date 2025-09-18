# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Overview

This is a monorepo for **asciitorium**, an ASCII-based UI framework that runs in both web browsers and CLI environments. It uses npm workspaces with two main packages:

- `packages/asciitorium/` - The core UI framework library
- `packages/create-asciitorium/` - CLI scaffolding tool for new projects

## Common Commands

### Development Commands

```bash
# Install dependencies for all packages
npm install

# Build all packages
npm run build

# Run core library demo in web mode
npm run web

# Run core library demo in CLI mode
npm run cli

# Format code
cd packages/asciitorium && npm run format

# Run CLI in development mode with tsx
cd packages/asciitorium && npm run cli
```

### Testing Commands

```bash
# Test library packaging and scaffolding
npm run test

# Test with local library version
USE_LOCAL_LIB=1 scripts/test-create.sh
```

### Publishing Commands

```bash
# Release all packages to npm
npm run release

# Update version across packages
npm run version
```

## Architecture

### Core Framework (packages/asciitorium)

The framework uses a component-based architecture with custom JSX runtime:

**Core Classes:**

- `App` - Main application class that handles rendering, focus management, and performance monitoring
- `Component` - Abstract base class for all UI components with properties like position (x,y,z), dimensions, borders, focus handling with visual focus indicators (double-line borders)
- `State<T>` - Reactive state management system with subscribe/unsubscribe pattern
- `PersistentState<T>` - State management with localStorage persistence
- `FocusManager` - Handles keyboard navigation between focusable components
- `RenderScheduler` - Manages render callbacks and scheduling

**Rendering System:**

- Dual renderer architecture: `DomRenderer` for web (renders to `#screen` element) and `TerminalRenderer` for CLI
- Character-based rendering using 2D string arrays as buffers
- Z-index based layering system for component ordering
- Transparent character system for overlay effects
- Focus-based visual indicators: Components with borders automatically switch from single-line (`╭╮╰╯─│`) to double-line (`╔╗╚╝═║`) borders when focused

**JSX Runtime:**

- Custom JSX factory functions in `src/jsx/jsx-runtime.ts` and `jsx-dev-runtime.ts`
- TypeScript configured with `jsx: "react-jsx"` and custom `jsxImportSource: "asciitorium"`
- Components are instantiated as classes via `new type(props)`

**Layout System:**

- Multiple layout implementations: `RowLayout`, `ColumnLayout`, `FixedLayout`, `AlignedLayout`
- Components can be positioned absolutely or use layout-based positioning
- Support for relative sizing and alignment options

**Built-in Components:**
Located in `src/components/`: `Text`, `Button`, `Select`, `MultiSelect`, `Tabs`, `TextInput`, `AsciiArt`, `AsciiMaze`, `CelticBorder`, `HR`, `VR`, `Row`, `Column`, `Sliders`, `PerfMonitor`

**Keyboard Navigation:**

- Unified navigation system managed by `FocusManager` class
- **Tab/Shift+Tab**: Navigate between focusable components (forward/backward)
- **Hotkey System**: Components support explicit hotkey assignment (`hotkey="x"` prop)
  - **F1** or **`** (backtick): Toggle hotkey visibility
  - **Letter keys**: Jump directly to components with matching hotkeys
  - Hotkey indicators displayed as `[X]` at position (1,0) when visibility enabled
- **Focus indicators**: Components with borders switch from single-line to double-line borders when focused
- **Component-specific controls:**
  - `AsciiMaze` - Arrow keys and WASD for player movement with collision detection and fog of war
  - `Button` - Enter/Space to activate
  - `TabContainer` - Arrow keys to switch between tabs
  - `Select`/`MultiSelect` - Arrow keys for navigation, Enter to select
  - `TextInput` - Standard text input with cursor navigation
  - `Sliders` - Arrow keys to adjust values

### Project Scaffolder (packages/create-asciitorium)

CLI tool built with Node.js that:

- Uses `prompts` for interactive project setup
- Copies template files from `templates/base/`
- Generates Vite + TypeScript projects pre-configured for asciitorium
- Supports both web and CLI execution modes
- Dependencies: `execa`, `kolorist`, `minimist`, `prompts`

### Build System

- **Library**: Uses Vite for bundling with TypeScript compilation
- **Types**: Generated via TypeScript compiler with `declaration: true`
- **Exports**: Multiple entry points including main library, examples, JSX runtime, and JSX dev runtime
- **External Dependencies**: Node.js modules (`fs/promises`, `path`, `readline`) marked as external for CLI usage
- **No Runtime Dependencies**: The core library has zero dependencies

### Development Workflow

1. The framework targets ES2020 with DOM and Node.js compatibility
2. Uses strict TypeScript configuration with custom JSX setup
3. Vite handles both development server and production builds
4. Custom JSX setup allows React-like syntax without React dependency
5. Testing scripts verify packaging and scaffolding functionality
6. Prettier for code formatting

### Key Files

- `packages/asciitorium/src/index.ts` - Main library exports
- `packages/asciitorium/src/core/App.ts` - Application entry point
- `packages/asciitorium/vite.config.js` - Build configuration with JSX setup
- `packages/create-asciitorium/src/index.ts` - CLI entry point
- `scripts/test-pack.sh` - Library packaging test
- `scripts/test-create.sh` - Scaffolding test
