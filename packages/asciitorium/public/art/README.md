# Art Directory

This directory contains ASCII art assets for a project. It is organized into subfolders for maps, materials, and sprites. Each file uses plain text or JSON for easy editing and integration.

## Directory Structure

```bash
public/art/
├─ maps/
│ └─ example/
│ ├─ map.txt
│ └─ legend.json
│
├─ materials/
│ ├─ brick-wall.txt
│ └─ wooden-door.txt
│
├─ sprites/
├─ giant-rat.txt
└─ wolf.txt
```

## maps/

Contains map layouts and legends for game environments. Maps are typically stored as text files with ASCII characters representing different terrain types, while legend files (JSON format) define what each character represents.

**Contents:**

- `example/` - Sample map directory containing:
  - `map.txt` - ASCII representation of the map layout
  - `legend.json` - Character-to-terrain mapping definitions

## materials/

Includes ASCII representations of various materials and textures that can be used in game environments. These files contain the visual patterns for different surface types.

**Contents:**

- `brick-wall.txt` - ASCII pattern for brick wall textures
- `wooden-door.txt` - ASCII representation of wooden door graphics

## sprites/

Stores sprite files for characters, creatures, and other game entities. Each sprite is defined as ASCII art that can be rendered in the game world.

**Contents:**

- `giant-rat.txt` - ASCII sprite for giant rat creature
- `wolf.txt` - ASCII sprite for wolf creature
