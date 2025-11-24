# Art Directory

This directory contains ASCII art assets for the asciitorium framework,
organized into three main categories: maps, materials, and sprites.

## Asset Loading

Assets are automatically loaded and cached by `AssetManager` using reactive
`State` objects. Use `AssetManager.getMapState()`,
`AssetManager.getMaterialState()`, or `AssetManager.getSpriteState()` to access
assets reactively. The AssetManager provides a single source of truth with
automatic caching and updates.

## Directory Structure

```
art/
├── fonts/         # ASCII font definitions
├── maps/          # Game map layouts with legends
├── materials/     # Wall textures and environmental materials
├── sounds/        # Audio files (MP3)
└── sprites/       # Animated character and object sprites
```

## Subdirectories

### [fonts/](fonts/README.md)

ASCII font definitions for text rendering. See the fonts README for file format
details.

### [maps/](maps/README.md)

Map layouts (`.art` files) paired with legend metadata (`.json` files) that
define terrain, collision, and entities. See the maps README for format
specifications and the entity system.

### [materials/](materials/README.md)

First-person view textures with layered depth rendering (here, near, middle,
far). Materials can include placement metadata and sound effects. See the
materials README for layer syntax and properties.

### [sounds/](sounds/README.md)

Audio files in MP3 format used throughout the application. See the sounds README
for usage details.

### [sprites/](sprites/README.md)

Animated ASCII sprites with frame timing. Referenced by map legends for dynamic
visual representation. See the sprites README for animation format details.
