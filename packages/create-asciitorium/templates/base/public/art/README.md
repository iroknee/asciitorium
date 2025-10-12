# Art Directory

This directory contains ASCII art assets for a project. It is organized into subfolders for maps, materials, and sprites. Each file uses plain text or JSON for easy editing and integration.

## Asset Loading and Caching

**IMPORTANT:** All assets are automatically loaded and cached by `AssetManager` using reactive `State` objects. When developing components that use assets:

### For Component Developers

**✅ DO:**
- Use `AssetManager.getMapState(name)` to get a reactive State for maps
- Use `AssetManager.getMaterialState(name)` to get a reactive State for materials
- Subscribe to the returned State to react to loading completion or changes
- Use `GameWorld.getMapState()` when working with GameWorld instances
- Share State references across components - the cache handles deduplication

**❌ DON'T:**
- Create local caches in components (Map, Set, plain objects)
- Use the legacy non-reactive methods (`getMap()`, `getMaterial()`) for new code
- Load the same asset multiple times - AssetManager caches automatically
- Store asset data in component properties - subscribe to State instead

### Example Usage

```typescript
// ✅ Correct: Use reactive State from AssetManager
const materialState = AssetManager.getMaterialState('brick-wall');

// Subscribe to get the value when loaded
materialState.subscribe((material) => {
  if (material) {
    // Material is loaded, use it
    console.log('Material loaded:', material);
  }
});

// Check current value (may be null if still loading)
if (materialState.value) {
  // Material already loaded from cache
}

// ✅ Correct: GameWorld automatically uses AssetManager's State cache
const gameWorld = new GameWorld({ mapName: 'dungeon' });
gameWorld.getMapState().subscribe((mapAsset) => {
  // Automatically updates when map loads
});

// ❌ Wrong: Don't create your own cache
class MyComponent {
  private myCache: Map<string, Material> = new Map(); // DON'T DO THIS!
}
```

### Architecture Benefits

- **Single source of truth**: AssetManager is the only cache
- **Automatic updates**: Components react when assets load or change
- **Memory efficient**: One copy of each asset shared across all components
- **Hot-reload ready**: Asset changes propagate automatically to all subscribers
- **No manual cache management**: State handles all invalidation and updates

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
