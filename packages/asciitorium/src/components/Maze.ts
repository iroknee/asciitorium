import { Component, ComponentProps } from '../core/Component';
import type { State } from '../core/State';
import { isState, loadArt } from '../core/environment';
import { requestRender } from '../core/RenderScheduler';

export type Direction = 'north' | 'south' | 'east' | 'west';

export interface Player {
  x: number;
  y: number;
  direction: Direction;
}

export interface MapData {
  map: string[];
}

export interface MazeOptions extends Omit<ComponentProps, 'children'> {
  content?:
    | MapData
    | string[]
    | string
    | State<MapData>
    | State<string[]>
    | State<string>;
  map?:
    | MapData
    | string[]
    | string
    | State<MapData>
    | State<string[]>
    | State<string>; // deprecated, use content
  src?: string; // URL or file path to load maze from
  player: Player | State<Player>;
  fogOfWar?: boolean | State<boolean>;
  exploredTiles?: Set<string> | State<Set<string>>;
  fogCharacter?: string;
}

export class Maze extends Component {
  focusable = true;
  private contentSource:
    | MapData
    | string[]
    | string
    | State<MapData>
    | State<string[]>
    | State<string>;
  private playerSource: Player | State<Player>;
  private fogOfWarSource: boolean | State<boolean>;
  private exploredTilesSource?: Set<string> | State<Set<string>>;
  private fogCharacter: string;
  private isLoading = false;
  private loadError?: string;
  private src?: string;

  constructor(options: MazeOptions) {
    const {
      content,
      map,
      src,
      player,
      fogOfWar,
      exploredTiles,
      fogCharacter,
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
      // Use content if provided, fall back to map for backward compatibility
      const contentOrMap = content ?? map;
      if (!contentOrMap) {
        throw new Error(
          'AsciiMaze requires either src, content, or map parameter'
        );
      }
      actualContent = contentOrMap;
    }

    // Default dimensions if not specified
    const defaultHeight = 10;

    super({
      ...componentProps,
      width: options.width ?? options.style?.width ?? 'fill',
      height: options.height ?? options.style?.height ?? 'fill',
      border: options.border ?? options.style?.border ?? true,
    });

    this.contentSource = actualContent;
    this.playerSource = player;
    this.fogOfWarSource = fogOfWar ?? false;
    this.exploredTilesSource = exploredTiles;
    this.fogCharacter = fogCharacter ?? ' ';

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

  get exploredTiles(): Set<string> {
    if (!this.exploredTilesSource) {
      return new Set<string>();
    }
    return isState(this.exploredTilesSource)
      ? (this.exploredTilesSource as State<Set<string>>).value
      : (this.exploredTilesSource as Set<string>);
  }

  get fogOfWar(): boolean {
    return isState(this.fogOfWarSource)
      ? (this.fogOfWarSource as State<boolean>).value
      : (this.fogOfWarSource as boolean);
  }

  private isPositionVisible(
    x: number,
    y: number,
    playerX: number,
    playerY: number
  ): boolean {
    // 5 width x 3 height grid centered on player (±2 horizontally, ±1 vertically)
    const deltaX = Math.abs(x - playerX);
    const deltaY = Math.abs(y - playerY);
    return deltaX <= 2 && deltaY <= 1;
  }

  private isPositionExplored(x: number, y: number): boolean {
    return this.exploredTiles.has(`${x},${y}`);
  }

  private addExploredPosition(x: number, y: number): void {
    const key = `${x},${y}`;
    if (this.exploredTilesSource) {
      if (isState(this.exploredTilesSource)) {
        const currentSet = (this.exploredTilesSource as State<Set<string>>)
          .value;
        if (!currentSet.has(key)) {
          const newSet = new Set(currentSet);
          newSet.add(key);
          (this.exploredTilesSource as State<Set<string>>).value = newSet;
        }
      } else {
        (this.exploredTilesSource as Set<string>).add(key);
      }
    }
  }

  private getVisiblePositions(
    playerX: number,
    playerY: number
  ): { x: number; y: number }[] {
    const positions: { x: number; y: number }[] = [];
    for (let y = playerY - 1; y <= playerY + 1; y++) {
      for (let x = playerX - 2; x <= playerX + 2; x++) {
        positions.push({ x, y });
      }
    }
    return positions;
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

    // Calculate viewport centering
    const centerX = Math.floor(innerWidth / 2);
    const centerY = Math.floor(innerHeight / 2);

    // Calculate map bounds
    const mapHeight = map.map.length;
    const mapWidth = mapHeight > 0 ? map.map[0].length : 0;

    if (mapWidth === 0 || mapHeight === 0) {
      return this.buffer;
    }

    // If fog of war is enabled, mark visible positions as explored
    if (this.fogOfWar) {
      const visiblePositions = this.getVisiblePositions(player.x, player.y);
      for (const visPos of visiblePositions) {
        if (
          visPos.x >= 0 &&
          visPos.x < mapWidth &&
          visPos.y >= 0 &&
          visPos.y < mapHeight
        ) {
          this.addExploredPosition(visPos.x, visPos.y);
        }
      }
    }

    // Calculate the starting position in the map based on player position
    const startMapY = Math.max(0, player.y - centerY);
    const endMapY = Math.min(mapHeight, startMapY + innerHeight);

    const startMapX = Math.max(0, player.x - centerX);
    const endMapX = Math.min(mapWidth, startMapX + innerWidth);

    // Draw the map portion
    for (let mapY = startMapY; mapY < endMapY; mapY++) {
      const line = map.map[mapY];
      if (!line) continue;

      const bufferY = mapY - startMapY + offsetY;
      if (bufferY >= this.height) break;

      for (let mapX = startMapX; mapX < endMapX; mapX++) {
        const char = line[mapX];
        if (char === undefined) continue;

        const bufferX = mapX - startMapX + offsetX;
        if (bufferX >= this.width) break;

        // Check if this is the player position
        if (mapX === player.x && mapY === player.y) {
          // Draw player based on direction
          const directionChar = this.getDirectionChar(player.direction);
          this.buffer[bufferY][bufferX] = directionChar;
        } else {
          // Apply fog of war logic
          if (this.fogOfWar) {
            const isVisible = this.isPositionVisible(mapX, mapY, player.x, player.y);
            const isExplored = this.isPositionExplored(mapX, mapY);

            if (isVisible || isExplored) {
              this.buffer[bufferY][bufferX] = char;
            } else {
              this.buffer[bufferY][bufferX] = this.fogCharacter;
            }
          } else {
            this.buffer[bufferY][bufferX] = char;
          }
        }
      }
    }

    // Add focus indicator at position (0,0) if focused and has border
    if (this.hasFocus && this.border) {
      this.buffer[0][0] = '>';
    }

    return this.buffer;
  }

  private getDirectionChar(direction: Direction): string {
    switch (direction) {
      case 'north':
        return '↑';
      case 'south':
        return '↓';
      case 'east':
        return '→';
      case 'west':
        return '←';
      default:
        return '@';
    }
  }

  handleEvent(event: string): boolean {
    // Handle arrow keys and WASD movement
    let dx = 0,
      dy = 0;

    switch (event) {
      case 'ArrowUp':
      case 'w':
      case 'W':
        dy = -2;
        break;
      case 'ArrowDown':
      case 's':
      case 'S':
        dy = 2;
        break;
      case 'ArrowLeft':
      case 'a':
      case 'A':
        dx = -2;
        break;
      case 'ArrowRight':
      case 'd':
      case 'D':
        dx = 2;
        break;
      default:
        return false;
    }

    this.movePlayer(dx, dy);
    return true;
  }

  private movePlayer(dx: number, dy: number): void {
    const current = this.player;
    const map = this.mapData;

    if (!map || !map.map || map.map.length === 0) return;

    const mapLines = map.map;
    const mapWidth = mapLines.length > 0 ? mapLines[0].length : 0;
    const mapHeight = mapLines.length;

    const newX = Math.max(0, Math.min(mapWidth - 1, current.x + dx));
    const newY = Math.max(0, Math.min(mapHeight - 1, current.y + dy));

    // Check for collision with walls along the path
    const isWall = (x: number, y: number) => {
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
    };

    // Check intermediate positions when moving 2 spaces
    const stepX = dx === 0 ? 0 : dx > 0 ? 1 : -1;
    const stepY = dy === 0 ? 0 : dy > 0 ? 1 : -1;

    // Check first step
    const midX = current.x + stepX;
    const midY = current.y + stepY;
    if (isWall(midX, midY)) {
      // Hit a wall on first step, don't move but update direction
      let direction: Direction = current.direction;
      if (dx > 0) direction = 'east';
      else if (dx < 0) direction = 'west';
      else if (dy > 0) direction = 'south';
      else if (dy < 0) direction = 'north';

      this.updatePosition(current.x, current.y, direction);
      return;
    }

    // Check final destination
    if (isWall(newX, newY)) {
      // Hit a wall at destination, don't move but update direction
      let direction: Direction = current.direction;
      if (dx > 0) direction = 'east';
      else if (dx < 0) direction = 'west';
      else if (dy > 0) direction = 'south';
      else if (dy < 0) direction = 'north';

      this.updatePosition(current.x, current.y, direction);
      return;
    }

    let direction: Direction = current.direction;
    if (dx > 0) direction = 'east';
    else if (dx < 0) direction = 'west';
    else if (dy > 0) direction = 'south';
    else if (dy < 0) direction = 'north';

    this.updatePosition(newX, newY, direction);
  }

  private updatePosition(x: number, y: number, direction: Direction): void {
    if (isState(this.playerSource)) {
      (this.playerSource as State<Player>).value = { x, y, direction };
    } else {
      // If it's not a State, we can't update it - this would be a programming error
      console.warn(
        'AsciiMaze player is not a State object, cannot update player position'
      );
    }
  }

  private updateContent(newContent: string): void {
    // Update the content source with the loaded data
    this.contentSource = newContent;

    // Request a re-render
    requestRender();
  }
}
