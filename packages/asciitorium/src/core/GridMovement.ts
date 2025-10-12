import { AssetManager, type MapAsset, type LegendEntry, type MaterialAsset } from './AssetManager';
import { State } from './State';
import type { Direction, Player } from '../components/MapView';
import { SoundManager } from './SoundManager';

export interface GridMovementOptions {
  mapAsset: State<MapAsset | null>;
  player: State<Player>;
}

export class GridMovement {
  private mapState: State<MapAsset | null>;
  private playerState: State<Player>;
  private previousPosition: { x: number; y: number } | null = null;

  constructor(options: GridMovementOptions) {
    // Use the provided map asset and player state
    this.mapState = options.mapAsset;
    this.playerState = options.player;
    this.previousPosition = { x: options.player.value.x, y: options.player.value.y };
  }

  // Read-only access methods
  getPlayerState(): State<Player> {
    return this.playerState;
  }

  getPlayer(): Player {
    return this.playerState.value;
  }

  getMapState(): State<MapAsset | null> {
    return this.mapState;
  }

  getMapData(): string[] {
    return this.mapState.value?.mapData ?? [];
  }

  getLegend(): Record<string, LegendEntry> {
    return this.mapState.value?.legend ?? {};
  }

  isReady(): boolean {
    return this.mapState.value !== null;
  }

  // Legend interpretation methods
  getLegendEntry(char: string): LegendEntry | undefined {
    return this.getLegend()[char];
  }

  getCharAt(x: number, y: number): string | undefined {
    const mapData = this.getMapData();
    if (y < 0 || y >= mapData.length) return undefined;
    if (x < 0 || x >= mapData[y].length) return undefined;
    return mapData[y][x];
  }

  isSolidChar(char: string): boolean {
    const entry = this.getLegend()[char];
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
    const mapData = this.getMapData();
    const mapHeight = mapData.length;
    const mapWidth = mapHeight > 0 ? mapData[0].length : 0;

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

    // Trigger onExit sound for the old tile before moving
    if (this.previousPosition) {
      this.checkAndPlayExitSound(this.previousPosition.x, this.previousPosition.y);
    }

    // Move successful
    this.playerState.value = {
      x: newX,
      y: newY,
      direction,
    };

    // Update previous position
    this.previousPosition = { x: newX, y: newY };

    // Trigger onEnter sound for the new tile
    this.checkAndPlayTileSound(newX, newY);

    return true;
  }

  private async checkAndPlayTileSound(x: number, y: number): Promise<void> {
    const char = this.getCharAt(x, y);
    if (!char) return;

    const legendEntry = this.getLegendEntry(char);
    if (!legendEntry || legendEntry.kind !== 'material') return;

    try {
      // Load the material asset to check for sound metadata
      const materialAsset: MaterialAsset = await AssetManager.getMaterial(
        legendEntry.asset.replace('material/', '')
      );

      // Check for onEnterSound in the material asset
      if (materialAsset.onEnterSound) {
        SoundManager.playSound(materialAsset.onEnterSound);
      }
    } catch (error) {
      // Silently ignore errors loading materials or playing sounds
      console.debug('Could not check tile sound:', error);
    }
  }

  private async checkAndPlayExitSound(x: number, y: number): Promise<void> {
    const char = this.getCharAt(x, y);
    if (!char) return;

    const legendEntry = this.getLegendEntry(char);
    if (!legendEntry || legendEntry.kind !== 'material') return;

    try {
      // Load the material asset to check for sound metadata
      const materialAsset: MaterialAsset = await AssetManager.getMaterial(
        legendEntry.asset.replace('material/', '')
      );

      // Check for onExitSound in the material asset
      if (materialAsset.onExitSound) {
        SoundManager.playSound(materialAsset.onExitSound);
      }
    } catch (error) {
      // Silently ignore errors loading materials or playing sounds
      console.debug('Could not check exit sound:', error);
    }
  }
}
