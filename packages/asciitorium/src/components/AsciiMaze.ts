import { Component, ComponentProps } from '../core/Component';
import type { State } from '../core/State';
import { isState } from '../core/environment';

export type Direction = 'north' | 'south' | 'east' | 'west';

export interface Position {
  x: number;
  y: number;
  direction: Direction;
}

export interface MapData {
  map: string[];
}

export interface AsciiMazeOptions extends Omit<ComponentProps, 'children'> {
  content?: MapData | string[] | string | State<MapData> | State<string[]> | State<string>;
  map?: MapData | string[] | string | State<MapData> | State<string[]> | State<string>; // deprecated, use content
  position: Position | State<Position>;
  fogOfWar?: boolean;
  exploredTiles?: Set<string> | State<Set<string>>;
  fogCharacter?: string;
}

export class AsciiMaze extends Component {
  private contentSource: MapData | string[] | string | State<MapData> | State<string[]> | State<string>;
  private positionSource: Position | State<Position>;
  private fogOfWar: boolean;
  private exploredTilesSource?: Set<string> | State<Set<string>>;
  private fogCharacter: string;

  constructor(options: AsciiMazeOptions) {
    const { content, map, position, fogOfWar, exploredTiles, fogCharacter, ...componentProps } = options;
    
    // Use content if provided, fall back to map for backward compatibility
    const actualContent = content ?? map;
    if (!actualContent) {
      throw new Error('AsciiMaze requires either content or map parameter');
    }

    // Default dimensions if not specified
    const defaultHeight = 10;

    super({
      ...componentProps,
      width: options.width ?? "fill",
      height: options.height ?? "fill",
    });

    this.contentSource = actualContent;
    this.positionSource = position;
    this.fogOfWar = fogOfWar ?? false;
    this.exploredTilesSource = exploredTiles;
    this.fogCharacter = fogCharacter ?? ' ';
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

  get position(): Position {
    return isState(this.positionSource)
      ? (this.positionSource as State<Position>).value
      : (this.positionSource as Position);
  }

  get exploredTiles(): Set<string> {
    if (!this.exploredTilesSource) {
      return new Set<string>();
    }
    return isState(this.exploredTilesSource)
      ? (this.exploredTilesSource as State<Set<string>>).value
      : (this.exploredTilesSource as Set<string>);
  }

  private isPositionVisible(x: number, y: number, playerX: number, playerY: number): boolean {
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
        const currentSet = (this.exploredTilesSource as State<Set<string>>).value;
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

  private getVisiblePositions(playerX: number, playerY: number): { x: number; y: number }[] {
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
    const pos = this.position;
    
    if (!map || !map.map || !pos) {
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
      const visiblePositions = this.getVisiblePositions(pos.x, pos.y);
      for (const visPos of visiblePositions) {
        if (visPos.x >= 0 && visPos.x < mapWidth && visPos.y >= 0 && visPos.y < mapHeight) {
          this.addExploredPosition(visPos.x, visPos.y);
        }
      }
    }

    // Calculate the starting position in the map based on player position
    const startMapY = Math.max(0, pos.y - centerY);
    const endMapY = Math.min(mapHeight, startMapY + innerHeight);
    
    const startMapX = Math.max(0, pos.x - centerX);
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
        if (mapX === pos.x && mapY === pos.y) {
          // Draw player based on direction
          const directionChar = this.getDirectionChar(pos.direction);
          this.buffer[bufferY][bufferX] = directionChar;
        } else {
          // Apply fog of war logic
          if (this.fogOfWar) {
            const isVisible = this.isPositionVisible(mapX, mapY, pos.x, pos.y);
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

    return this.buffer;
  }

  private getDirectionChar(direction: Direction): string {
    switch (direction) {
      case 'north': return '↑';
      case 'south': return '↓';
      case 'east': return '→';
      case 'west': return '←';
      default: return '@';
    }
  }
}