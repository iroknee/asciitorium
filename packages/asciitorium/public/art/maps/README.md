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

```json
{
  "character": {
    "kind": "material|sprite",
    "name": "descriptive-name",
    "solid": true|false,
    "tag": "optional-category",
    "asset": "asset-file-reference"
  }
}
```

### Legend Properties

- **kind**: Type of object (`"material"` for terrain/environment, `"sprite"` for entities)
- **name**: Descriptive name for the object type
- **solid**: Whether the object blocks player movement (`true`/`false`)
- **tag**: Optional category for gameplay logic (e.g., `"door"`, `"enemy"`, `"treasure"`)
- **asset**: Reference to visual asset file in the materials or sprites directories

## Directory Organization

Each map should be organized in its own subdirectory containing:

- `map.txt`: The ASCII map layout file
- `legend.json`: Character-to-object mapping definitions
- Optional: Additional map variants or related files

Example structure:

```text
maps/
├─ underground/
│  ├─ map.txt
│  └─ legend.json
├─ overworld/
│  ├─ map.txt
│  └─ legend.json
└─ example/
   ├─ map.txt
   └─ legend.json
```

## Usage in Asciitorium

Maps are loaded by the `MapView` component using the `src` property:

```tsx
<MapView
  src="./art/maps/example/map.txt"
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
- `directory-name`: Name of the directory to create (saved to `public/art/maps/<directory-name>/map.txt`)
- `--smooth`: Use Unicode box-drawing characters for smoother appearance

The script automatically generates a maze-like layout with corridors and rooms, creating both a `map.txt` file and the proper directory structure. This provides a perfect starting point for dungeon-style maps that you can then customize manually.

Use the `example/` directory as a reference for proper file organization and legend format.
