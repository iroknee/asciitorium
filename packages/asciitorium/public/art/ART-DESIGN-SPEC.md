# Art Asset Format Specification

This document defines the metadata format for ASCII art assets in asciitorium, including materials and sprites.

## Overview

Art assets use a text-based format that combines:

- **Section headers** (`§`) defining global asset properties
- **Layer/frame separators** (`¶`) with metadata for each section
- **ASCII art content** following each separator

## Design Goals

1. **Human-readable**: Artists should be able to read and write metadata without tooling
2. **Simple**: Use standard JSON format with flat key-value structure
3. **No nesting**: Flat data structures only - no nested objects or arrays
4. **Consistent**: Same format works for materials, sprites, and future asset types
5. **Extensible**: Easy to add new properties without breaking existing assets

## Format Syntax

### Section Header (`§`)

The section header appears once at the beginning of the file and defines the asset type and global properties.

**Format:**

```
§ {"key":"value","key":"value"}
```

**Example:**

```
§ {"kind":"material","usage":"first-person","placement":"scenery"}
```

### Layer/Frame Separator (`¶`)

Separates different layers (materials) or frames (sprites) with section-specific metadata.

**Format:**

```
¶ {"key":"value","key":"value"}
[ASCII art content follows]
```

**Example:**

```
¶ {"layer":"here","pos":"center"}
   |‽‽‽‽‽‽‽|
   |‽‽‽‽‽‽‽|
```

## Parsing Rules

### JSON Format

1. **Parse as JSON**: Standard JSON.parse() after removing separator character
2. **Primitive values only**: All values must be strings, numbers, or booleans
3. **No nesting**: Objects must be flat - no nested objects or arrays
4. **Empty metadata**: Empty separator `¶` or `§` is valid (inherits defaults)

### Empty Separators

A separator with no metadata is valid:

```
¶
[ASCII art content]
```

This inherits defaults or indicates a frame with no special properties.

### Single-Frame Sprites

If a file does not start with a `§` section header, it is assumed to be a single-frame sprite with no metadata:

```
  ___
 /   \
|  o  |
 \___/
```

This is equivalent to:

```
§ {"kind":"sprite","loop":"false"}
¶
  ___
 /   \
|  o  |
 \___/
```

## Material Assets

Materials define visual representations at different distances in first-person view.

### Section Header Properties

| Key            | Values                                      | Required | Description                       |
| -------------- | ------------------------------------------- | -------- | --------------------------------- |
| `kind`         | `material`                                  | Yes      | Asset type identifier             |
| `usage`        | `first-person`, `top-down`, `side-scroller` | Yes      | Rendering context                 |
| `placement`    | `scenery`, `ground`, `ceiling`              | No       | Surface type (default: `scenery`) |
| `onEnterSound` | filename                                    | No       | Sound when player enters tile     |
| `onExitSound`  | filename                                    | No       | Sound when player exits tile      |
| `ambientSound` | filename                                    | No       | Looping sound near this material  |

### Layer Separator Properties

| Key     | Values                          | Required | Description                     |
| ------- | ------------------------------- | -------- | ------------------------------- |
| `layer` | `here`, `near`, `middle`, `far` | Yes      | Distance layer                  |
| `pos`   | `left`, `center`, `right`       | Yes      | Horizontal position             |
| `x`     | number                          | No       | Horizontal offset for alignment |

### Material Example

```
§ {"kind":"material","usage":"first-person","placement":"scenery","onEnterSound":"door-open.mp3","onExitSound":"door-close.mp3"}
¶ {"layer":"here","pos":"left"}
 ╲
 ┊╲
╲┊ ╲
¶ {"layer":"here","pos":"center"}
   |‽‽‽‽‽‽‽‽‽‽|
   |‽‽‽‽‽‽‽‽‽‽|
   |‽‽‽‽‽‽‽‽‽‽|
¶ {"layer":"here","pos":"right"}
      ╱
     ╱┊
    ╱ ┊╱
¶ {"layer":"near","pos":"center"}
 …… ……… ……… …
┊……┊………┊………┊…┊
┊┊…╭───────╮…┊
┊……|┋┋┋┋┋┋┋|…┊
¶ {"layer":"middle","pos":"center"}
 … … ……
┊…┊…┊……┊
┊…╭──╮…┊
┊…|┋┋|…┊
¶ {"layer":"far","pos":"center"}
 ……
┊……┊
┊||┊
```

### Layer System

Materials use a layered perspective system that adapts to different usage contexts:

#### First-Person Usage

- **here**: Immediate foreground (player is on this tile)
- **near**: Close distance (1-2 tiles away)
- **middle**: Mid distance (3-5 tiles away)
- **far**: Far distance (6+ tiles away)

#### Side-Scroller Usage (Parallax Layers)

- **here**: Interactive elements (platforms player stands on, walls player collides with)
- **near**: Foreground elements (close platforms, foreground decorations)
- **middle**: Midground elements (trees, buildings, mid-distance scenery)
- **far**: Background elements (mountains, clouds, distant scenery)

#### Top-Down Usage

- **here**: Ground level elements (floors, paths the player walks on)
- **near**: Low obstacles and ground decorations
- **middle**: Medium height elements (furniture, props)
- **far**: Tall elements and ceiling details

Each layer can have `left`, `center`, and `right` positioned elements for additional composition control.

### Sound Triggers

Sound properties are defined once in the section header and apply to the entire material:

- **onEnterSound**: Plays once when player steps onto the tile
- **onExitSound**: Plays once when player leaves the tile
- **ambientSound**: Looping sound while material is visible (future feature)

Sound files must be placed in `art/sounds/` directory.

### Side-Scroller Material Example

Here's an example of materials for a side-scrolling platformer game:

**Ground Platform:**

```
§ {"kind":"material","usage":"side-scroller","placement":"ground","onEnterSound":"step.mp3"}
¶ {"layer":"here","pos":"center"}
═══════════════════════
▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓
```

**Brick Wall:**

```
§ {"kind":"material","usage":"side-scroller","placement":"scenery"}
¶ {"layer":"here","pos":"center"}
█▓▒░█▓▒░█▓▒░
░▒▓█░▒▓█░▒▓█
█▓▒░█▓▒░█▓▒░
░▒▓█░▒▓█░▒▓█
```

**Background Mountain (Parallax):**

```
§ {"kind":"material","usage":"side-scroller","placement":"scenery"}
¶ {"layer":"far","pos":"center"}
      /\
     /  \
    /    \
   /      \
  /        \
¶ {"layer":"middle","pos":"center"}
    /\  /\
   /  \/  \
  /        \
¶ {"layer":"near","pos":"center"}
 /\/\
/    \
```

In side-scrollers, the layer system naturally supports parallax scrolling where `far` layers move slower than `here` layers, creating depth perception.

## Sprite Assets

Sprites define animated ASCII art with multiple frames.

### Section Header Properties

| Key                  | Values          | Required | Description                                |
| -------------------- | --------------- | -------- | ------------------------------------------ |
| `kind`               | `sprite`        | Yes      | Asset type identifier                      |
| `loop`               | `true`, `false` | No       | Whether animation loops (default: `false`) |
| `default-frame-rate` | number (ms)     | No       | Default frame duration in milliseconds     |

### Frame Separator Properties

| Key        | Values      | Required | Description                        |
| ---------- | ----------- | -------- | ---------------------------------- |
| `duration` | number (ms) | No       | Frame duration (overrides default) |
| `sound`    | filename    | No       | Sound to play when frame displays  |
| `event`    | string      | No       | Custom event name to trigger       |

### Sprite Example

```
§ {"kind":"sprite","loop":true,"default-frame-rate":120}
¶ {"duration":1000}
                _ _ _             _
  __ _ ___  ___(_|_) |_ ___  _ __(_)_   _ _ __ ___
 / _` / __|/ __| | | __/ _ \| '__| | | | | '_ ` _ \
| (_| \__ \ (__| | | || (_) | |  | | |_| | | | | | |
 \__,_|___/\___|_|_|\__\___/|_|  |_|\__,_|_| |_| |_|
¶ {"duration":500}
              .   _ * _             *     .
  __ _ ___  ___(_|_).|_   *  _ __(_)_   _   *  __
 / _` / __|/ _ .  |  __/  . \ '__| | | | '   `  \ .
| (_| \__  (__| *|.| || (_) |  * | | |_|  *| | | │ .
 \__,_|___/\__ ._|_|\__\  * /|_|   .|\__   |_| |_│
¶
          *      _    *     .    *     .    *
  __   *      (_|_)   .  *   _ __   .     .    __
 /   `    __|  |    __/   * \ '__|     *      ` \
| *   * \__    | | || (_) |   .  |  *  *   |   | │
   .  .|___/   |_| \__\___/|_|   .    .  |_|  . |_│
```

### Frame Timing

- **default-frame-rate**: Sets base duration for all frames
- **duration**: Overrides default for specific frame
- No duration specified: Uses default-frame-rate or 100ms if neither set

### Animation Control

- **loop:true**: Animation repeats from first frame after last frame
- **loop:false**: Animation plays once and stops on last frame

## Parser Implementation Pseudocode

```typescript
function parseMetadata(
  line: string
): Record<string, string | number | boolean> {
  line = line.trim();

  // Empty separator
  if (line === '¶' || line === '§') {
    return {};
  }

  // Remove separator character
  line = line.substring(1).trim();

  // Empty metadata after separator
  if (line === '') {
    return {};
  }

  // Parse JSON
  const metadata = JSON.parse(line);

  // Validate no nesting (all values must be primitives)
  for (const [key, value] of Object.entries(metadata)) {
    const type = typeof value;
    if (type !== 'string' && type !== 'number' && type !== 'boolean') {
      throw new Error(
        `Property "${key}" must be a primitive value (string, number, or boolean). ` +
          `Nested objects and arrays are not supported.`
      );
    }
  }

  return metadata;
}
```

## Validation Rules

### Required Properties

- Section header MUST have `kind` property
- Material layers MUST have `layer` and `pos` properties
- Sprite frames MAY omit all properties (inherits defaults)

### No Nesting Rule

- All values MUST be primitives (string, number, or boolean)
- Nested objects are NOT allowed
- Arrays are NOT allowed
- This keeps the format simple and predictable

**Invalid (nested object):**

```json
{ "onEnter": { "sound": "door.mp3" } }
```

**Valid (flat structure with primitives):**

```json
{ "onEnterSound": "door.mp3", "duration": 1000, "loop": true }
```

### Value Constraints

- **layer**: Must be one of `here`, `near`, `middle`, `far`
- **pos**: Must be one of `left`, `center`, `right`
- **placement**: Must be one of `scenery`, `ground`, `ceiling`
- **usage**: Must be one of `first-person`, `top-down`, `side-scroller`
- **loop**: Must be boolean `true` or `false`
- **duration**: Must be positive number (milliseconds)
- **default-frame-rate**: Must be positive number (milliseconds)
- **x**: Must be number (integer)

### Sound File References

- Sound properties contain filename only (no path)
- Files resolved relative to `art/sounds/` directory
- Format: `"onEnterSound":"door-open.mp3"` not `"onEnterSound":"art/sounds/door-open.mp3"`
