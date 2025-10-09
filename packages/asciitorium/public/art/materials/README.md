# Materials Directory

This directory contains ASCII art representations of various materials and textures that can be used in asciitorium games. Materials define the visual appearance of surfaces, walls, floors, and other environmental elements.

## Contents

- `wireframe.txt`: A complex wireframe pattern demonstrating layered first-person perspective rendering

## Material File Format

Material files use a special format that combines ASCII art with JSON metadata to define how materials should be rendered in different contexts.

### File Structure

Materials use paragraph markers (`¶`) to separate different layers or variants, with each section containing:

1. **Metadata line**: JSON configuration starting with `¶`
2. **ASCII art**: The visual representation using text characters

### Example Material

Here's a section from `wireframe.txt` showing the layered format:

```text
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

### Example with Placement

Here's an example from `bone.txt` showing placement for ground materials:

```text
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

## Metadata Properties

### Section Header (`§`)

- **kind**: Type of asset (`"material"`)
- **usage**: Rendering context (`"first-person"`, `"top-down"`, etc.)
- **placement**: Surface placement (`"ground"`, `"ceiling"`) - optional property that indicates where the material should be applied. Use `"scenery"` for general background/wall materials (default)

### Layer Configuration (`¶`)

- **layer**: Depth layer (`"here"`, `"near"`, `"middle"`, `"far"`)
- **position**: Horizontal alignment (`"left"`, `"center"`, `"right"`)
- **x**: Horizontal offset for precise positioning
- **onEnter**: Sound event that triggers when the player steps onto this tile (optional)
  - Structure: `{"sound": "filename.mp3"}`
  - Only triggers for "here/center" layers when using GameWorld
  - Sound files should be placed in `art/sounds/` directory
- **onExit**: Sound event that triggers when the player steps off this tile (optional)
  - Structure: `{"sound": "filename.mp3"}`
  - Only triggers for "here/center" layers when using GameWorld
  - Sound files should be placed in `art/sounds/` directory

## Layer System

The wireframe material demonstrates a sophisticated layering system for first-person perspective:

- **here**: Immediate foreground elements (closest to viewer)
- **near**: Close objects with full detail
- **middle**: Mid-distance objects with moderate detail
- **far**: Distant objects with minimal detail

Each layer can have left, center, and right positioned elements with specific x-offsets for proper perspective alignment.

## Visual Techniques

Materials can use various ASCII characters for different effects:

- **Box drawing**: `|`, `─`, `╱`, `╲`, `╭`, `╮`, `╯`, `╰` for structural lines
- **Perspective lines**: `╱`, `╲` for diagonal depth
- **Solid fills**: `_` for horizontal surfaces
- **Spacing**: Careful use of spaces for proper alignment and depth

## Usage in Maps

Materials are referenced in map legends through the `asset` property:

```json
{
  "chars": ["#"],
  "kind": "material",
  "name": "wireframe-wall",
  "solid": true,
  "asset": "material/wireframe"
}
```

The system will load the corresponding `wireframe.txt` file and render the appropriate layer based on the viewing context and distance.

## Relationship with Legend Entities

The architecture separates visual presentation (materials) from gameplay behavior (legend entities):

### Materials Handle

- **Visual representation** at different distances (layer system)
- **Ambient sounds** tied to proximity (howling when near a wolf wall)
- **Transition sounds** when moving between layers (door creaking as you approach)
- **Distance-based events** (footsteps on different floor types)

### Legend Entities Handle

- **Interactions** (opening doors, picking up items, talking to NPCs)
- **Game state** (is door locked/unlocked, enemy health, treasure quantity)
- **Collision detection** (solid vs passable)
- **Gameplay behaviors** (enemy AI, trap triggers, puzzle mechanics)

### Example: Door Material + Entity

**Material file** (`door-wooden.txt`):

```text
§ {"kind":"material","usage":"first-person","placement":"scenery"}
¶ {"layer":"here","position":"center","onEnter":{"sound":"door-open.mp3"},"onExit":{"sound":"close-door.mp3"}}
[ASCII art for door at immediate distance - plays open sound when player steps onto this tile, close sound when leaving]
¶ {"layer":"near","position":"center"}
[ASCII art for door at near distance]
```

**Legend entry** (references the material):

```json
{
  "chars": ["o"],
  "kind": "material",
  "entity": "door",
  "variant": "wooden",
  "name": "Wooden Door",
  "solid": false,
  "asset": "material/door-wooden",
  "state": {
    "locked": false,
    "open": false
  },
  "interactions": {
    "onInteract": "toggle-door",
    "onMelee": "bash-door"
  }
}
```

This design allows:

- **Reusable materials**: Same door material can be used for locked/unlocked/magic doors
- **Instance-specific behavior**: Each door on the map can have different state (some locked, some open)
- **Separation of concerns**: Artists focus on materials, game designers focus on legend entities
- **Sensory cohesion**: Sounds/visuals stay together in material files

### Example: Puddle with Sound

Ground materials can also use `onEnter` for footstep sounds:

**Material file** (`puddle.txt`):

```text
§ {"kind":"material","usage":"first-person","placement":"ground"}
¶ {"layer":"here","position":"center","onEnter":{"sound":"splash.mp3"}}
  ~~~~
 ~~~~~~
~~~~~~~~
 ~~~~~~
  ~~~~
¶ {"layer":"near","position":"center"}
~~
```

**Legend entry**:

```json
{
  "chars": ["~"],
  "kind": "material",
  "name": "puddle",
  "solid": false,
  "asset": "material/puddle"
}
```

When the player steps onto a `~` tile, they'll hear a splash sound. This same pattern works for:

- Gravel paths (`crunch.mp3`)
- Creaky floorboards (`creak.mp3`)
- Grass (`rustle.mp3`)
- Snow (`snow-step.mp3`)

## Sound System

Materials support sound playback through the `onEnter` property in layer metadata. Sounds are automatically triggered by the GameWorld when the player steps onto a tile.

### Sound File Requirements

- **Location**: Place sound files in `art/sounds/` directory relative to your project root
- **Formats**: MP3, WAV, and other browser-supported audio formats
- **Environment**: Sounds only play in web environments (browser), not in CLI mode
- **Reference**: Use filename in metadata: `{"onEnter":{"sound":"filename.mp3"}}`

### How Sound Triggering Works

When using `GameWorld` for game logic:

1. Player moves to a new tile coordinate (x, y)
2. GameWorld triggers `onExit` sound for the previous tile (if any)
3. GameWorld checks the new tile's legend entry
4. If the entry is a material, GameWorld loads the material asset
5. If the material has a "here/center" layer with `onEnter.sound`, the sound plays
6. If the material has a "here/center" layer with `onExit.sound`, it will play when the player leaves the tile
7. Sounds play once per tile entry/exit (moving onto the same tile repeatedly will retrigger both sounds)

### Current Limitations

- Only "here/center" layer sounds trigger automatically on tile entry/exit
- Sounds on other layers ("near", "middle", "far") or positions ("left", "right") require custom implementation
- Future versions may support proximity-based sounds (e.g., `onApproach` for layers becoming visible)

### Controlling Sound Playback

You can control sound globally through the `SoundManager`:

```typescript
import { SoundManager } from 'asciitorium';

// Disable all sounds
SoundManager.setEnabled(false);

// Re-enable sounds
SoundManager.setEnabled(true);

// Check if sounds are enabled
const enabled = SoundManager.isEnabled();

// Manually play a sound
SoundManager.playSound('custom-sound.mp3');

// Clear sound cache
SoundManager.clearCache();
```

## Creating New Materials

When creating new material files:

1. Start with a section header (`§`) defining the material type and usage
2. Define multiple layers for depth perception
3. Use consistent positioning and x-offsets for alignment
4. Test with different viewing distances and angles
5. Follow ASCII art best practices for readability

Use this directory as a reference for creating rich, layered materials that enhance the visual depth of your asciitorium games.
