import { Component, ComponentProps } from '../core/Component';
import type { State } from '../core/State';
import { isState } from '../core/environment';
import { requestRender } from '../core/RenderScheduler';
import { AssetManager, type MapAsset, type LegendEntry } from '../core/AssetManager';
import type { GameWorld } from '../core/GameWorld';

export type Direction = 'north' | 'south' | 'east' | 'west';

export interface Player {
  x: number;
  y: number;
  direction: Direction;
}

export interface MapData {
  map: string[];
}

export interface MapViewOptions extends Omit<ComponentProps, 'children'> {
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
  map?:
    | MapData
    | string[]
    | string
    | State<MapData>
    | State<string[]>
    | State<string>; // deprecated, use content
  src?: string; // Asset name to load map from (e.g., 'example' loads art/maps/example/)
  player?: Player | State<Player>;

  // Common options (work with both modes)
  fogOfWar?: boolean | State<boolean>;
  exploredTiles?: Set<string> | State<Set<string>>;
  fogCharacter?: string;
}

export class MapView extends Component {
  focusable = true;
  private gameWorld?: GameWorld;
  private contentSource:
    | MapData
    | string[]
    | string
    | State<MapData>
    | State<string[]>
    | State<string>;
  private playerSource?: Player | State<Player>;
  private fogOfWarSource: boolean | State<boolean>;
  private exploredTilesSource?: Set<string> | State<Set<string>>;
  private fogCharacter: string;
  private isLoading = false;
  private loadError?: string;
  private src?: string;
  private legend?: Record<string, LegendEntry>;

  constructor(options: MapViewOptions) {
    const {
      gameWorld,
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

    if (gameWorld) {
      // GameWorld mode: use empty content initially
      actualContent = 'Loading...';
    } else if (src) {
      isLoadingSrc = true;
      actualContent = 'Loading...';
    } else {
      // Use content if provided, fall back to map for backward compatibility
      const contentOrMap = content ?? map;
      if (!contentOrMap) {
        throw new Error(
          'MapView requires either gameWorld, src, content, or map parameter'
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

    this.gameWorld = gameWorld;
    this.contentSource = actualContent;
    this.playerSource = player;
    this.fogOfWarSource = fogOfWar ?? false;
    this.exploredTilesSource = exploredTiles;
    this.fogCharacter = fogCharacter ?? ' ';

    // Subscribe to gameWorld player state and get legend if using GameWorld
    if (this.gameWorld) {
      this.gameWorld.getPlayerState().subscribe(() => {
        requestRender();
      });
      // Get legend from GameWorld for visibility checks
      this.legend = this.gameWorld.getLegend();
    }

    // Handle src loading after super() call
    if (isLoadingSrc && src) {
      this.src = src;
      this.isLoading = true;

      // Extract map name from src (handle both old path format and new asset name format)
      const mapName = this.extractMapName(this.src);

      // Start async loading using AssetManager
      AssetManager.getMap(mapName)
        .then((mapAsset) => {
          this.isLoading = false;
          this.loadError = undefined;
          this.updateContentFromAsset(mapAsset);
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

    // Update legend from GameWorld if available (handles async loading)
    if (this.gameWorld && this.gameWorld.isReady()) {
      this.legend = this.gameWorld.getLegend();
      // DEBUG: Log legend loading
      if (this.legend && this.legend['b']) {
        console.log('Legend loaded from GameWorld, bone entry:', this.legend['b']);
      }
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
          // Check legend visibility (defaults to true if not specified)
          let displayChar = char;
          if (this.legend && this.legend[char]) {
            const legendEntry = this.legend[char];
            // If visible is explicitly set to false, render as space
            if (legendEntry.visible === false) {
              displayChar = ' ';
            }
            // DEBUG: Log when we encounter a 'b' character
            if (char === 'b') {
              console.log('Found bone character:', {
                char,
                legendEntry,
                visible: legendEntry.visible,
                displayChar
              });
            }
          }

          // Apply fog of war logic
          if (this.fogOfWar) {
            const isVisible = this.isPositionVisible(
              mapX,
              mapY,
              player.x,
              player.y
            );
            const isExplored = this.isPositionExplored(mapX, mapY);

            if (isVisible || isExplored) {
              this.buffer[bufferY][bufferX] = displayChar;
            } else {
              this.buffer[bufferY][bufferX] = this.fogCharacter;
            }
          } else {
            this.buffer[bufferY][bufferX] = displayChar;
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
    // If using GameWorld, don't handle movement here (it's handled by GameWorld)
    if (this.gameWorld) {
      return false;
    }

    // Legacy mode: handle movement directly
    const current = this.player;

    switch (event) {
      case 'ArrowUp':
        // Move forward in current direction
        this.movePlayerInDirection(current.direction);
        break;
      case 'ArrowDown':
        // Move backward (opposite direction) while maintaining facing direction
        this.movePlayerBackward();
        break;
      case 'ArrowLeft':
        // Turn left
        this.turnPlayer('left');
        break;
      case 'ArrowRight':
        // Turn right
        this.turnPlayer('right');
        break;
      default:
        return false;
    }

    return true;
  }

  private movePlayerInDirection(direction: Direction): void {
    const { dx, dy } = this.getDirectionVector(direction);
    this.movePlayer(dx, dy);
  }

  private movePlayerBackward(): void {
    const current = this.player;
    const oppositeDirection = this.getOppositeDirection(current.direction);
    const { dx, dy } = this.getDirectionVector(oppositeDirection);
    // Move backward but keep facing the same direction
    const newX = current.x + dx;
    const newY = current.y + dy;
    this.movePlayerToPosition(newX, newY, current.direction);
  }

  private turnPlayer(turn: 'left' | 'right'): void {
    const current = this.player;
    const newDirection = this.getNewDirection(current.direction, turn);
    this.updatePosition(current.x, current.y, newDirection);
  }

  private getDirectionVector(direction: Direction): { dx: number; dy: number } {
    switch (direction) {
      case 'north':
        return { dx: 0, dy: -1 };
      case 'south':
        return { dx: 0, dy: 1 };
      case 'east':
        return { dx: 2, dy: 0 };
      case 'west':
        return { dx: -2, dy: 0 };
    }
  }

  private getOppositeDirection(direction: Direction): Direction {
    switch (direction) {
      case 'north':
        return 'south';
      case 'south':
        return 'north';
      case 'east':
        return 'west';
      case 'west':
        return 'east';
    }
  }

  private getNewDirection(
    current: Direction,
    turn: 'left' | 'right'
  ): Direction {
    const directions: Direction[] = ['north', 'east', 'south', 'west'];
    const currentIndex = directions.indexOf(current);
    const offset = turn === 'left' ? -1 : 1;
    const newIndex = (currentIndex + offset + 4) % 4;
    return directions[newIndex];
  }

  private movePlayerToPosition(
    newX: number,
    newY: number,
    direction: Direction
  ): void {
    const map = this.mapData;

    if (!map || !map.map || map.map.length === 0) return;

    const mapLines = map.map;
    const mapWidth = mapLines.length > 0 ? mapLines[0].length : 0;
    const mapHeight = mapLines.length;

    const clampedX = Math.max(0, Math.min(mapWidth - 1, newX));
    const clampedY = Math.max(0, Math.min(mapHeight - 1, newY));

    // Check for collision with walls along the path
    const isWall = (x: number, y: number) => {
      if (y < 0 || y >= mapLines.length || x < 0 || x >= mapLines[y].length)
        return true;
      const char = mapLines[y][x];
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

    const current = this.player;
    const dx = clampedX - current.x;
    const dy = clampedY - current.y;

    // Check intermediate positions - only for X movement (2 steps)
    if (Math.abs(dx) === 2) {
      const stepX = dx > 0 ? 1 : -1;
      const midX = current.x + stepX;
      const midY = current.y;
      if (isWall(midX, midY)) {
        return; // Can't move, stay in place
      }
    }

    // Check final destination
    if (isWall(clampedX, clampedY)) {
      return; // Can't move, stay in place
    }

    this.updatePosition(clampedX, clampedY, direction);
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
      ];
      return wallChars.includes(char);
    };

    // Check intermediate positions - only for X movement (2 steps)
    if (Math.abs(dx) === 2) {
      const stepX = dx > 0 ? 1 : -1;
      const midX = current.x + stepX;
      const midY = current.y;
      if (isWall(midX, midY)) {
        return; // Can't move, stay in place
      }
    }

    // Check final destination
    if (isWall(newX, newY)) {
      return; // Can't move, stay in place
    }

    // Determine direction based on movement for forward movement
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
        'MapView player is not a State object, cannot update player position'
      );
    }
  }

  private updateContent(newContent: string): void {
    // Update the content source with the loaded data
    this.contentSource = newContent;

    // Request a re-render
    requestRender();
  }

  private updateContentFromAsset(mapAsset: MapAsset): void {
    // Update the content source with the loaded map data
    this.contentSource = { map: mapAsset.mapData };

    // Store legend for visibility checks
    this.legend = mapAsset.legend;

    // Request a re-render
    requestRender();
  }

  private extractMapName(src: string): string {
    // Handle old path format: "./art/maps/example/map.txt" -> "example"
    if (src.includes('/maps/')) {
      const parts = src.split('/maps/');
      if (parts.length > 1) {
        const mapPart = parts[1];
        const mapName = mapPart.split('/')[0];
        return mapName;
      }
    }

    // Handle direct asset name: "example" -> "example"
    return src;
  }
}
