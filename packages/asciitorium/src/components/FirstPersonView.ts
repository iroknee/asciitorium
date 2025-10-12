import { Component, ComponentProps } from '../core/Component';
import type { State } from '../core/State';
import { isState, loadArt } from '../core/environment';
import { requestRender } from '../core/RenderScheduler';
import { Direction, Player, MapData } from './MapView';
import { FirstPersonCompositor } from './FirstPersonCompositor';
import type { MapAsset, LegendEntry } from '../core/AssetManager';

interface RaycastOffset {
  dx: number;
  dy: number;
}

interface RaycastCube {
  here: { left: RaycastOffset; center: RaycastOffset; right: RaycastOffset };
  near: { left: RaycastOffset; center: RaycastOffset; right: RaycastOffset };
  middle: { left: RaycastOffset; center: RaycastOffset; right: RaycastOffset };
  far: { left: RaycastOffset; center: RaycastOffset; right: RaycastOffset };
}

// Predefined raycast cubes for each direction
const RAYCAST_CUBES: Record<Direction, RaycastCube> = {
  north: {
    here: { left: { dx: -2, dy: 0 }, center: { dx: 0, dy: 0 }, right: { dx: 2, dy: 0 } },
    near: { left: { dx: -2, dy: -1 }, center: { dx: 0, dy: -1 }, right: { dx: 2, dy: -1 } },
    middle: { left: { dx: -2, dy: -2 }, center: { dx: 0, dy: -2 }, right: { dx: 2, dy: -2 } },
    far: { left: { dx: -2, dy: -3 }, center: { dx: 0, dy: -3 }, right: { dx: 2, dy: -3 } }
  },
  south: {
    here: { left: { dx: 2, dy: 0 }, center: { dx: 0, dy: 0 }, right: { dx: -2, dy: 0 } },
    near: { left: { dx: 2, dy: 1 }, center: { dx: 0, dy: 1 }, right: { dx: -2, dy: 1 } },
    middle: { left: { dx: 2, dy: 2 }, center: { dx: 0, dy: 2 }, right: { dx: -2, dy: 2 } },
    far: { left: { dx: 2, dy: 3 }, center: { dx: 0, dy: 3 }, right: { dx: -2, dy: 3 } }
  },
  east: {
    here: { left: { dx: 0, dy: -1 }, center: { dx: 0, dy: 0 }, right: { dx: 0, dy: 1 } },
    near: { left: { dx: 2, dy: -1 }, center: { dx: 2, dy: 0 }, right: { dx: 2, dy: 1 } },
    middle: { left: { dx: 4, dy: -1 }, center: { dx: 4, dy: 0 }, right: { dx: 4, dy: 1 } },
    far: { left: { dx: 6, dy: -1 }, center: { dx: 6, dy: 0 }, right: { dx: 6, dy: 1 } }
  },
  west: {
    here: { left: { dx: 0, dy: 1 }, center: { dx: 0, dy: 0 }, right: { dx: 0, dy: -1 } },
    near: { left: { dx: -2, dy: 1 }, center: { dx: -2, dy: 0 }, right: { dx: -2, dy: -1 } },
    middle: { left: { dx: -4, dy: 1 }, center: { dx: -4, dy: 0 }, right: { dx: -4, dy: -1 } },
    far: { left: { dx: -6, dy: 1 }, center: { dx: -6, dy: 0 }, right: { dx: -6, dy: -1 } }
  }
};

export interface FirstPersonViewOptions extends Omit<ComponentProps, 'children'> {
  mapAsset: State<MapAsset | null>;
  player: State<Player>;
  transparency?: boolean; // When true, spaces won't overwrite existing content (useful for debugging)
}

export class FirstPersonView extends Component {
  focusable = false; // First person view is display-only
  private mapAssetState: State<MapAsset | null>;
  private playerState: State<Player>;
  private compositor: FirstPersonCompositor;
  private transparency: boolean;
  private cachedView: string[][] | null = null;

  constructor(options: FirstPersonViewOptions) {
    const {
      mapAsset,
      player,
      transparency,
      style,
      ...componentProps
    } = options;

    super({
      ...componentProps,
      width: 28, // Fixed width for consistent ASCII sprite positioning
      height: 28, // Fixed height for consistent ASCII sprite positioning
      border: options.border ?? options.style?.border ?? true,
    });

    this.mapAssetState = mapAsset;
    this.playerState = player;
    this.transparency = transparency ?? false;

    this.compositor = new FirstPersonCompositor();

    // Subscribe to player state changes
    this.playerState.subscribe(() => {
      this.cachedView = null; // Invalidate cache
      requestRender();
    });

    // Subscribe to map state changes (for initial load and hot-reload)
    this.mapAssetState.subscribe(() => {
      this.cachedView = null; // Invalidate cache when map data changes
      requestRender();
    });
  }

  get mapAsset(): MapAsset | null {
    return this.mapAssetState.value;
  }

  get mapData(): string[] {
    return this.mapAsset?.mapData ?? [];
  }

  get legend(): Record<string, LegendEntry> {
    return this.mapAsset?.legend ?? {};
  }

  get player(): Player {
    return this.playerState.value;
  }

  private isSolid(x: number, y: number): boolean {
    const mapData = this.mapData;
    const legend = this.legend;

    if (y < 0 || y >= mapData.length || x < 0 || x >= mapData[y].length) {
      return true; // Out of bounds = solid
    }

    const char = mapData[y][x];
    const legendEntry = legend[char];

    return legendEntry?.solid ?? false;
  }

  /**
   * Converts a cardinal direction into a unit vector for coordinate calculations
   *
   * Coordinate System:
   * - X axis: Horizontal (left/right) - positive X goes east (right)
   * - Y axis: Vertical (up/down) - positive Y goes south (down)
   *
   * This matches typical 2D array indexing where:
   * - map[y][x] means row Y, column X
   * - Moving "down" increases Y (going to higher row indices)
   * - Moving "right" increases X (going to higher column indices)
   */
  private getDirectionVector(direction: Direction): { dx: number; dy: number } {
    switch (direction) {
      case 'north':
        return { dx: 0, dy: -1 };   // Move up: decrease Y (go to earlier rows)
      case 'south':
        return { dx: 0, dy: 1 };    // Move down: increase Y (go to later rows)
      case 'east':
        return { dx: 1, dy: 0 };    // Move right: increase X (go to later columns)
      case 'west':
        return { dx: -1, dy: 0 };   // Move left: decrease X (go to earlier columns)
      default:
        return { dx: 0, dy: -1 };   // Default to north
    }
  }

  private getLeftDirection(direction: Direction): Direction {
    switch (direction) {
      case 'north':
        return 'west';
      case 'west':
        return 'south';
      case 'south':
        return 'east';
      case 'east':
        return 'north';
      default:
        return 'west';
    }
  }

  private getRightDirection(direction: Direction): Direction {
    switch (direction) {
      case 'north':
        return 'east';
      case 'east':
        return 'south';
      case 'south':
        return 'west';
      case 'west':
        return 'north';
      default:
        return 'east';
    }
  }




  /**
   * Cast rays using predefined offset cubes to determine what's visible in the first-person view
   *
   * Uses direction-specific raycast cubes with predefined relative offsets for each position.
   * This eliminates coordinate calculation errors and provides complete control over
   * which exact positions are checked for each direction.
   *
   * Returns the actual map character at each position (or null if occluded/out of bounds)
   */
  private castRays(): {
    here: { left: string | null; center: string | null; right: string | null };
    near: { left: string | null; center: string | null; right: string | null };
    middle: { left: string | null; center: string | null; right: string | null };
    far: { left: string | null; center: string | null; right: string | null };
  } {
    const mapData = this.mapData;
    const player = this.player;

    // If no map data, return null for all positions
    if (!mapData || mapData.length === 0) {
      return {
        here: { left: null, center: null, right: null },
        near: { left: null, center: null, right: null },
        middle: { left: null, center: null, right: null },
        far: { left: null, center: null, right: null },
      };
    }

    // Get the raycast cube for the player's current direction
    const cube = RAYCAST_CUBES[player.direction];

    // Initialize all positions as null
    const result = {
      here: { left: null as string | null, center: null as string | null, right: null as string | null },
      near: { left: null as string | null, center: null as string | null, right: null as string | null },
      middle: { left: null as string | null, center: null as string | null, right: null as string | null },
      far: { left: null as string | null, center: null as string | null, right: null as string | null },
    };

    // Cast rays using predefined offsets from the cube
    for (const depth of ['here', 'near', 'middle', 'far'] as const) {
      for (const position of ['left', 'center', 'right'] as const) {
        const offset = cube[depth][position];
        const checkX = player.x + offset.dx;
        const checkY = player.y + offset.dy;

        // Get the character at this position
        if (checkY >= 0 && checkY < mapData.length &&
            checkX >= 0 && checkX < mapData[checkY].length) {
          result[depth][position] = mapData[checkY][checkX];
        } else {
          // Out of bounds - treat as solid wall character (use a default)
          result[depth][position] = '█';
        }
      }
    }

    return result;
  }

  draw(): string[][] {
    super.draw(); // fills buffer, draws borders, etc.

    const mapData = this.mapData;
    const legend = this.legend;

    if (!mapData || mapData.length === 0) {
      return this.buffer;
    }

    const innerWidth = this.width - (this.border ? 2 : 0);
    const innerHeight = this.height - (this.border ? 2 : 0);
    const offsetX = this.border ? 1 : 0;
    const offsetY = this.border ? 1 : 0;

    // Cast rays to determine what's visible
    const raycast = this.castRays();

    // Use cached view if available, otherwise render asynchronously
    if (this.cachedView) {
      // Use cached view
      const composedView = this.cachedView;
      for (let y = 0; y < composedView.length && y < innerHeight; y++) {
        for (let x = 0; x < composedView[y].length && x < innerWidth; x++) {
          const char = composedView[y][x];
          if (char && char !== ' ') {
            this.buffer[y + offsetY][x + offsetX] = char;
          }
        }
      }
    } else {
      // Start async composition
      this.compositor.compose(raycast, legend, innerWidth, innerHeight, this.transparency)
        .then((composedView) => {
          this.cachedView = composedView;
          requestRender(); // Request re-render with the composed view
        })
        .catch((error) => {
          console.error('Failed to compose first-person view:', error);
        });
    }

    return this.buffer;
  }
}