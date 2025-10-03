import { AssetManager, type MaterialAsset } from '../core/AssetManager';

export interface RaycastData {
  here: { left: boolean | null; center: boolean | null; right: boolean | null };
  near: { left: boolean | null; center: boolean | null; right: boolean | null };
  middle: { left: boolean | null; center: boolean | null; right: boolean | null };
  far: { left: boolean | null; center: boolean | null; right: boolean | null };
}

interface SceneSprite {
  layer: 'here' | 'near' | 'middle' | 'far';
  position: 'left' | 'center' | 'right';
  x?: number; // Optional x coordinate from metadata
  lines: string[];
}

type Scene = string;

// Default sprite positions extracted from wireframe.txt
const DEFAULT_SPRITE_POSITIONS: Record<string, number> = {
  'here-left': -1,
  'here-right': 19,
  'near-center': 6,
  'near-left': -1,
  'near-right': 16,
  'middle-center': 9,
  'middle-left': -1,
  'middle-right': 14,
  'far-left': 6,
  'far-center': 11,
  'far-right': 14,
};

export class FirstPersonCompositor {
  private sceneSprites: Map<string, SceneSprite> = new Map();
  private currentScene: Scene = 'wireframe';
  private isLoaded = false;

  constructor(scene: Scene = 'wireframe') {
    this.currentScene = scene;
    this.loadSceneData();
  }

  // Change scene dynamically
  async setScene(scene: Scene): Promise<void> {
    this.currentScene = scene;
    await this.loadSceneData();
  }

  private async loadSceneData(): Promise<void> {
    try {
      // Load material data using AssetManager
      const materialAsset = await AssetManager.getMaterial(this.currentScene);
      this.loadFromMaterialAsset(materialAsset);
      this.isLoaded = true;
    } catch (error) {
      console.error('Failed to load material data:', error);
      this.isLoaded = false;
    }
  }

  private loadFromMaterialAsset(materialAsset: MaterialAsset): void {
    this.sceneSprites.clear();

    // Convert MaterialAsset layers to SceneSprite format
    for (const layer of materialAsset.layers) {
      const key = `${layer.layer}-${layer.position}`;

      this.sceneSprites.set(key, {
        layer: layer.layer,
        position: layer.position,
        x: layer.x,
        lines: layer.lines
      });
    }
  }

  private getSpriteKey(layer: string, position: string): string {
    return `${layer}-${position}`;
  }

  // Main composition method
  compose(
    raycast: RaycastData,
    viewWidth: number,
    viewHeight: number,
    transparency: boolean = false
  ): string[][] {
    // Create empty buffer
    const buffer: string[][] = Array(viewHeight)
      .fill(null)
      .map(() => Array(viewWidth).fill(' '));

    if (!this.isLoaded) {
      // Return empty buffer if scene data not loaded
      return buffer;
    }

    // Render in back-to-front order: far -> middle -> near -> here
    // Within each layer: left -> right -> center (so center overlays left/right)
    const renderOrder = [
      { layer: 'far' as const, position: 'left' as const },
      { layer: 'far' as const, position: 'right' as const },
      { layer: 'far' as const, position: 'center' as const },
      { layer: 'middle' as const, position: 'left' as const },
      { layer: 'middle' as const, position: 'right' as const },
      { layer: 'middle' as const, position: 'center' as const },
      { layer: 'near' as const, position: 'left' as const },
      { layer: 'near' as const, position: 'right' as const },
      { layer: 'near' as const, position: 'center' as const },
      { layer: 'here' as const, position: 'left' as const },
      { layer: 'here' as const, position: 'right' as const },
      { layer: 'here' as const, position: 'center' as const },
    ];

    for (const { layer, position } of renderOrder) {
      const rayResult = raycast[layer][position];

      // Skip rendering if position is occluded (null)
      if (rayResult === null) {
        continue;
      }

      const isWall = rayResult;

      // For passages, don't paint anything (skip)
      if (!isWall) {
        continue;
      }

      // For walls, paint the scenery sprite
      const spriteKey = this.getSpriteKey(layer, position);
      const sprite = this.sceneSprites.get(spriteKey);

      if (!sprite) {
        continue; // No sprite defined for this layer/position
      }

      // Calculate sprite position based on position and metadata
      const spritePos = this.calculateSpritePosition(
        layer,
        position,
        sprite.lines,
        sprite.x,
        viewWidth,
        viewHeight
      );

      // Render sprite to buffer
      this.renderSprite(
        buffer,
        sprite.lines,
        spritePos.x,
        spritePos.y,
        viewWidth,
        viewHeight,
        transparency
      );
    }

    return buffer;
  }

  private calculateSpritePosition(
    layer: 'here' | 'near' | 'middle' | 'far',
    position: 'left' | 'center' | 'right',
    sprite: string[],
    metadataX: number | undefined,
    viewWidth: number,
    viewHeight: number
  ): { x: number; y: number } {
    const spriteHeight = sprite.length;
    const y = Math.floor((viewHeight - spriteHeight) / 2);

    let x: number;

    // Use metadata x coordinate if provided
    if (metadataX !== undefined) {
      x = metadataX;
    } else {
      // First try to use default wireframe positions
      const defaultKey = `${layer}-${position}`;
      const defaultX = DEFAULT_SPRITE_POSITIONS[defaultKey];

      if (defaultX !== undefined) {
        x = defaultX;
      } else {
        // Final fallback to position-based calculation
        const spriteWidth = Math.max(...sprite.map(line => line.length));

        if (position === 'left') {
          x = 0;
        } else if (position === 'right') {
          x = viewWidth - spriteWidth;
        } else { // center
          x = Math.floor((viewWidth - spriteWidth) / 2);
        }
      }
    }

    return { x, y };
  }

  private renderSprite(
    buffer: string[][],
    sprite: string[],
    startX: number,
    startY: number,
    viewWidth: number,
    viewHeight: number,
    transparency: boolean = false
  ): void {
    for (let y = 0; y < sprite.length; y++) {
      const bufferY = startY + y;
      if (bufferY >= viewHeight || bufferY < 0) continue;

      const line = sprite[y] || '';

      for (let x = 0; x < line.length; x++) {
        const bufferX = startX + x;
        if (bufferX >= viewWidth || bufferX < 0) continue;

        const char = line[x];
        // In transparency mode, don't overwrite existing content with spaces
        if (transparency && char === ' ') {
          continue; // Skip rendering spaces in transparency mode
        }
        // Render all characters including spaces to properly overwrite farther sprites
        buffer[bufferY][bufferX] = char;
      }
    }
  }

  // Helper method to get available scene names by scanning scene files
  static async getAvailableScenes(): Promise<Scene[]> {
    try {
      // In browser environment, we can't scan directories, so return known scenes
      if (typeof window !== 'undefined') {
        return ['wireframe', 'brick'];
      }

      // In Node.js environment, scan the scenes directory
      const fs = await import('fs/promises');
      const path = await import('path');

      const scenesDir = path.join(process.cwd(), 'packages/asciitorium/public/art/scenes');
      const files = await fs.readdir(scenesDir);

      return files
        .filter(file => file.endsWith('.txt'))
        .map(file => file.replace('.txt', ''))
        .sort();
    } catch (error) {
      console.warn('Could not scan scenes, falling back to defaults:', error);
      return ['wireframe', 'brick'];
    }
  }
}