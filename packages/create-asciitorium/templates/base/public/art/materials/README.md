# Asciitorium Materials

> **Note**: This directory is empty by default. The asciitorium library includes starter assets in `node_modules/asciitorium/public/art/materials/` that are automatically available without copying. See the main [art/README.md](../README.md) for details on using and customizing library assets.

This directory contains ASCII art material files for the **FirstPersonView** and
**MapView** components. Materials define the visual appearance of walls, floors,
and other environmental surfaces with depth-based layering.

## Material File Format

Material files use the `.art` extension and follow a structured format with
metadata separators:

### File Structure

#### Wall Material

```txt
§ {"kind":"material","usage":"first-person"}
¶ {"layer":"here","position":"left","x":-1}
|╲
| ╲
|  ╲
|   ╲
|    ╲
|     ╲
|      ╲
|      |
|      |
¶ {"layer":"near","position":"center","x":6}
 ____________
|            |
|            |
|            |
|____________|
```

#### Ground Material

```txt
§ {"kind":"material","usage":"first-person","placement":"ground"}
¶ {"layer":"here","position":"center"}
  ⎽       ⎽
 (_'⎯⎯⎯⎯⎯'_)
 (⎽.⎯⎯⎯⎯⎯.⎽)
¶ {"layer":"near","position":"center"}
:‧‧:
¶ {"layer":"middle","position":"center"}
..
¶ {"layer":"far","position":"center"}
‥
```

### Key Components

1. **File Header** (`§` separator)
   - Must start with `§ {"kind":"material"}`
   - Indicates this is a material asset
   - Defines material properties:
     - `usage`: Rendering context (`"first-person"`, `"top-down"`,
       `"side-scroller"`)
     - `placement`: Surface type (`"scenery"` [default], `"ground"`,
       `"ceiling"`)
     - `onEnterSound`: Sound file to play when player enters tile (e.g.,
       `"splash.mp3"`)
     - `onExitSound`: Sound file to play when player exits tile
     - `ambientSound`: Looping sound while visible (future feature)

2. **Layer Sections** (`¶` separator)
   - Each layer begins with `¶` followed by JSON metadata
   - Layer metadata:
     - `layer`: Depth layer (`"here"`, `"near"`, `"middle"`, `"far"`)
     - `position`: Horizontal alignment (`"left"`, `"center"`, `"right"`)
     - `x`: Horizontal offset for precise positioning
   - Layer content follows immediately after the metadata line

3. **Layer Content**
   - ASCII art representation of the material at that depth
   - Each layer can be any width/height
   - Blank lines are preserved
   - Multiple layers create perspective depth

**Tips:**

- `"here"` layer is closest to viewer (immediate foreground)
- `"far"` layer is furthest (distant background)
- Use box drawing characters for structure: `|`, `─`, `╱`, `╲`, `╭`, `╮`, `╯`,
  `╰`
- Each layer can have left/center/right positioned elements with x-offsets for
  perspective alignment

## Using Materials in Your App

Materials are referenced in map legends through the `asset` property:

### Map Legend Entry

```json
{
  "chars": ["#"],
  "name": "wireframe-wall",
  "solid": true,
  "material": "wireframe"
}
```

The system loads the corresponding `wireframe.art` file and renders the
appropriate layer based on viewing context and distance.

## Technical Details

### Loading

Materials are loaded asynchronously via the `AssetManager`:

```typescript
const materialAsset = await AssetManager.getMaterial('wireframe');
```

### Caching

Material assets are cached on first load - subsequent uses of the same material
reuse the cached data.

### Sound System

Materials support sound playback through properties in the file header (`§`):

- **Sound files location**: `art/sounds/` directory
- **Supported formats**: MP3
- **Environment**: Sounds only play in web mode (not CLI)
- **onEnterSound**: Plays once when player steps onto tile with this material
- **onExitSound**: Plays once when player steps off tile

Control sounds globally via `SoundManager`:

```typescript
import { SoundManager } from 'asciitorium';

SoundManager.setEnabled(false);  // Disable all sounds
SoundManager.setEnabled(true);   // Re-enable sounds
SoundManager.playSound('custom-sound.mp3');  // Play manually
```

### Layer System

The layering system creates first-person perspective depth:

- **here**: Immediate foreground (closest to viewer)
- **near**: Close objects with full detail
- **middle**: Mid-distance objects with moderate detail
- **far**: Distant objects with minimal detail

Each layer can have left, center, and right positioned elements with specific
x-offsets for proper perspective alignment.
