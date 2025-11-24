# Art Directory

This directory contains asciitorium art assets for the asciitorium framework. They are organized into categories: fonts, maps, materials, sounds, and sprites.

## Asset Loading

Assets are automatically loaded and cached by `AssetManager` using reactive
`State` objects. The AssetManager provides a single source of truth with
automatic caching and updates.

## Directory Structure

``` bash
art/
├── fonts/         # ASCII font definitions
├── maps/          # Game map layouts with legends
├── materials/     # Wall textures and environmental materials
├── sounds/        # Audio files (MP3)
└── sprites/       # Animated character and object sprites
```

## Subdirectories

### [fonts/](fonts/README.md)

ASCII font definitions for `Banner` component rendering. See the fonts README for file format details.

### [maps/](maps/README.md)

Map layouts paired with legend metadata define the position of terrain and entities. See the maps README for format specifications and the entity system.

### [materials/](materials/README.md)

Materials are used for `FirstPersonView` textures with layered depth rendering (here, near, middle, far). Materials can include placement metadata and sound effects. See the materials README for layer syntax and properties.

### [sounds/](sounds/README.md)

Audio files in MP3 format used throughout the application. See the sounds README for usage details.

### [sprites/](sprites/README.md)

Static or animated ASCII art with frame timing are in the sprites directory. They can be added using the `Art` component. See the sprites README for animation format details.
