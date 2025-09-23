import { ScenerySprites, SceneryTheme, ScenerySpriteSet } from '../sprites/ScenerySprites';

export interface RaycastData {
  far: { left: boolean | null; center: boolean | null; right: boolean | null };
  middle: { left: boolean | null; center: boolean | null; right: boolean | null };
  near: { left: boolean | null; center: boolean | null; right: boolean | null };
}

export class FirstPersonCompositor {
  private scenerySprites: ScenerySpriteSet;

  constructor(sceneryTheme: SceneryTheme = 'brick') {
    this.scenerySprites = ScenerySprites[sceneryTheme];
  }

  // Change theme dynamically
  setSceneryTheme(theme: SceneryTheme): void {
    this.scenerySprites = ScenerySprites[theme];
  }

  // Main composition method
  compose(
    raycast: RaycastData,
    viewWidth: number,
    viewHeight: number
  ): string[][] {
    // Create empty buffer
    const buffer: string[][] = Array(viewHeight)
      .fill(null)
      .map(() => Array(viewWidth).fill(' '));

    // Render in proper stacking order: near-left, mid-left, far-left, center, far-right, mid-right, near-right
    const renderOrder = [
      { layer: 'near' as const, position: 'left' as const },
      { layer: 'middle' as const, position: 'left' as const },
      { layer: 'far' as const, position: 'left' as const },
      { layer: 'far' as const, position: 'center' as const },
      { layer: 'middle' as const, position: 'center' as const },
      { layer: 'near' as const, position: 'center' as const },
      { layer: 'far' as const, position: 'right' as const },
      { layer: 'middle' as const, position: 'right' as const },
      { layer: 'near' as const, position: 'right' as const },
    ];

    for (const { layer, position } of renderOrder) {
      const rayResult = raycast[layer][position];

      // Skip rendering if position is occluded (null)
      if (rayResult === null) {
        continue;
      }

      const isWall = rayResult;

      // Skip rendering center passages - they should be transparent
      if (!isWall && position === 'center') {
        continue;
      }

      // Select appropriate sprite from theme
      const sprite = isWall
        ? this.scenerySprites.walls[layer][position]
        : this.scenerySprites.passages[layer][position];

      // Calculate sprite position based on layer and position
      const spritePos = this.calculateSpritePosition(
        layer,
        position,
        sprite,
        viewHeight
      );

      // Render sprite to buffer with proper width allocation
      this.renderSprite(
        buffer,
        sprite,
        spritePos.x,
        spritePos.y,
        spritePos.width,
        viewWidth,
        viewHeight
      );
    }

    return buffer;
  }

  private calculateSpritePosition(
    layer: 'far' | 'middle' | 'near',
    position: 'left' | 'center' | 'right',
    sprite: string[],
    viewHeight: number
  ): { x: number; y: number; width: number } {
    let x = 0;
    let width = 0;

    // Flattened positioning lookup - sprites nest within each other
    // All lefts first
    if (layer === 'near' && position === 'left') {
      x = 0;
      width = 7;
    } else if (layer === 'middle' && position === 'left') {
      x = 7;  // Inside near-left area (0-6)
      width = 3;
    } else if (layer === 'far' && position === 'left') {
      x = 10;  // Inside near-left area (0-6)
      width = 2;
    // All rights
    } else if (layer === 'near' && position === 'right') {
      x = 19;
      width = 7;
    } else if (layer === 'middle' && position === 'right') {
      x = 16;
      width = 3;
    } else if (layer === 'far' && position === 'right') {
      x = 14;
      width = 2;
    // All centers
    } else if (layer === 'near' && position === 'center') {
      x = 7;
      width = 12;
    } else if (layer === 'middle' && position === 'center') {
      x = 10;
      width = 6;
    } else if (layer === 'far' && position === 'center') {
      x = 12;
      width = 2;
    }

    // Center sprite vertically in the available height
    const spriteHeight = sprite.length;
    const y = Math.floor((viewHeight - spriteHeight) / 2);

    return { x, y, width };
  }

  private renderSprite(
    buffer: string[][],
    sprite: string[],
    startX: number,
    startY: number,
    allocatedWidth: number,
    viewWidth: number,
    viewHeight: number
  ): void {
    for (let y = 0; y < sprite.length; y++) {
      const bufferY = startY + y;
      if (bufferY >= viewHeight || bufferY < 0) continue;

      const line = sprite[y] || '';

      // Render the sprite line, padding to center within allocated width
      for (let x = 0; x < allocatedWidth; x++) {
        const bufferX = startX + x;
        if (bufferX >= viewWidth || bufferX < 0) continue;

        let char = ' '; // Default to space (padding)

        if (x < line.length) {
          char = line[x];
        }

        // Always render to fill the allocated width (including spaces for padding)
        buffer[bufferY][bufferX] = char;
      }
    }
  }

  // Helper method to get available theme names
  static getAvailableSceneryThemes(): SceneryTheme[] {
    return Object.keys(ScenerySprites) as SceneryTheme[];
  }
}