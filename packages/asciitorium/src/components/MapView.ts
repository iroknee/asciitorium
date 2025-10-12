import { Component, ComponentProps } from '../core/Component';
import type { State } from '../core/State';
import { isState } from '../core/environment';
import { requestRender } from '../core/RenderScheduler';
import {
  AssetManager,
  type MapAsset,
  type LegendEntry,
} from '../core/AssetManager';

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
  mapAsset: State<MapAsset | null>;
  player: State<Player>;
  fogOfWar?: boolean | State<boolean>;
  exploredTiles?: Set<string> | State<Set<string>>;
  fogCharacter?: string;
}

export class MapView extends Component {
  focusable = true;
  private mapAssetState: State<MapAsset | null>;
  private playerState: State<Player>;
  private fogOfWarSource: boolean | State<boolean>;
  private exploredTilesSource?: Set<string> | State<Set<string>>;
  private fogCharacter: string;

  constructor(options: MapViewOptions) {
    const {
      mapAsset,
      player,
      fogOfWar,
      exploredTiles,
      fogCharacter,
      style,
      ...componentProps
    } = options;

    super({
      ...componentProps,
      width: options.width ?? options.style?.width ?? 'fill',
      height: options.height ?? options.style?.height ?? 'fill',
      border: options.border ?? options.style?.border ?? true,
    });

    this.mapAssetState = mapAsset;
    this.playerState = player;
    this.fogOfWarSource = fogOfWar ?? false;
    this.exploredTilesSource = exploredTiles;
    this.fogCharacter = fogCharacter ?? ' ';

    // Subscribe to player state changes
    this.playerState.subscribe(() => {
      requestRender();
    });

    // Subscribe to map state changes (for initial load and hot-reload)
    this.mapAssetState.subscribe(() => {
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

    const mapData = this.mapData;
    const player = this.player;
    const legend = this.legend;

    if (!mapData || mapData.length === 0) {
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
    const mapHeight = mapData.length;
    const mapWidth = mapHeight > 0 ? mapData[0].length : 0;

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
      const line = mapData[mapY];
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
          if (legend && legend[char]) {
            const legendEntry = legend[char];
            // If visible is explicitly set to false, render as space
            if (legendEntry.visible === false) {
              displayChar = ' ';
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
    // MapView is display-only, movement handled by GridMovement
    return false;
  }
}
