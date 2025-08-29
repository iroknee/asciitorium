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
  title: string;
  map: string[];
  objects: Record<string, {
    object: string;
    text?: string;
  }>;
}

export interface MapViewOptions extends Omit<ComponentProps, 'children'> {
  map: MapData | State<MapData>;
  position: Position | State<Position>;
}

export class MapView extends Component {
  private mapSource: MapData | State<MapData>;
  private positionSource: Position | State<Position>;

  constructor(options: MapViewOptions) {
    const { map, position, ...componentProps } = options;

    // Default dimensions if not specified
    const defaultWidth = 20;
    const defaultHeight = 10;

    super({
      ...componentProps,
      width: options.width ?? defaultWidth,
      height: options.height ?? defaultHeight,
    });

    this.mapSource = map;
    this.positionSource = position;
  }

  get mapData(): MapData {
    return isState(this.mapSource)
      ? (this.mapSource as State<MapData>).value
      : this.mapSource;
  }

  get position(): Position {
    return isState(this.positionSource)
      ? (this.positionSource as State<Position>).value
      : this.positionSource;
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
          this.buffer[bufferY][bufferX] = char;
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