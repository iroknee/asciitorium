# Asciitorium Maps

> **Note**: This directory is empty by default. The asciitorium library includes starter assets in `node_modules/asciitorium/public/art/maps/` that are automatically available without copying. See the main [art/README.md](../README.md) for details on using and customizing library assets.

This directory contains map layouts and legends for the **MapView** and
**FirstPersonView** components. Maps use ASCII characters for layout, with JSON
legends defining character properties.

## Directory Structure

Each map requires its own subdirectory with two files:

```text
maps/
└─ example/
   ├─ map.art       # ASCII map layout
   └─ legend.json   # Character definitions
```

## Map File Format

Map files (`.art`) use ASCII text where each character represents terrain,
objects, or game elements:

```text
╭───────────────────────────────────┬───╮
│                                   │   │
│   ╷   ╭───────────────┬───────╮   ╰─o─┤
│   │   │               │       │       │
│   │   ╵   ╶───────╮   ├─o─╮   ╰───╮   │
│   │               │   │   │       │   │
│   ╰───────┬───────╯   ├───┤   ╭───╯   │
```

### Common Characters

- **Box-drawing**: Walls and structures (`╭`, `╮`, `╯`, `╰`, `│`, `─`, `├`,
  `┤`, `┬`, `┴`)
- **Partial walls**: Incomplete barriers (`╷`, `╵`, `╶`, `╴`)
- **Special**: Doors (`o`), items, entities
- **Spaces**: Walkable floor areas

## Legend File Format

Legend files (`legend.json`) map characters to properties and assets:

### Structure

```json
{
  "legend": [
    {
      "chars": ["╭", "╮", "╯", "╰", "│", "─"],
      "name": "wall",
      "solid": true,
      "material": "brick-wall"
    },
    {
      "chars": ["o"],
      "name": "door",
      "solid": false,
      "entity": "door",
      "variant": "wooden",
      "material": "wood-door"
    },
    {
      "chars": ["b"],
      "name": "bone",
      "solid": false,
      "showOnMap": false,
      "entity": "item",
      "variant": "bone",
      "material": "bone"
    }
  ]
}
```

### Legend Properties

**Required:**

- `chars`: Array of characters sharing these properties
- `solid`: Blocks player movement (`true`/`false`)
- `material`: Reference to asset file (e.g., `"brick-wall"`)

**Optional:**

- `name`: Human-readable description
- `showOnMap`: Show in MapView (`true`/`false`, default: `true`)
- `entity`: Gameplay type (`"door"`, `"enemy"`, `"treasure"`, `"trap"`,
  `"item"`, `"mechanism"`, `"destructible"`, `"npc"`)
- `variant`: Specific subtype (e.g., `"wooden"`, `"iron"`, `"bone"`)

**Tips:**

- Group multiple characters with identical properties in the `chars` array
- Use `"showOnMap": false` for items that appear only in first-person view
- `entity` and `variant` define gameplay behavior (e.g., all doors open/close,
  but wooden doors are weaker than iron)

## Using Maps in Your App

### With GameWorld

```tsx
const gameWorld = new GameWorld({
  mapName: 'example',
  initialPosition: { x: 5, y: 5, direction: 'north' }
});

<MapView gameWorld={gameWorld} fogOfWar={true} />
<FirstPersonView gameWorld={gameWorld} scene="brick-wall" />
```

### Automated Generation

Use the map builder script for quick dungeon generation:

```bash
node scripts/map-builder.js <width> <height> <directory-name> [--smooth]
```

**Examples:**

```bash
# Basic 20x15 map
node scripts/map-builder.js 20 15 my-dungeon

# Smooth Unicode box-drawing characters
node scripts/map-builder.js 30 20 castle --smooth
```

The script generates a maze-like layout with corridors and rooms, creating both
`map.art` and directory structure as a starting point for customization.

## Technical Details

### Loading

Maps are loaded asynchronously via `AssetManager`:

```typescript
const mapAsset = await AssetManager.getMap('example');
```

### Caching

Map and legend assets are cached on first load - subsequent uses reuse cached
data.
