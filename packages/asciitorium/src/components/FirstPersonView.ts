import { Component, ComponentProps } from '../core/Component';
import type { State } from '../core/State';
import { isState, loadArt } from '../core/environment';
import { requestRender } from '../core/RenderScheduler';
import { Direction, Player, MapData } from './MapView';
import { FirstPersonCompositor } from './FirstPersonCompositor';
import type { GameWorld } from '../core/GameWorld';

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
  // New: GameWorld integration (preferred)
  gameWorld?: GameWorld;

  // Legacy: Direct map/player props (for backward compatibility)
  content?:
    | MapData
    | string[]
    | string
    | State<MapData>
    | State<string[]>
    | State<string>;
  src?: string; // URL or file path to load map from
  player?: Player | State<Player>;

  // Common options (work with both modes)
  scene?: string | State<string>; // Scene name
  transparency?: boolean; // When true, spaces won't overwrite existing content (useful for debugging)
}

export class FirstPersonView extends Component {
  focusable = false; // First person view is display-only
  private gameWorld?: GameWorld;
  private contentSource:
    | MapData
    | string[]
    | string
    | State<MapData>
    | State<string[]>
    | State<string>;
  private playerSource?: Player | State<Player>;
  private compositor: FirstPersonCompositor;
  private isLoading = false;
  private loadError?: string;
  private src?: string;
  private transparency: boolean;
  private cachedView: string[][] | null = null;

  constructor(options: FirstPersonViewOptions) {
    const {
      gameWorld,
      content,
      src,
      player,
      scene, // Deprecated but kept for backward compatibility
      transparency,
      style,
      ...componentProps
    } = options;

    // Handle src prop for async loading
    let actualContent:
      | MapData
      | string[]
      | string
      | State<MapData>
      | State<string[]>
      | State<string>;
    let isLoadingSrc = false;

    if (gameWorld) {
      // GameWorld mode: use empty content initially
      actualContent = 'Loading...';
    } else if (src) {
      isLoadingSrc = true;
      actualContent = 'Loading...';
    } else {
      if (!content) {
        throw new Error(
          'FirstPersonView requires either gameWorld, src, or content parameter'
        );
      }
      actualContent = content;
    }

    super({
      ...componentProps,
      width: 28, // Fixed width for consistent ASCII sprite positioning
      height: 28, // Fixed height for consistent ASCII sprite positioning
      border: options.border ?? options.style?.border ?? true,
    });

    this.gameWorld = gameWorld;
    this.contentSource = actualContent;
    this.playerSource = player;
    this.transparency = transparency ?? false;

    this.compositor = new FirstPersonCompositor();

    // Subscribe to player state changes
    if (this.gameWorld) {
      this.gameWorld.getPlayerState().subscribe(() => {
        this.cachedView = null; // Invalidate cache
        requestRender();
      });
    } else if (isState(this.playerSource)) {
      (this.playerSource as State<Player>).subscribe(() => {
        this.cachedView = null; // Invalidate cache
        requestRender();
      });
    }

    // Handle src loading after super() call
    if (isLoadingSrc && src) {
      this.src = src;
      this.isLoading = true;

      // Start async loading
      loadArt(this.src)
        .then((loadedContent) => {
          this.isLoading = false;
          this.loadError = undefined;
          this.updateContent(loadedContent);
        })
        .catch((error) => {
          this.isLoading = false;
          this.loadError = error.message || 'Failed to load map';
          this.updateContent(`Error: ${this.loadError}`);
        });
    }
  }

  get mapData(): MapData {
    // GameWorld mode: get map from gameWorld
    if (this.gameWorld) {
      return { map: this.gameWorld.getMapData() };
    }

    // Legacy mode: get from contentSource
    let rawMapData: any;

    if (isState(this.contentSource)) {
      rawMapData = (this.contentSource as State<any>).value;
    } else {
      rawMapData = this.contentSource;
    }

    // Convert to MapData format
    if (typeof rawMapData === 'string') {
      // If it's a string (loaded text file), split by lines
      return { map: rawMapData.split('\n') };
    } else if (Array.isArray(rawMapData)) {
      // If it's a string array
      return { map: rawMapData };
    } else if (rawMapData && rawMapData.map) {
      // If it's already MapData
      return rawMapData;
    } else {
      // Fallback to empty map
      return { map: [] };
    }
  }

  get player(): Player {
    // GameWorld mode: get player from gameWorld
    if (this.gameWorld) {
      return this.gameWorld.getPlayer();
    }

    // Legacy mode: get from playerSource
    if (!this.playerSource) {
      return { x: 0, y: 0, direction: 'north' };
    }

    return isState(this.playerSource)
      ? (this.playerSource as State<Player>).value
      : (this.playerSource as Player);
  }

  private isWall(x: number, y: number, mapLines: string[]): boolean {
    // GameWorld mode: use legend-based collision detection
    if (this.gameWorld) {
      return this.gameWorld.isSolid(x, y);
    }

    // Legacy mode: hardcoded wall detection
    if (y < 0 || y >= mapLines.length || x < 0 || x >= mapLines[y].length)
      return true;
    const char = mapLines[y][x];
    // Check for box drawing characters used in the map
    const wallChars = [
      '╭',
      '╮',
      '╯',
      '╰',
      '─',
      '│',
      '┬',
      '┴',
      '├',
      '┤',
      '┼',
      '╷',
      '╵',
      '╴',
      '╶',
      'o', // Include 'o' as a wall character
    ];
    return wallChars.includes(char);
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
    const map = this.mapData;
    const player = this.player;
    const mapLines = map.map;

    // If no map data, return null for all positions
    if (!mapLines || mapLines.length === 0) {
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
        if (checkY >= 0 && checkY < mapLines.length &&
            checkX >= 0 && checkX < mapLines[checkY].length) {
          result[depth][position] = mapLines[checkY][checkX];
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

    const map = this.mapData;
    const player = this.player;

    if (!map || !map.map || !player) {
      return this.buffer;
    }

    // Get legend (GameWorld mode or empty for legacy mode)
    const legend = this.gameWorld?.getLegend() ?? {};

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

  private updateContent(newContent: string): void {
    // Update the content source with the loaded data
    this.contentSource = newContent;
    this.cachedView = null; // Invalidate cache

    // Request a re-render
    requestRender();
  }
}