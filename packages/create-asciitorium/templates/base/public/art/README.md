# Art Directory

This directory contains asciitorium art assets for the asciitorium framework. They are organized into categories: fonts, maps, materials, sounds, and sprites.

## Asset Resolution and Library Assets

The asciitorium framework uses a **fallback resolution system** for assets:

1. **Project Assets First**: `public/art/{type}/{name}.art` in your project
2. **Library Assets Fallback**: `node_modules/asciitorium/public/art/{type}/{name}.art`

This means you automatically have access to all library assets without copying them!

### Using Library Assets

The asciitorium library includes starter assets:

**Materials**: `wall-brick`, `wall-wireframe`, `bone`, `door-wooden`
**Sprites**: `beating-heart`, `balloon`, `castle`, `eyes`, `firework`, `heart`, `pyramid`, `welcome`, and more
**Fonts**: `marker`, `pencil`, `pixel`, `shadows`
**Maps**: `example` (with legend)
**Sounds**: `door-open.mp3`, `door-close.mp3`, `taps.mp3`

Simply reference them by name - no need to copy files:

```typescript
import { AssetManager, Art, Banner } from 'asciitorium';

// Use library sprite
<Art sprite="beating-heart" />

// Use library font
<Banner font="shadows" text="Hello" />

// Use library material (in map legend)
const materialAsset = await AssetManager.getMaterial('wall-brick');
```

### Customizing Assets

**To use library asset as-is**: Just reference it by name (nothing to do!)

**To customize a library asset**:
1. Copy the asset from `node_modules/asciitorium/public/art/{type}/{name}.art`
2. Paste into your project's `public/art/{type}/{name}.art`
3. Edit as desired
4. Your version now takes precedence over the library version

**To create custom assets**:
1. Create a new `.art` file in `public/art/{type}/{custom-name}.art`
2. Follow the format documented in the type-specific README
3. Reference by name in your code

### Asset Updates

When you run `npm update asciitorium`:
- Library assets are automatically updated in `node_modules/asciitorium/public/art/`
- Your project assets in `public/art/` are never touched
- Any library assets you haven't overridden get the latest improvements
- Any assets you've copied to your project stay as-is (your responsibility to update)

**Best Practice**: Only copy library assets to your project if you need to customize them. Use library assets directly whenever possible to benefit from automatic updates.

### Listing Available Library Assets

To see all available library assets, check:
```bash
ls node_modules/asciitorium/public/art/materials/
ls node_modules/asciitorium/public/art/sprites/
ls node_modules/asciitorium/public/art/fonts/
ls node_modules/asciitorium/public/art/maps/
ls node_modules/asciitorium/public/art/sounds/
```

Or view the latest assets in the [asciitorium repository](https://github.com/tgruby/asciitorium/tree/main/packages/asciitorium/public/art).

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
