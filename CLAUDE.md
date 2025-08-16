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

# Build specific package
npm run build --workspace=asciitorium
npm run build --workspace=create-asciitorium

# Run core library demo in web mode
cd packages/asciitorium && npm run web

# Run core library demo in CLI mode  
cd packages/asciitorium && npm run cli

# Format code
cd packages/asciitorium && npm run format
```

### Testing Commands
```bash
# Test library packaging (builds and tests import)
npm run test:lib

# Test create-asciitorium scaffolding
npm run test:create

# Test with local library version
USE_LOCAL_LIB=1 npm run test:create
```

### Publishing Commands
```bash
# Publish library to npm
npm run publish:lib

# Publish create-asciitorium to npm
npm run publish:create
```

## Architecture

### Core Framework (packages/asciitorium)

The framework uses a component-based architecture with custom JSX runtime:

**Core Classes:**
- `Asciitorium` - Main application class that extends `VerticalLayout`, handles rendering and focus management
- `Component` - Abstract base class for all UI components with properties like position (x,y,z), dimensions, borders, focus handling
- `State<T>` - Reactive state management system with subscribe/unsubscribe pattern
- `FocusManager` - Handles keyboard navigation between focusable components

**Rendering System:**
- Dual renderer architecture: `DomRenderer` for web (renders to `#screen` element) and `TerminalRenderer` for CLI
- Character-based rendering using 2D string arrays as buffers
- Z-index based layering system for component ordering
- Transparent character system using '‽' for overlay effects

**JSX Runtime:**
- Custom JSX factory functions in `src/jsx/jsx-runtime.ts`
- TypeScript configured with `jsx: "react-jsx"` and custom `jsxImportSource: "@jsx"`
- Components are instantiated as classes via `new type(props)`

**Layout System:**
- `Layout` base class with `HorizontalLayout` and `VerticalLayout` implementations
- Components can be positioned absolutely or use layout-based positioning
- Support for fixed positioning and alignment

**Built-in Components:**
Located in `src/components/`: `Text`, `Button`, `ListBox`, `ProgressBar`, `Tabs`, `TextInput`, `AsciiArt`, `CelticBorder`, `HorizontalLine`

### Project Scaffolder (packages/create-asciitorium)

CLI tool built with Node.js that:
- Uses `prompts` for interactive project setup
- Copies template files from `templates/base/` 
- Generates Vite + TypeScript projects pre-configured for asciitorium
- Supports both web and CLI execution modes

### Build System

- **Library**: Uses Vite for bundling with TypeScript compilation
- **Types**: Generated via TypeScript compiler with `declaration: true`
- **Exports**: Multiple entry points including main library, JSX runtime, and JSX dev runtime
- **External Dependencies**: Node.js modules (`fs/promises`, `path`, `readline`) marked as external for CLI usage

### Development Workflow

1. The framework targets ES2020 with DOM and Node.js compatibility
2. Uses strict TypeScript configuration
3. Vite handles both development server and production builds
4. Custom JSX setup allows React-like syntax without React dependency
5. Testing scripts verify packaging and scaffolding functionality
6. Prettier for code formatting

### Key Files

- `packages/asciitorium/src/index.ts` - Main library exports
- `packages/asciitorium/src/core/Asciitorium.ts` - Application entry point
- `packages/asciitorium/vite.config.js` - Build configuration with JSX setup
- `packages/create-asciitorium/src/index.ts` - CLI entry point
- `scripts/pack-lib-test.sh` - Library packaging test
- `scripts/create-asciitorium-test.sh` - Scaffolding test