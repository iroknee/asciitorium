import { Component, ComponentProps } from '../core/Component';
import type { State } from '../core/State';
import { isState, loadArt } from '../core/environment';
import { requestRender } from '../core/RenderScheduler';
import { Direction, Player, MapData } from './Maze';
import { FirstPersonCompositor } from './FirstPersonCompositor';
import { SceneryTheme } from '../sprites/ScenerySprites';

export interface FirstPersonViewOptions extends Omit<ComponentProps, 'children'> {
  content?:
    | MapData
    | string[]
    | string
    | State<MapData>
    | State<string[]>
    | State<string>;
  src?: string; // URL or file path to load maze from
  player: Player | State<Player>;
  sceneryTheme?: SceneryTheme | State<SceneryTheme>; // Scenery theme
}

export class FirstPersonView extends Component {
  focusable = false; // First person view is display-only
  private contentSource:
    | MapData
    | string[]
    | string
    | State<MapData>
    | State<string[]>
    | State<string>;
  private playerSource: Player | State<Player>;
  private compositor: FirstPersonCompositor;
  private sceneryThemeSource: SceneryTheme | State<SceneryTheme>;
  private isLoading = false;
  private loadError?: string;
  private src?: string;

  constructor(options: FirstPersonViewOptions) {
    const {
      content,
      src,
      player,
      sceneryTheme,
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

    if (src) {
      isLoadingSrc = true;
      actualContent = 'Loading...';
    } else {
      if (!content) {
        throw new Error(
          'FirstPersonView requires either src or content parameter'
        );
      }
      actualContent = content;
    }

    super({
      ...componentProps,
      width: 28, // Fixed width for consistent ASCII sprite positioning
      height: 27, // Fixed height for consistent ASCII sprite positioning
      border: options.border ?? options.style?.border ?? true,
    });

    this.contentSource = actualContent;
    this.playerSource = player;
    this.sceneryThemeSource = sceneryTheme ?? 'brick';

    // Get initial theme value
    const initialSceneryTheme = isState(this.sceneryThemeSource)
      ? (this.sceneryThemeSource as State<SceneryTheme>).value
      : (this.sceneryThemeSource as SceneryTheme);

    this.compositor = new FirstPersonCompositor(initialSceneryTheme);

    // Subscribe to player state changes
    if (isState(this.playerSource)) {
      (this.playerSource as State<Player>).subscribe(() => {
        requestRender();
      });
    }

    // Subscribe to theme changes
    if (isState(this.sceneryThemeSource)) {
      (this.sceneryThemeSource as State<SceneryTheme>).subscribe((newTheme) => {
        this.compositor.setSceneryTheme(newTheme);
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
          this.loadError = error.message || 'Failed to load maze';
          this.updateContent(`Error: ${this.loadError}`);
        });
    }
  }

  get mapData(): MapData {
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
    return isState(this.playerSource)
      ? (this.playerSource as State<Player>).value
      : (this.playerSource as Player);
  }

  private isWall(x: number, y: number, mapLines: string[]): boolean {
    if (y < 0 || y >= mapLines.length || x < 0 || x >= mapLines[y].length)
      return true;
    const char = mapLines[y][x];
    // Check for box drawing characters used in the maze
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
    ];
    return wallChars.includes(char);
  }

  private getDirectionVector(direction: Direction): { dx: number; dy: number } {
    switch (direction) {
      case 'north':
        return { dx: 0, dy: -1 };
      case 'south':
        return { dx: 0, dy: 1 };
      case 'east':
        return { dx: 1, dy: 0 };
      case 'west':
        return { dx: -1, dy: 0 };
      default:
        return { dx: 0, dy: -1 };
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

  private castRays(): {
    far: { left: boolean | null; center: boolean | null; right: boolean | null };
    middle: { left: boolean | null; center: boolean | null; right: boolean | null };
    near: { left: boolean | null; center: boolean | null; right: boolean | null };
  } {
    const map = this.mapData;
    const player = this.player;
    const mapLines = map.map;

    if (!mapLines || mapLines.length === 0) {
      return {
        far: { left: true, center: true, right: true },
        middle: { left: true, center: true, right: true },
        near: { left: true, center: true, right: true },
      };
    }

    const forwardDir = this.getDirectionVector(player.direction);
    const leftDir = this.getDirectionVector(this.getLeftDirection(player.direction));
    const rightDir = this.getDirectionVector(this.getRightDirection(player.direction));

    const result = {
      far: { left: false, center: false, right: false },
      middle: { left: false, center: false, right: false },
      near: { left: false, center: false, right: false },
    };

    // Cast rays at each distance
    for (let distance = 1; distance <= 3; distance++) {
      const depth = distance === 1 ? 'near' : distance === 2 ? 'middle' : 'far';

      // Forward ray (center)
      const centerX = player.x + forwardDir.dx * distance;
      const centerY = player.y + forwardDir.dy * distance;
      result[depth].center = this.isWall(centerX, centerY, mapLines);

      if (distance === 1) {
        // For near distance, check immediately to the left and right of player
        const leftX = player.x + leftDir.dx;
        const leftY = player.y + leftDir.dy;
        result[depth].left = this.isWall(leftX, leftY, mapLines);

        const rightX = player.x + rightDir.dx;
        const rightY = player.y + rightDir.dy;
        result[depth].right = this.isWall(rightX, rightY, mapLines);
      } else {
        // For middle and far distances, check if view is blocked by near center wall
        if (result.near.center) {
          // Near center wall blocks view of middle and far left/right
          result[depth].left = null;
          result[depth].right = null;
        } else {
          // Check diagonally forward if not blocked
          const leftX = player.x + leftDir.dx + forwardDir.dx * distance;
          const leftY = player.y + leftDir.dy + forwardDir.dy * distance;
          result[depth].left = this.isWall(leftX, leftY, mapLines);

          const rightX = player.x + rightDir.dx + forwardDir.dx * distance;
          const rightY = player.y + rightDir.dy + forwardDir.dy * distance;
          result[depth].right = this.isWall(rightX, rightY, mapLines);
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

    const innerWidth = this.width - (this.border ? 2 : 0);
    const innerHeight = this.height - (this.border ? 2 : 0);
    const offsetX = this.border ? 1 : 0;
    const offsetY = this.border ? 1 : 0;

    // Cast rays to determine what's visible
    const raycast = this.castRays();

    // Use compositor to generate the view
    const composedView = this.compositor.compose(raycast, innerWidth, innerHeight);

    // Copy composed view into our buffer with border offset
    for (let y = 0; y < composedView.length && y < innerHeight; y++) {
      for (let x = 0; x < composedView[y].length && x < innerWidth; x++) {
        const char = composedView[y][x];
        if (char && char !== ' ') {
          this.buffer[y + offsetY][x + offsetX] = char;
        }
      }
    }

    return this.buffer;
  }

  private updateContent(newContent: string): void {
    // Update the content source with the loaded data
    this.contentSource = newContent;

    // Request a re-render
    requestRender();
  }

  // Method to change theme dynamically
  setSceneryTheme(theme: SceneryTheme): void {
    this.compositor.setSceneryTheme(theme);
    requestRender();
  }

  // Get available themes
  static getAvailableSceneryThemes(): SceneryTheme[] {
    return FirstPersonCompositor.getAvailableSceneryThemes();
  }
}