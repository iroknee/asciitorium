# Art Directory

This directory contains ASCII art assets for a project. It is organized into subfolders for maps, materials, and sprites. Each file uses plain text or JSON for easy editing and integration.

## Directory Structure

```bash
public/art/
├─ maps/
│ └─ example/
│ ├─ map.art
│ └─ legend.json
│
├─ materials/
│ ├─ brick-wall.art
│ └─ wooden-door.art
│
├─ sprites/
├─ giant-rat.art
└─ wolf.art
```

## maps/

Contains map layouts and legends for game environments. Maps are typically stored as text files with ASCII characters representing different terrain types, while legend files (JSON format) define what each character represents, including visual assets, collision properties, and gameplay entity types.

**Contents:**

- `example/` - Sample map directory containing:
  - `map.art` - ASCII representation of the map layout
  - `legend.json` - Character-to-entity mapping with visual assets, collision, and behavior definitions

See [maps/README.md](maps/README.md) for detailed information on map file format, legend properties, and the entity/variant system.

## materials/

Includes ASCII representations of various materials and textures that can be used in game environments. Materials define layered visual representations at different distances (here, near, middle, far) and can include proximity-based sound effects and ambient events.

**Contents:**

- `brick-wall.art` - ASCII pattern for brick wall textures
- `bone.art` - Ground-placed bone material with placement metadata
- `door-on-brick.art` - Door material overlaid on brick wall background
- `wireframe-wall.art` - Complex wireframe demonstrating layered perspective rendering

See [materials/README.md](materials/README.md) for detailed information on material file format, layer system, placement properties, and the relationship between materials and legend entities.

## sprites/

Stores animated sprite files for characters, creatures, and other game entities. Sprites support multiple frames with configurable timing and can be referenced by legend entities for dynamic visual representation.

**Contents:**

- `giant-rat.art` - ASCII sprite for giant rat creature
- `wolf.art` - ASCII sprite for wolf creature

Sprites are referenced in map legends via the `asset` property and can be combined with entity types to define interactive game objects.
