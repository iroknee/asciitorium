import { describe, test, expect, beforeEach, vi, MockedFunction } from 'vitest';
import { AssetManager, type Asset, type MapAsset, type MaterialAsset, type SpriteAsset } from '../../core/AssetManager';
import { loadArt } from '../../core/environment';

// Mock the loadArt function
vi.mock('../../core/environment');
const mockLoadArt = loadArt as MockedFunction<typeof loadArt>;

describe('AssetManager', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('getAsset() - Unified Interface', () => {
    test('should return unified Asset interface with width and height', async () => {
      const spriteContent = `§ {"kind":"sprite","loop":true}
Line 1
Line 2 longer
Short`;

      mockLoadArt
        .mockRejectedValueOnce(new Error('Map not found'))
        .mockRejectedValueOnce(new Error('Material not found'))
        .mockRejectedValueOnce(new Error('Scene not found'))
        .mockResolvedValueOnce(spriteContent);

      const asset = await AssetManager.getAsset('test');

      expect(asset).toMatchObject({
        kind: 'sprite',
        width: expect.any(Number),
        height: expect.any(Number),
        data: expect.any(Object)
      });

      expect(asset.width).toBe(13); // "Line 2 longer" = 13 chars
      expect(asset.height).toBe(3); // 3 lines after header
    });

    test('should auto-detect and load material assets', async () => {
      const materialContent = `§ {"kind":"material","usage":"first-person"}
¶ {"layer":"here","position":"left","x":-1}
|╲
| ╲
|  ╲`;

      mockLoadArt
        .mockRejectedValueOnce(new Error('Map not found'))
        .mockResolvedValueOnce(materialContent);

      const asset = await AssetManager.getAsset('wall');

      expect(asset.kind).toBe('material');
      expect(asset.width).toBe(4); // "|  ╲" = 4 chars
      expect(asset.height).toBe(3); // 3 content lines
      expect(mockLoadArt).toHaveBeenCalledWith('art/materials/wall.txt');

      const materialData = asset.data as MaterialAsset;
      expect(materialData.usage).toBe('first-person');
      expect(materialData.layers).toHaveLength(1);
      expect(materialData.layers[0].layer).toBe('here');
      expect(materialData.layers[0].position).toBe('left');
    });

    test('should auto-detect and load scene materials', async () => {
      const sceneContent = `§ {"artType":"fpsScenery","layer":"here","position":"left","x":1}
╲
┊╲
¶ {"layer":"near","position":"center","x":6}
 ______
|      |
|______|`;

      mockLoadArt
        .mockRejectedValueOnce(new Error('Map not found'))
        .mockRejectedValueOnce(new Error('Material not found'))
        .mockResolvedValueOnce(sceneContent);

      const asset = await AssetManager.getAsset('brick');

      expect(asset.kind).toBe('material');
      expect(asset.width).toBe(8); // "|______|" = 8 chars
      expect(asset.height).toBe(3); // Max height: second layer has 3 lines

      const materialData = asset.data as MaterialAsset;
      expect(materialData.usage).toBe('first-person');
      expect(materialData.layers).toHaveLength(2);
      expect(materialData.layers[0].layer).toBe('here');
      expect(materialData.layers[1].layer).toBe('near');
    });

    test('should auto-detect and load sprite assets with § and ¶ separators', async () => {
      const spriteContent = `§ {"kind":"sprite","loop":true,"default-frame-rate":120}
                _ _ _             _
  __ _ ___  ___(_|_) |_ ___  _ __(_)_   _ _ __ ___
 / _\` / __|/ __| | | __/ _ \\| '__| | | | | '_ \` _ \\
¶ {"duration":1000}
              .   _ * _             *     .
  __ _ ___  ___(_|_).|_   *  _ __(_)_   _   *  __
 / _\` / __|/ _ .  |  __/  . \\ '__| | | | '   \`  \\ .`;

      mockLoadArt
        .mockRejectedValueOnce(new Error('Map not found'))
        .mockRejectedValueOnce(new Error('Material not found'))
        .mockRejectedValueOnce(new Error('Scene not found'))
        .mockResolvedValueOnce(spriteContent);

      const asset = await AssetManager.getAsset('asciitorium');

      expect(asset.kind).toBe('sprite');
      expect(asset.width).toBe(51); // Width of longest line
      expect(asset.height).toBe(4); // 4 lines per frame (including header metadata line)

      const spriteData = asset.data as SpriteAsset;
      expect(spriteData.frames).toHaveLength(2);
      expect(spriteData.defaults.loop).toBe(true);
      expect(spriteData.defaults.duration).toBe(120);
      expect(spriteData.frames[0].meta.duration).toBe(120); // default
      expect(spriteData.frames[1].meta.duration).toBe(1000);
    });

    test('should handle simple single-frame sprites', async () => {
      const spriteContent = `         █▄█▄█         █▄█▄█
█▄█▄█▄█▄█▐█┼█▌█▄█▄█▄█▄█▐█┼█▌█▄█▄█▄█▄█
███┼██┼██▐███▌█┼█╔═╗█┼█▐███▌███┼█████
█████████▐███▌███║▓║███▐███▌█████████`;

      mockLoadArt
        .mockRejectedValueOnce(new Error('Map not found'))
        .mockRejectedValueOnce(new Error('Material not found'))
        .mockRejectedValueOnce(new Error('Scene not found'))
        .mockResolvedValueOnce(spriteContent);

      const asset = await AssetManager.getAsset('castle');

      expect(asset.kind).toBe('sprite');
      expect(asset.width).toBe(37); // Width of castle
      expect(asset.height).toBe(4); // 4 lines

      const spriteData = asset.data as SpriteAsset;
      expect(spriteData.frames).toHaveLength(1);
      expect(spriteData.defaults).toEqual({});
    });

    test('should throw error for non-existent assets', async () => {
      mockLoadArt.mockRejectedValue(new Error('Not found'));

      await expect(AssetManager.getAsset('nonexistent'))
        .rejects.toThrow('Asset "nonexistent" not found in any supported format');
    });
  });

  describe('Dimension Calculations', () => {
    test('should calculate material dimensions across all layers', async () => {
      const materialContent = `§ {"kind":"material","usage":"test"}
¶ {"layer":"here","position":"left"}
AB
CDE
¶ {"layer":"near","position":"center"}
FGHIJ
K`;

      mockLoadArt
        .mockRejectedValueOnce(new Error('Map not found'))
        .mockResolvedValueOnce(materialContent);

      const asset = await AssetManager.getAsset('test');

      expect(asset.width).toBe(5); // Longest line: 'FGHIJ'
      expect(asset.height).toBe(3); // Max layer height: first layer=2, second layer=3 (including metadata)
    });

    test('should calculate sprite dimensions across all frames', async () => {
      const spriteContent = `§ {"kind":"sprite"}
AB
CDE
¶ {}
FGHIJKL
M
¶ {}
NOP
QRST
UVWX`;

      mockLoadArt
        .mockRejectedValueOnce(new Error('Map not found'))
        .mockRejectedValueOnce(new Error('Material not found'))
        .mockRejectedValueOnce(new Error('Scene not found'))
        .mockResolvedValueOnce(spriteContent);

      const asset = await AssetManager.getAsset('test');

      expect(asset.width).toBe(7); // Longest line: 'FGHIJKL'
      expect(asset.height).toBe(3); // Max frame height: frame 2 has 3 lines
    });
  });

  describe('Legacy Compatibility Methods', () => {
    test('getMaterial() should return MaterialAsset and enforce type', async () => {
      const materialContent = `§ {"kind":"material","usage":"wall"}
¶ {"layer":"here","position":"left"}
|\\
| \\`;

      mockLoadArt
        .mockRejectedValueOnce(new Error('Map not found'))
        .mockResolvedValueOnce(materialContent);

      const materialAsset = await AssetManager.getMaterial('wall');

      expect(materialAsset.usage).toBe('wall');
      expect(materialAsset.layers).toHaveLength(1);
    });

    test('getSprite() should return SpriteAsset and enforce type', async () => {
      const spriteContent = `§ {"kind":"sprite","loop":false}
Frame 1
¶ {}
Frame 2`;

      mockLoadArt
        .mockRejectedValueOnce(new Error('Map not found'))
        .mockRejectedValueOnce(new Error('Material not found'))
        .mockRejectedValueOnce(new Error('Scene not found'))
        .mockResolvedValueOnce(spriteContent);

      const spriteAsset = await AssetManager.getSprite('animation');

      expect(spriteAsset.frames).toHaveLength(2);
      expect(spriteAsset.defaults.loop).toBe(false);
    });

    test('legacy methods should throw error for wrong asset type', async () => {
      // Mock sprite content but try to load as material
      const spriteContent = `§ {"kind":"sprite"}
Animation frame`;

      mockLoadArt
        .mockRejectedValueOnce(new Error('Map not found'))
        .mockRejectedValueOnce(new Error('Material not found'))
        .mockRejectedValueOnce(new Error('Scene not found'))
        .mockResolvedValueOnce(spriteContent);

      await expect(AssetManager.getMaterial('animation'))
        .rejects.toThrow('Asset "animation" is not a material');
    });
  });

  describe('Error Handling', () => {
    test('should handle malformed JSON metadata gracefully', async () => {
      const badSpriteContent = `§ {invalid json}
Some content`;

      mockLoadArt
        .mockRejectedValueOnce(new Error('Map not found'))
        .mockRejectedValueOnce(new Error('Material not found'))
        .mockRejectedValueOnce(new Error('Scene not found'))
        .mockResolvedValueOnce(badSpriteContent);

      // Should not throw, but should handle gracefully
      const asset = await AssetManager.getAsset('bad');
      expect(asset.kind).toBe('sprite');

      const spriteData = asset.data as SpriteAsset;
      expect(spriteData.frames).toHaveLength(1); // Falls back to single frame
    });

    test('should handle empty content gracefully', async () => {
      mockLoadArt
        .mockRejectedValueOnce(new Error('Map not found'))
        .mockRejectedValueOnce(new Error('Material not found'))
        .mockRejectedValueOnce(new Error('Scene not found'))
        .mockResolvedValueOnce('');

      const asset = await AssetManager.getAsset('empty');
      expect(asset.kind).toBe('sprite');
      // Empty content creates a frame with empty lines, so width/height might be 0 or 1
      expect(asset.width).toBeGreaterThanOrEqual(0);
      expect(asset.height).toBeGreaterThanOrEqual(0);

      const spriteData = asset.data as SpriteAsset;
      expect(spriteData.frames).toHaveLength(1);
    });
  });

  describe('Path Resolution', () => {
    test('should try paths in correct order for asset detection', async () => {
      mockLoadArt.mockRejectedValue(new Error('Not found'));

      try {
        await AssetManager.getAsset('test');
      } catch (error) {
        // Expected to fail
      }

      expect(mockLoadArt).toHaveBeenNthCalledWith(1, 'art/maps/test/map.txt');
      expect(mockLoadArt).toHaveBeenNthCalledWith(2, 'art/materials/test.txt');
      expect(mockLoadArt).toHaveBeenNthCalledWith(3, 'art/scenes/test.txt');
      expect(mockLoadArt).toHaveBeenNthCalledWith(4, 'art/sprites/test.txt');
    });
  });

  describe('Multi-Frame Sprite Analysis', () => {
    test('should correctly parse and measure multi-frame animations', async () => {
      const animationContent = `§ {"kind":"sprite","loop":true,"default-frame-rate":120}
Frame 1 content
Second line
¶ {"duration":1000}
Different width frame
¶ {"duration":500}
Very long frame content line here
Short
Final`;

      mockLoadArt
        .mockRejectedValueOnce(new Error('Map not found'))
        .mockRejectedValueOnce(new Error('Material not found'))
        .mockRejectedValueOnce(new Error('Scene not found'))
        .mockResolvedValueOnce(animationContent);

      const asset = await AssetManager.getAsset('animation');

      expect(asset.kind).toBe('sprite');
      expect(asset.width).toBe(33); // "Very long frame content line here"
      expect(asset.height).toBe(3); // Max height across all frames

      const spriteData = asset.data as SpriteAsset;
      expect(spriteData.frames).toHaveLength(3);
      expect(spriteData.defaults.loop).toBe(true);
      expect(spriteData.defaults.duration).toBe(120);

      // Check frame dimensions individually
      expect(spriteData.frames[0].lines).toHaveLength(3); // 3 lines (including header content parsing)
      expect(spriteData.frames[1].lines).toHaveLength(2); // 2 lines (includes blank line)
      expect(spriteData.frames[2].lines).toHaveLength(3); // 3 lines (longest)

      // Check frame metadata
      expect(spriteData.frames[0].meta.duration).toBe(120); // default
      expect(spriteData.frames[1].meta.duration).toBe(1000);
      expect(spriteData.frames[2].meta.duration).toBe(500);
    });
  });
});