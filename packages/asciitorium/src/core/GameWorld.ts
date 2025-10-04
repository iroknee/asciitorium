import { AssetManager, type MapAsset, type LegendEntry } from './AssetManager';
import { State } from './State';
import type { Direction, Player } from '../components/MapView';

export interface GameWorldOptions {
  mapName: string;
  initialPosition?: {
    x: number;
    y: number;
    direction: Direction;
  };
}

export class GameWorld {
  private mapData: string[] = [];
  private legend: Record<string, LegendEntry> = {};
  private playerState: State<Player>;
  private isLoadedFlag: boolean = false;

  constructor(options: GameWorldOptions) {
    // Initialize player state with default or provided position
    const initialPos = options.initialPosition ?? {
      x: 0,
      y: 0,
      direction: 'north' as Direction,
    };

    this.playerState = new State<Player>(initialPos);

    // Start async initialization
    this.initialize(options.mapName).catch((error) => {
      console.error('Failed to initialize GameWorld:', error);
    });
  }

  private async initialize(mapName: string): Promise<void> {
    try {
      const mapAsset: MapAsset = await AssetManager.getMap(mapName);

      this.mapData = mapAsset.mapData;
      this.legend = mapAsset.legend;
      this.isLoadedFlag = true;
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Unknown error';
      throw new Error(`Failed to load map "${mapName}": ${message}`);
    }
  }

  // Read-only access methods
  getPlayerState(): State<Player> {
    return this.playerState;
  }

  getPlayer(): Player {
    return this.playerState.value;
  }

  getMapData(): string[] {
    return this.mapData;
  }

  getLegend(): Record<string, LegendEntry> {
    return this.legend;
  }

  isReady(): boolean {
    return this.isLoadedFlag;
  }

  // Legend interpretation methods
  getLegendEntry(char: string): LegendEntry | undefined {
    return this.legend[char];
  }

  getCharAt(x: number, y: number): string | undefined {
    if (y < 0 || y >= this.mapData.length) return undefined;
    if (x < 0 || x >= this.mapData[y].length) return undefined;
    return this.mapData[y][x];
  }

  isSolidChar(char: string): boolean {
    const entry = this.legend[char];
    return entry?.solid ?? false;
  }

  isSolid(x: number, y: number): boolean {
    const char = this.getCharAt(x, y);
    if (char === undefined) return true; // Out of bounds = solid
    return this.isSolidChar(char);
  }

  // Movement methods
  moveForward(): boolean {
    const player = this.getPlayer();
    const { dx, dy } = this.getDirectionVector(player.direction);
    return this.movePlayerBy(dx, dy, player.direction);
  }

  moveBackward(): boolean {
    const player = this.getPlayer();
    const oppositeDir = this.getOppositeDirection(player.direction);
    const { dx, dy } = this.getDirectionVector(oppositeDir);
    // Move backward but keep facing the same direction
    return this.movePlayerBy(dx, dy, player.direction);
  }

  turnLeft(): void {
    const player = this.getPlayer();
    const newDirection = this.getNewDirection(player.direction, 'left');
    this.playerState.value = {
      ...player,
      direction: newDirection,
    };
  }

  turnRight(): void {
    const player = this.getPlayer();
    const newDirection = this.getNewDirection(player.direction, 'right');
    this.playerState.value = {
      ...player,
      direction: newDirection,
    };
  }

  // Private helper methods
  private getDirectionVector(direction: Direction): { dx: number; dy: number } {
    switch (direction) {
      case 'north':
        return { dx: 0, dy: -1 };
      case 'south':
        return { dx: 0, dy: 1 };
      case 'east':
        return { dx: 2, dy: 0 }; // 2 units for east/west to match map aspect ratio
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

  private movePlayerBy(
    dx: number,
    dy: number,
    direction: Direction
  ): boolean {
    const player = this.getPlayer();
    const mapHeight = this.mapData.length;
    const mapWidth = mapHeight > 0 ? this.mapData[0].length : 0;

    if (mapWidth === 0 || mapHeight === 0) return false;

    const newX = Math.max(0, Math.min(mapWidth - 1, player.x + dx));
    const newY = Math.max(0, Math.min(mapHeight - 1, player.y + dy));

    // Check intermediate positions for horizontal movement (2 steps)
    if (Math.abs(dx) === 2) {
      const stepX = dx > 0 ? 1 : -1;
      const midX = player.x + stepX;
      if (this.isSolid(midX, player.y)) {
        return false; // Blocked
      }
    }

    // Check final destination
    if (this.isSolid(newX, newY)) {
      return false; // Blocked
    }

    // Move successful
    this.playerState.value = {
      x: newX,
      y: newY,
      direction,
    };

    return true;
  }
}
