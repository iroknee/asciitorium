# Maps Directory

This directory contains map layouts and legends for game environments in asciitorium. Maps are typically stored as text files with ASCII characters representing different terrain types, while legend files (JSON format) define what each character represents.

## Contents

- `example/`: Sample map directory demonstrating map and legend file organization

## Map File Format

Maps use ASCII text files where each character represents a different type of terrain, object, or game element. The visual representation uses various ASCII characters to create recognizable layouts.

### Common Map Characters

- **Box-drawing characters**: For walls and structures (`╭`, `╮`, `╯`, `╰`, `│`, `─`, `├`, `┤`, `┬`, `┴`)
- **Partial walls**: For incomplete barriers (`╷`, `╵`, `╶`, `╴`)
- **Special characters**: For doors (`o`), spawn points, or interactive elements
- **Spaces**: For walkable floor areas
- **Custom characters**: Any ASCII character can be assigned meaning through legends

## Legend Files

Each map should have an accompanying `legend.json` file that defines what each character represents. This allows the game engine to understand collision, rendering, and gameplay properties.

### Legend Structure

Legends use an array format where each entry groups characters with shared properties:

```json
{
  "legend": [
    {
      "chars": ["╭", "╮", "╯", "╰", "│", "─"],
      "kind": "material",
      "name": "wall",
      "solid": true,
      "asset": "material/brick-wall"
    },
    {
      "chars": ["o"],
      "kind": "material",
      "name": "door",
      "solid": false,
      "entity": "door",
      "asset": "material/wood-door-on-brick-wall"
    }
  ]
}
```

### Legend Properties

#### Required Properties

- **chars**: Array of characters that share the same properties (e.g., all wall variations)
- **kind**: Type of asset (`"material"` for terrain/environment, `"sprite"` for animated entities)
- **solid**: Whether the object blocks player movement (`true`/`false`)
- **asset**: Reference to visual asset file in the materials or sprites directories

#### Optional Properties

- **name**: Human-readable description for the object type
- **visible**: Whether the object appears in map view (`true`/`false`). Defaults to `true`. When `false`, renders as a space in MapView but still appears in first-person view. Useful for ground items, invisible triggers, or objects that should only be visible up close.
- **entity**: Gameplay entity type that defines behavior (e.g., `"door"`, `"enemy"`, `"treasure"`, `"trap"`, `"item"`)
- **variant**: Specific subtype of the entity (e.g., `"wooden"`, `"iron"`, `"magic"`, `"bone"`)

**Note:** The `chars` array allows you to group multiple map characters that share identical properties, significantly reducing legend file size and making them easier to maintain.

### Entity and Variant System

The `entity` and `variant` properties work together to define gameplay behavior:

- **entity**: The primary type that determines how the game handles interactions (door, enemy, treasure, trap, item, etc.)
- **variant**: The specific implementation or subtype (wooden-door, iron-door, wolf, bone, spike-trap, etc.)

This separation allows for:
- Shared behavior across similar entities (all doors can be opened/closed)
- Variant-specific properties (wooden doors are weak, iron doors are strong)
- Clear gameplay categorization

### Common Entity Types

Here are standard entity types used in dungeon crawlers:

#### **door**
Openable/closable passages, may be locked
```json
{
  "chars": ["o"],
  "entity": "door",
  "variant": "wooden",
  "solid": false
}
```

#### **enemy**
Hostile creatures or NPCs
```json
{
  "chars": ["w"],
  "entity": "enemy",
  "variant": "wolf",
  "solid": true
}
```

#### **treasure**
Collectible currency or valuables
```json
{
  "chars": ["g"],
  "entity": "treasure",
  "variant": "gold-pile",
  "solid": false
}
```

#### **item**
Pickup-able objects for inventory
```json
{
  "chars": ["b"],
  "entity": "item",
  "variant": "bone",
  "solid": false,
  "visible": false
}
```
**Note:** Items often use `"visible": false` so they appear in first-person view but not on the map, creating a more immersive exploration experience.

#### **trap**
Hazards that trigger on player interaction
```json
{
  "chars": ["^"],
  "entity": "trap",
  "variant": "spike",
  "solid": false
}
```

#### **mechanism**
Switches, levers, pressure plates
```json
{
  "chars": ["L"],
  "entity": "mechanism",
  "variant": "lever",
  "solid": true
}
```

#### **destructible**
Breakable objects like crates or barrels
```json
{
  "chars": ["C"],
  "entity": "destructible",
  "variant": "crate",
  "solid": true
}
```

#### **npc**
Non-hostile characters for dialog/quests
```json
{
  "chars": ["@"],
  "entity": "npc",
  "variant": "merchant",
  "solid": true
}
```

## Directory Organization

Each map should be organized in its own subdirectory containing:

- `map.art`: The ASCII map layout file
- `legend.json`: Character-to-object mapping definitions
- Optional: Additional map variants or related files

Example structure:

```text
maps/
├─ underground/
│  ├─ map.art
│  └─ legend.json
├─ overworld/
│  ├─ map.art
│  └─ legend.json
└─ example/
   ├─ map.art
   └─ legend.json
```

## Usage in Asciitorium

Maps are loaded by the `MapView` component using the `src` property:

```tsx
<MapView
  src="./art/maps/example/map.art"
  player={playerPosition}
  fogOfWar={false}
/>
```

The component automatically looks for the corresponding `legend.json` file in the same directory to understand how to interpret the map characters.

## Creating New Maps

### Manual Creation

When creating new maps manually:

1. Design your layout using ASCII characters in a text file
2. Create a `legend.json` file defining what each character represents
3. Organize both files in a dedicated subdirectory
4. Reference appropriate assets in the materials and sprites directories
5. Test with the `MapView` component to ensure proper rendering and collision

### Automated Generation

For quick map generation, use the included `map-builder.js` script:

```bash
node scripts/map-builder.js <width> <height> <directory-name> [--smooth]
```

**Examples:**

```bash
# Generate a basic 20x15 map in 'my-dungeon' directory
node scripts/map-builder.js 20 15 my-dungeon

# Generate a map with smooth Unicode box-drawing characters
node scripts/map-builder.js 30 20 castle-level --smooth
```

**Options:**

- `width`: Map width in characters
- `height`: Map height in characters
- `directory-name`: Name of the directory to create (saved to `public/art/maps/<directory-name>/map.art`)
- `--smooth`: Use Unicode box-drawing characters for smoother appearance

The script automatically generates a maze-like layout with corridors and rooms, creating both a `map.art` file and the proper directory structure. This provides a perfect starting point for dungeon-style maps that you can then customize manually.

Use the `example/` directory as a reference for proper file organization and legend format.
