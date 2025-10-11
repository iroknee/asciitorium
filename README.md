# asciitorium

**asciitorium** (pronounced ASS-kee-TOR-ee-um, unlike plane-a-rium seen [here](https://youtu.be/oK5n9lPvaQk?feature=shared&t=5), is an ASCII-only framework that runs in both the web and terminal. It was designed to create CLUIs (Command Line User Interfaces), and having a web build component speeds development. Originally it was purposed to allow a Gen Xer to build games to the flavor of Wizardy I, Zork, etc. but frankly has gotten out of hand.

![example](asciitorium.png)

```jsx
import { App, Text, State, Art, TextInput, Line } from './index';

// Reactive state for user input
const userInput = new State('Hello, World!');

const app = (
  <App>
    <Art src="./art/asciitorium.art" align="center" />
    <Line style={{ width: 60, align: 'center' }} />
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

## Key features

- **Cross-platform**: Runs similarly in web browsers and terminals
- **Responsive**: Auto-detects screen size and supports percentage-based sizing
- **Zero dependencies**: Lightweight with no runtime dependencies
- **TypeScript**: Full TypeScript support with custom JSX runtime
- **Component-based**: Supports JSX and React-like component architecture

## Getting Started

### Create New Project (Recommended)

The fastest way to get started is with the project scaffolder:

```bash
npm create asciitorium@latest my-app
cd my-app
npm install
npm run web  # or npm run cli
```

This creates a complete project with examples, TypeScript configuration, and both web and CLI support.

### NPM Installation

Add asciitorium to an existing project:

```bash
npm install asciitorium@latest
```

### CDN Usage (Zero Setup)

For quick prototyping or browser-only usage without npm:

```html
<script type="module">
  import {
    App,
    Text,
    Button,
  } from 'https://unpkg.com/asciitorium/dist/asciitorium.es.js';

  const app = (
    <App width={40} height={10}>
      <Text align="center">Hello from CDN!</Text>
      <Button align="center" gap={{ top: 2 }}>
        Click Me
      </Button>
    </App>
  );

  await app.start();
</script>
```

Alternative CDN providers:

- **unpkg**: `https://unpkg.com/asciitorium/dist/asciitorium.es.js`
- **jsDelivr**: `https://cdn.jsdelivr.net/npm/asciitorium/dist/asciitorium.es.js`

## Built-in Components

### Core Components

- **App** - Root application container with screen detection and rendering management
- **Component** - Base component class with positioning, borders, focus handling, and layout support
- **Fragment** - Container for grouping child components without additional rendering

### Layout Components

- **Row** - Horizontal layout container for arranging components side-by-side
- **Column** - Vertical layout container for stacking components

### Input Components

- **Button** - Interactive clickable button with focus indicators and press effects
- **TextInput** - Text input field with cursor navigation and keyboard handling
- **Select** - Single-selection dropdown list with keyboard navigation
- **MultiSelect** - Multi-selection list allowing multiple item selection
- **Switch** - Conditional rendering component for dynamic content switching
- **Tab** - Individual tab component for tabbed interfaces
- **TabContainer** - Container managing multiple tabs with keyboard navigation

### Display Components

- **Text** - Static and dynamic text display with word wrapping and alignment
- **Art** - ASCII art display component for images and animations
- **MapView** - Top-down map view with player position, fog of war, and automatic viewport centering
- **FirstPersonView** - First-person perspective renderer using raycasting and material composition
- **PerfMonitor** - Real-time performance monitoring display

### UI Elements

- **Line** - Horizontal or vertical divider lines with configurable direction
- **CelticBorder** - Decorative Celtic-style border elements
- **Sliders** - Collection of slider components (ProgressBar, Gauge, Dot, Vertical)

### State Management

- **State<T>** - Reactive state management with subscribe/unsubscribe pattern
- **PersistentState<T>** - State management with localStorage persistence

### Game Development

- **GameWorld** - Game state coordinator managing maps, legends, player movement, and collision detection
- **AssetManager** - Asset loading system for maps, materials, sprites, and legends with JSON metadata support

## Styling Components

All components support both individual styling properties and a consolidated `style` prop for cleaner code organization.

### Style Property

Use the `style` prop to group related styling properties using either the style object, individual jsx properties, or both (individual props take precedence).

```tsx
// Using style prop
<Text style={{ width: 40, align: 'center', gap: { bottom: 2 } }}>
  Hello World
</Text>

// Using individual props (takes precedence over style prop)
<Button width={30} align="center" border>
  Click Me
</Button>
```

### Available Style Properties

- **width** / **height** - Size values (number, percentage, 'auto', 'fill')
- **border** - Show border around component
- **background** - Fill character for component background
- **align** - Alignment ('left', 'center', 'right', 'top', 'bottom', etc.)
- **position** - Positioning coordinates object `{ x?: number, y?: number, z?: number }` (enables absolute positioning)
- **gap** - Spacing around component (number or object with top/bottom/left/right)
- **visible** - Component visibility (State<boolean> for reactive show/hide)

### Component Visibility

Components support reactive visibility control through the `visible` prop, which accepts a `State<boolean>` for dynamic show/hide functionality:

```tsx
const showModal = new State(false);

// Component is hidden when showModal.value is false
<Component visible={showModal}>Modal content here</Component>;

// Toggle visibility
showModal.value = true; // Show component
showModal.value = false; // Hide component
```

### Absolute Positioning

Components can use absolute positioning to override the layout system and position themselves at specific coordinates:

```tsx
// Modal positioned at specific screen coordinates
<Component
  position={{ x: 10, y: 5 }}
  border
>
  Modal content positioned absolutely
</Component>

// Using style object
<Component
  style={{
    position: { x: 10, y: 5 },
    border: true
  }}
>
  Modal content
</Component>

// With z-index layering
<Component
  position={{ x: 10, y: 5, z: 10 }}
  border
>
  Modal content with high z-index
</Component>
```

**Key Features:**

- **Overrides layout**: Components with `position` property ignore parent layout algorithms
- **Absolute coordinates**: x/y values are relative to the screen, not parent
- **Perfect for overlays**: Modals, tooltips, and floating elements
- **Z-index layering**: Control stacking order with the z property

### Focus Indicators

Leaf components display context-appropriate focus indicators when focused, typically using `>` and `<` characters, providing clear visual feedback for keyboard navigation while maintaining elegant design.

### Keyboard Navigation

asciitorium provides keyboard navigation for all focusable components:

#### Navigation Keys

- **Tab** - Move focus to the next focusable component
- **Shift+Tab** - Move focus to the previous focusable component

#### Hotkey System

Components can be assigned explicit hotkeys for instant access:

```tsx
<Button hotkey="u" onClick={handleUpdate}>Update</Button>
<Button hotkey="c" onClick={handleCancel}>Cancel</Button>
```

- **F1** or **`** (backtick) - Toggle hotkey visibility
- **[Letter Key]** - Jump directly to component with that hotkey

When hotkey visibility is enabled, components display their assigned keys in brackets (e.g., `[U]` for Update button) at position (1,0) within their boundaries.

#### Global Keybindings

For application-level shortcuts that work regardless of component focus, use the `Keybind` component:

```tsx
import { Keybind, State } from 'asciitorium';

const showDebugPanel = new State(false);

<App>
  <Keybind
    keyBinding="F12"
    action={() => (showDebugPanel.value = !showDebugPanel.value)}
    global
  />
  <Keybind
    keyBinding="Ctrl+s"
    action={() => saveApplication()}
    description="Save application state"
  />

  {/* Your app content */}
</App>;
```

**Keybind Props:**

- `keyBinding` - Key combination (e.g., "F12", "Ctrl+s", "Escape")
- `action` - Function to execute when key is pressed
- `global` - If true, overrides focused component handling (default: false)
- `disabled` - Static boolean or reactive `State<boolean>` to conditionally disable
- `description` - Optional description for documentation

**Precedence:** Component focus takes priority over keybinds unless `global={true}` is specified.

#### Component-Specific Controls

- **Button** - Enter/Space to activate
- **TextInput** - Standard text editing with cursor navigation
- **Select/MultiSelect** - Arrow keys for navigation, Enter to select
- **TabContainer** - Arrow keys to switch between tabs
- **Sliders** - Arrow keys to adjust values
- **MapView** - Arrow keys for player movement (when focused, legacy mode)

## Game Development Features

asciitorium includes specialized components and systems for building ASCII-based games, particularly first-person dungeon crawlers and exploration games.

### GameWorld

The `GameWorld` class centralizes game logic, managing maps, player state, and collision detection:

```tsx
import { GameWorld, MapView, FirstPersonView, Keybind } from 'asciitorium';

// Create game world
const gameWorld = new GameWorld({
  mapName: 'dungeon',  // Loads from art/maps/dungeon/
  initialPosition: { x: 5, y: 5, direction: 'north' }
});

// Movement controls
<Keybind keyBinding="ArrowUp" action={() => gameWorld.moveForward()} global />
<Keybind keyBinding="ArrowDown" action={() => gameWorld.moveBackward()} global />
<Keybind keyBinding="ArrowLeft" action={() => gameWorld.turnLeft()} global />
<Keybind keyBinding="ArrowRight" action={() => gameWorld.turnRight()} global />

// Display views
<MapView gameWorld={gameWorld} fogOfWar={true} />
<FirstPersonView gameWorld={gameWorld} scene="brick-wall" />
```

**GameWorld Features:**

- Legend-based collision detection using `solid` property from map metadata
- Centralized player movement and state management
- Async map and legend loading via AssetManager
- Read-only accessors for views: `getMapData()`, `getPlayer()`, `getLegend()`
- Extensible for game events, interactions, and entity management

### AssetManager

The `AssetManager` handles loading and parsing of game assets:

**Supported Asset Types:**

- **Maps** - Grid-based maps with legend.json metadata defining tile properties
- **Materials** - First-person view wall textures with layer-based rendering
- **Sprites** - Animated ASCII art with frame metadata

**Map Structure:**

```bash
art/maps/dungeon/
├── map.art          # ASCII map grid
└── legend.json      # Tile definitions
```

**Legend Format:**

```json
{
  "╭": { "kind": "material", "name": "wall", "solid": true, "asset": "wall" },
  "o": {
    "kind": "material",
    "name": "door",
    "solid": true,
    "tag": "door",
    "asset": "door"
  },
  " ": { "kind": "material", "name": "floor", "solid": false, "asset": "floor" }
}
```

### MapView Component

Displays a top-down view of the game map with player position and fog of war:

```tsx
<MapView
  gameWorld={gameWorld}
  fogOfWar={true}
  exploredTiles={exploredTiles} // State<Set<string>>
  fogCharacter=" "
/>
```

**Features:**

- Automatic viewport centering on player
- Fog of war with persistent exploration tracking
- Player direction indicator (↑ ↓ ← →)
- Legend-based tile rendering

### FirstPersonView Component

Renders a first-person perspective using raycasting:

```tsx
<FirstPersonView
  gameWorld={gameWorld}
  scene="brick-wall" // Material name from art/materials/
  transparency={false}
/>
```

**Features:**

- Raycasting-based wall detection using GameWorld collision
- Material composition system for wall textures
- Multiple depth levels (here, near, middle, far)
- Scene switching for different visual styles

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
