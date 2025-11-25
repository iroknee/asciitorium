# Asciitorium Sprites

> **Note**: This directory is empty by default. The asciitorium library includes starter assets in `node_modules/asciitorium/public/art/sprites/` that are automatically available without copying. See the main [art/README.md](../README.md) for details on using and customizing library assets.

This directory contains ASCII sprite files for the **Art** component. Sprites
allow you to display static or animated ASCII art via the Art component.

## Sprite File Format

Sprite files use the `.art` extension and follow a structured format with
metadata separators:

### File Structure

#### Simple Static Sprite (no metadata)

``` txt
 ▄█▀█▄  ▄███▄
▐█░██████████▌
 ██▒█████████
  ▀████████▀
     ▀██▀
```

#### Animated Sprite with Metadata

``` txt
§ {"kind":"sprite","loop":true,"default-frame-rate":100}
¶ {"duration":1000}
 ▄█▀█▄  ▄███▄
▐█░██████████▌
 ██▒█████████
  ▀████████▀
     ▀██▀
¶
  ▄█▀▄  ▄██▄
 ▐█░████████▌
  ██▒███████
   ▀██████▀
      ▀▀
¶
   ▄█▀▄▄██▄
  ▐█░██████▌
   ██▒█████
    ▀████▀
      ▀▀
```

### Key Components

1. **File Header** (`§` separator) - Optional
   - Must start with `§ {"kind":"sprite"}`
   - Indicates this is a sprite asset
   - Defines default animation settings:
     - `default-frame-rate`: Default duration in milliseconds for each frame
     - `loop`: Whether animation loops (true/false)
     - `transparent`: Single character to treat as transparent (e.g., `" "`)

2. **Frame Sections** (`¶` separator) - Optional
   - Each frame begins with `¶` followed by optional JSON metadata
   - Frame metadata (all optional):
     - `duration`: Override default frame duration in milliseconds
     - `sound`: Sound ID to play when frame displays
   - Frame content follows immediately after the metadata line
   - If no metadata needed, use `¶` alone

3. **Frame Content**
   - ASCII art representation of the sprite frame
   - Each frame can be any width/height
   - Blank lines are preserved
   - Maximum sprite dimensions determined by largest frame

**Tips:**

- Files without `§` or `¶` are treated as single-frame static sprites
- Empty lines within frames are preserved for vertical spacing
- The first line after frame metadata is part of the sprite (no automatic
  trimming)
- All frames should have consistent dimensions for best results
- Use the `transparent` property to define overlay sprites

## Using Sprites in Your App

### Basic Usage (Async Loading)

```tsx
<Art sprite="balloon" />
```

### With Reactive State

```tsx
import { State } from 'asciitorium';

const playerSprite = new State<string>(defaultArt);

<Art content={playerSprite} />
```

### Available Props

- `sprite`: Name of sprite file (without `.art` extension) to load asynchronously
- `content`: String or `State<string>` for inline sprite content
- `children`: Alternative way to provide inline content
- Plus all standard component props: `position`, `border`, `align`, `style`,
  etc.

## Technical Details

### Loading

Sprites are loaded asynchronously via the `AssetManager`:

```typescript
const spriteAsset = await AssetManager.getSprite('mysprite');
```

### Caching

Sprite assets are cached on first load - subsequent uses of the same sprite
reuse the cached data.

### Animation System

The Art component automatically:

- Parses sprite metadata and frames
- Schedules frame transitions based on duration
- Handles looping vs. one-shot playback
- Requests renders when frames change
- Cleans up timers when component is destroyed

### Dimension Calculation

Component dimensions are automatically calculated from the largest frame:

- Width: Maximum line length across all frames
- Height: Maximum number of lines across all frames
