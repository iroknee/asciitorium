import { loadArt } from './environment';
import { State } from './State';

// Asset type definitions
export interface LegendEntry {
  kind: 'material' | 'sprite';
  name?: string;
  solid: boolean;
  visible?: boolean;
  entity?: string;
  variant?: string;
  asset: string;
}

// New legend format with character arrays
export interface LegendArrayEntry {
  chars: string[];
  kind: 'material' | 'sprite';
  name?: string;
  solid: boolean;
  visible?: boolean;
  entity?: string;
  variant?: string;
  asset: string;
}

export interface MaterialLayer {
  layer: 'here' | 'near' | 'middle' | 'far';
  position: 'left' | 'center' | 'right';
  x?: number;
  lines: string[];
}

export interface SpriteFrame {
  lines: string[][];
  meta: {
    duration?: number;
    sound?: string;
  };
}

export interface SpriteDefaults {
  duration?: number;
  loop?: boolean;
}

// Unified Asset interface
export interface Asset {
  kind: 'map' | 'material' | 'sprite';
  width: number;
  height: number;
  data: MapAsset | MaterialAsset | SpriteAsset;
}

export interface MapAsset {
  mapData: string[];
  legend: Record<string, LegendEntry>;
}

export interface MaterialAsset {
  usage: string;
  placement?: 'ground' | 'ceiling';
  onEnterSound?: string;
  onExitSound?: string;
  ambientSound?: string;
  layers: MaterialLayer[];
}

export interface SpriteAsset {
  frames: SpriteFrame[];
  defaults: SpriteDefaults;
}

export class AssetManager {
  // State caches for reactive asset loading
  private static mapStateCache: Map<string, State<MapAsset | null>> = new Map();
  private static materialStateCache: Map<string, State<MaterialAsset | null>> = new Map();

  static getMapState(name: string): State<MapAsset | null> {
    // Check cache first - return same State instance every time
    if (this.mapStateCache.has(name)) {
      return this.mapStateCache.get(name)!;
    }

    // Create new State starting with null (loading)
    const state = new State<MapAsset | null>(null);
    this.mapStateCache.set(name, state);

    // Start async load
    this.loadMapAsset(name)
      .then((mapAsset) => {
        state.value = mapAsset;
      })
      .catch((error) => {
        console.error(`Failed to load map "${name}":`, error);
        // Keep as null on error
      });

    return state;
  }

  static getMaterialState(name: string): State<MaterialAsset | null> {
    // Check cache first - return same State instance every time
    if (this.materialStateCache.has(name)) {
      return this.materialStateCache.get(name)!;
    }

    // Create new State starting with null (loading)
    const state = new State<MaterialAsset | null>(null);
    this.materialStateCache.set(name, state);

    // Start async load
    this.loadMaterialAsset(name)
      .then((materialAsset) => {
        state.value = materialAsset;
      })
      .catch((error) => {
        console.error(`Failed to load material "${name}":`, error);
        // Keep as null on error
      });

    return state;
  }

  // Legacy methods for backward compatibility (non-reactive)
  // These use the State cache internally, so they benefit from caching
  static async getMap(name: string): Promise<MapAsset> {
    const state = this.getMapState(name);

    // If already loaded, return immediately
    if (state.value !== null) {
      return state.value;
    }

    // Otherwise wait for it to load
    return new Promise((resolve, reject) => {
      const checkLoaded = (mapAsset: MapAsset | null) => {
        if (mapAsset !== null) {
          state.unsubscribe(checkLoaded);
          resolve(mapAsset);
        }
      };
      state.subscribe(checkLoaded);

      // Add timeout to reject if loading takes too long
      setTimeout(() => {
        state.unsubscribe(checkLoaded);
        reject(new Error(`Timeout loading map "${name}"`));
      }, 10000); // 10 second timeout
    });
  }

  static async getMaterial(name: string): Promise<MaterialAsset> {
    const state = this.getMaterialState(name);

    // If already loaded, return immediately
    if (state.value !== null) {
      return state.value;
    }

    // Otherwise wait for it to load
    return new Promise((resolve, reject) => {
      const checkLoaded = (materialAsset: MaterialAsset | null) => {
        if (materialAsset !== null) {
          state.unsubscribe(checkLoaded);
          resolve(materialAsset);
        }
      };
      state.subscribe(checkLoaded);

      // Add timeout to reject if loading takes too long
      setTimeout(() => {
        state.unsubscribe(checkLoaded);
        reject(new Error(`Timeout loading material "${name}"`));
      }, 10000); // 10 second timeout
    });
  }

  static async getSprite(name: string): Promise<SpriteAsset> {
    // Sprites don't have State cache yet, use direct loading
    return this.loadSpriteAsset(name);
  }

  // Dimension calculation methods
  private static calculateMapWidth(asset: MapAsset): number {
    return Math.max(...asset.mapData.map((line) => line.length));
  }

  private static calculateMaterialWidth(asset: MaterialAsset): number {
    let maxWidth = 0;
    for (const layer of asset.layers) {
      const layerWidth = Math.max(...layer.lines.map((line) => line.length));
      maxWidth = Math.max(maxWidth, layerWidth);
    }
    return maxWidth;
  }

  private static calculateMaterialHeight(asset: MaterialAsset): number {
    let maxHeight = 0;
    for (const layer of asset.layers) {
      maxHeight = Math.max(maxHeight, layer.lines.length);
    }
    return maxHeight;
  }

  private static calculateSpriteWidth(asset: SpriteAsset): number {
    let maxWidth = 0;
    for (const frame of asset.frames) {
      for (const line of frame.lines) {
        const lineWidth = line.length;
        maxWidth = Math.max(maxWidth, lineWidth);
      }
    }
    return maxWidth;
  }

  private static calculateSpriteHeight(asset: SpriteAsset): number {
    let maxHeight = 0;
    for (const frame of asset.frames) {
      maxHeight = Math.max(maxHeight, frame.lines.length);
    }
    return maxHeight;
  }

  // Private asset loading methods
  private static async loadMapAsset(name: string): Promise<MapAsset> {
    try {
      // Load map.art and legend.json
      const [mapData, legendData] = await Promise.all([
        loadArt(`art/maps/${name}/map.art`),
        loadArt(`art/maps/${name}/legend.json`),
      ]);

      const mapLines = mapData.split('\n');
      const parsedLegend = JSON.parse(legendData);
      const legend = this.expandLegendFormat(parsedLegend);

      return {
        mapData: mapLines,
        legend,
      };
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Unknown error';
      throw new Error(`Failed to load map "${name}": ${message}`);
    }
  }

  /**
   * Expands legend format to support both old and new formats
   * - New format: { "legend": [ { "chars": [...], ...props } ] }
   * - Old format: { "char": { ...props } }
   */
  private static expandLegendFormat(data: any): Record<string, LegendEntry> {
    const result: Record<string, LegendEntry> = {};

    // Check for new array format
    if (data.legend && Array.isArray(data.legend)) {
      // New format: expand each entry's chars array
      for (const entry of data.legend) {
        if (!entry.chars || !Array.isArray(entry.chars)) {
          console.warn('Legend entry missing chars array:', entry);
          continue;
        }

        // Create a LegendEntry without the chars property
        const legendEntry: LegendEntry = {
          kind: entry.kind,
          solid: entry.solid,
          asset: entry.asset,
          ...(entry.name && { name: entry.name }),
          ...(entry.visible !== undefined && { visible: entry.visible }),
          ...(entry.entity && { entity: entry.entity }),
          ...(entry.variant && { variant: entry.variant }),
        };

        // Expand each character in the chars array
        for (const char of entry.chars) {
          result[char] = legendEntry;
        }
      }
    } else {
      // Old format: data is already a Record<string, LegendEntry>
      return data;
    }

    return result;
  }

  private static async loadMaterialAsset(name: string): Promise<MaterialAsset> {
    try {
      const materialData = await loadArt(`art/materials/${name}.art`);
      return this.parseMaterialData(materialData);
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Unknown error';
      throw new Error(`Failed to load material "${name}": ${message}`);
    }
  }

  private static async loadSpriteAsset(name: string): Promise<SpriteAsset> {
    try {
      const spriteData = await loadArt(`art/sprites/${name}.art`);
      return this.parseSpriteData(spriteData);
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Unknown error';
      throw new Error(`Failed to load sprite "${name}": ${message}`);
    }
  }

  // Material parsing (from FirstPersonCompositor logic)
  private static parseMaterialData(data: string): MaterialAsset {
    // Split by § to separate file header from content
    const fileParts = data.split('§');
    if (fileParts.length < 2) {
      throw new Error('Invalid material file format: missing § header');
    }

    // Parse file header
    const headerSection = fileParts[1];
    const headerLines = headerSection.split('\n');
    const headerMetadataLine = headerLines[0].trim();

    let fileMetadata: any;
    let isSceneFormat = false;
    try {
      fileMetadata = JSON.parse(headerMetadataLine);

      // Check for scenes format (§ contains layer info directly)
      if (fileMetadata.artType === 'fpsScenery' && fileMetadata.layer) {
        isSceneFormat = true;
      }
      // Check for materials format (§ contains file metadata)
      else if (fileMetadata.kind === 'material') {
        isSceneFormat = false;
      } else {
        throw new Error('File is not a material or scene');
      }
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Unknown error';
      throw new Error(`Failed to parse file metadata: ${message}`);
    }

    const layers: MaterialLayer[] = [];

    if (isSceneFormat) {
      // Scenes format: § line is the first layer, content follows immediately
      const contentAfterHeader = headerSection.substring(
        headerLines[0].length + 1
      );

      // Add the first layer from the § metadata
      const firstLayerLines = [];
      const remainingLines = contentAfterHeader.split('\n');

      // Find where the first ¶ separator is
      let firstSeparatorIndex = -1;
      for (let i = 0; i < remainingLines.length; i++) {
        if (remainingLines[i].trim().startsWith('¶')) {
          firstSeparatorIndex = i;
          break;
        }
      }

      // First layer content
      const firstLayerContent =
        firstSeparatorIndex === -1
          ? remainingLines
          : remainingLines.slice(0, firstSeparatorIndex);

      layers.push({
        layer: fileMetadata.layer,
        position: fileMetadata.position,
        x: fileMetadata.x,
        lines: firstLayerContent,
      });

      // Process remaining ¶-separated sections if any
      if (firstSeparatorIndex !== -1) {
        const remainingSections = remainingLines
          .slice(firstSeparatorIndex)
          .join('\n')
          .split('¶');
        for (const section of remainingSections) {
          if (!section.trim()) continue;
          this.parseLayerSection(section, layers);
        }
      }
    } else {
      // Materials format: content after § header is all ¶-separated layers
      const contentAfterHeader = headerSection.substring(
        headerLines[0].length + 1
      );
      const layerSections = contentAfterHeader.split('¶');

      for (const section of layerSections) {
        if (!section.trim()) continue;
        this.parseLayerSection(section, layers);
      }
    }

    return {
      usage: fileMetadata.usage || (isSceneFormat ? 'first-person' : 'unknown'),
      placement: fileMetadata.placement,
      onEnterSound: fileMetadata.onEnterSound,
      onExitSound: fileMetadata.onExitSound,
      ambientSound: fileMetadata.ambientSound,
      layers,
    };
  }

  private static parseLayerSection(
    section: string,
    layers: MaterialLayer[]
  ): void {
    const lines = section.split('\n');
    if (lines.length === 0) return;

    // Parse metadata from first line
    const metadataLine = lines[0].trim();
    if (!metadataLine.startsWith('{')) return;

    try {
      const metadata = JSON.parse(metadataLine);
      if (metadata.layer && metadata.position) {
        const spriteLines = lines.slice(1);

        layers.push({
          layer: metadata.layer,
          position: metadata.position,
          x: metadata.x,
          lines: spriteLines,
        });
      }
    } catch (error) {
      console.warn('Failed to parse layer metadata:', metadataLine, error);
    }
  }

  // Sprite parsing using § and ¶ separators
  // Format: § {sprite metadata} followed by frames separated by ¶ {frame metadata}
  // Example:
  //   § {"kind":"sprite","loop":true,"default-frame-rate":120}
  //   frame 1 content...
  //   ¶ {"duration":1000}
  //   frame 2 content...
  private static parseSpriteData(data: string): SpriteAsset {
    const frames: SpriteFrame[] = [];
    let defaults: SpriteDefaults = {};

    // Split by § to separate file header from content
    const fileParts = data.split('§');
    if (fileParts.length < 2) {
      // No § separator, treat as simple single-frame sprite
      return {
        frames: [{ lines: this.normalizeBlock(data.split('\n')), meta: {} }],
        defaults: {},
      };
    }

    // Parse file header for defaults
    const headerSection = fileParts[1];
    const headerLines = headerSection.split('\n');
    const headerMetadataLine = headerLines[0].trim();

    try {
      const fileMetadata = JSON.parse(headerMetadataLine);
      if (fileMetadata.kind === 'sprite') {
        defaults = {
          duration: fileMetadata['default-frame-rate'] || fileMetadata.duration,
          loop: fileMetadata.loop,
        };
      }
    } catch (error) {
      console.warn(
        'Failed to parse sprite file metadata:',
        headerMetadataLine,
        error
      );
    }

    // Get content after header line
    const contentAfterHeader = headerSection.substring(
      headerLines[0].length + 1
    );

    // Split by ¶ to get individual frame sections
    const frameSections = contentAfterHeader.split('¶');

    // First section (before any ¶) is the first frame
    if (frameSections[0] && frameSections[0].trim()) {
      const firstFrameLines = frameSections[0].split('\n');
      frames.push({
        lines: this.normalizeBlock(firstFrameLines),
        meta: { duration: defaults.duration },
      });
    }

    // Process remaining ¶-separated frame sections
    for (let i = 1; i < frameSections.length; i++) {
      const section = frameSections[i];
      if (!section.trim()) continue;

      const lines = section.split('\n');
      if (lines.length === 0) continue;

      // Parse metadata from first line
      const metadataLine = lines[0].trim();
      let frameMeta = { duration: defaults.duration };

      if (metadataLine.startsWith('{')) {
        try {
          const metadata = JSON.parse(metadataLine);
          frameMeta = {
            duration: metadata.duration || defaults.duration,
            ...(metadata.sound && { sound: metadata.sound }),
          };
        } catch (error) {
          console.warn('Failed to parse frame metadata:', metadataLine, error);
        }

        // Frame content is everything after the metadata line
        const frameLines = lines.slice(1);
        frames.push({
          lines: this.normalizeBlock(frameLines),
          meta: frameMeta,
        });
      } else {
        // No metadata, treat entire section as frame content
        frames.push({
          lines: this.normalizeBlock(lines),
          meta: frameMeta,
        });
      }
    }

    return { frames, defaults };
  }

  // Helper method to normalize sprite blocks (from Art component)
  private static normalizeBlock(blockLines: string[]): string[][] {
    // Drop a single leading empty line if present (authoring convenience)
    const lines = blockLines.slice();
    if (lines.length && lines[0] === '') {
      lines.shift();
    }
    const result = lines.map((line) => [...line]);
    return result;
  }
}
