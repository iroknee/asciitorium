import {
  AssetManager,
  type MaterialAsset,
  type LegendEntry,
} from '../core/AssetManager';

export interface RaycastData {
  here: { left: string | null; center: string | null; right: string | null };
  near: { left: string | null; center: string | null; right: string | null };
  middle: { left: string | null; center: string | null; right: string | null };
  far: { left: string | null; center: string | null; right: string | null };
}

interface SceneSprite {
  layer: 'here' | 'near' | 'middle' | 'far';
  position: 'left' | 'center' | 'right';
  x?: number; // Optional x coordinate from metadata
  lines: string[];
}

type Scene = string;

// Default sprite positions extracted from wireframe.art
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
  constructor() {
    // No longer needs a scene parameter or local cache
  }

  private getSpriteKey(layer: string, position: string): string {
    return `${layer}-${position}`;
  }

  // Load a material asset by name using AssetManager's State cache
  private async loadMaterial(assetName: string): Promise<MaterialAsset | null> {
    try {
      // Extract material name from asset path (e.g., "material/brick-wall" -> "brick-wall")
      const materialName = assetName.replace(/^material\//, '');

      // Get material from AssetManager (cached automatically, returns Promise)
      return AssetManager.getMaterial(materialName);
    } catch (error) {
      console.error(`Failed to load material "${assetName}":`, error);
      return null;
    }
  }

  // Main composition method
  async compose(
    raycast: RaycastData,
    legend: Record<string, LegendEntry>,
    viewWidth: number,
    viewHeight: number,
    transparency: boolean = false
  ): Promise<string[][]> {
    // Create empty buffer
    const buffer: string[][] = Array(viewHeight)
      .fill(null)
      .map(() => Array(viewWidth).fill(' '));

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
      const mapChar = raycast[layer][position];

      // Skip rendering if position is occluded (null) or empty
      if (mapChar === null || mapChar === ' ') {
        continue;
      }

      // Look up the legend entry for this character
      const legendEntry = legend[mapChar];
      if (!legendEntry) {
        continue; // No legend entry for this character
      }

      // Only render materials (sprites are for 2D Art component, not 3D first-person view)
      if (legendEntry.kind !== 'material') {
        continue;
      }

      // Load the material asset
      const materialAsset = await this.loadMaterial(legendEntry.asset);
      if (!materialAsset) {
        continue; // Failed to load material
      }

      // Find the sprite for this layer/position in the material
      const spriteKey = this.getSpriteKey(layer, position);
      const sprite = materialAsset.layers.find(
        (l) => l.layer === layer && l.position === position
      );

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
        viewHeight,
        materialAsset.placement
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
    viewHeight: number,
    placement?: 'ground' | 'ceiling'
  ): { x: number; y: number } {
    const spriteHeight = sprite.length;
    const spriteWidth = Math.max(...sprite.map((line) => line.length));

    let x: number;
    let y: number;

    // Handle placement-based positioning
    if (placement === 'ground') {
      // Ground items are always centered horizontally
      x = Math.floor((viewWidth - spriteWidth) / 2);

      // Ground items anchor their bottom to layer-specific ground heights
      const groundLevelOffsets = {
        here: 1,
        near: 7,
        middle: 10,
        far: 11,
      };
      const groundOffset = groundLevelOffsets[layer];
      y = viewHeight - groundOffset - spriteHeight;
    } else {
      // Standard positioning: vertically centered
      y = Math.floor((viewHeight - spriteHeight) / 2);

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
          if (position === 'left') {
            x = 0;
          } else if (position === 'right') {
            x = viewWidth - spriteWidth;
          } else {
            // center
            x = Math.floor((viewWidth - spriteWidth) / 2);
          }
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

        // Skip transparent characters (‽) - always transparent regardless of mode
        if (char === '‽') {
          continue;
        }

        // In transparency mode, don't overwrite existing content with spaces
        if (transparency && char === ' ') {
          continue; // Skip rendering spaces in transparency mode
        }

        // Render all other characters to properly overwrite farther sprites
        buffer[bufferY][bufferX] = char;
      }
    }
  }
}
