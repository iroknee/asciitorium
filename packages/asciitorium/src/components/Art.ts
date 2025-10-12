import { Component, ComponentProps } from '../core/Component';
import { requestRender } from '../core/RenderScheduler';
import { State } from '../core/State';
import {
  AssetManager,
  type Asset,
  type SpriteAsset,
} from '../core/AssetManager';

export interface ArtOptions extends Omit<ComponentProps, 'children'> {
  content?: string | State<string>; // raw text loaded from .art (UTF-8) or reactive state
  src?: string; // URL or file path to load ASCII art from
  children?: string | string[];
}

/** Parsed per-frame metadata (keep minimal per your spec) */
type FrameMeta = {
  duration?: number; // ms
  sound?: string; // id or URL
};

/** Internal frame shape */
type SpriteFrame = {
  lines: string[][]; // 2D char grid
  meta: FrameMeta; // already merged with defaults
};

/** Top-of-file defaults */
type SpriteDefaults = {
  duration?: number; // ms
  loop?: boolean;
};

export class Art extends Component {
  private frames: SpriteFrame[] = [];
  private frameIndex = 0;
  private loop = false;
  private timer: ReturnType<typeof setTimeout> | null = null;
  private contentState?: State<string>;
  private isLoading = false;
  private loadError?: string;
  private src?: string;

  constructor(options: ArtOptions) {
    let actualContent = options.content;
    const borderPadding = options.border ? 2 : 0;
    const isLoadingSrc = !!options.src;

    // Prepare content and dimensions before super() call
    let parsedFrames: SpriteFrame[] = [];
    let parsedLoop = false;
    let calculatedWidth: number | undefined;
    let calculatedHeight: number | undefined;

    if (!isLoadingSrc) {
      // Handle direct content/children (non-src)
      if (!actualContent && options.children) {
        const children = Array.isArray(options.children)
          ? options.children
          : [options.children];
        if (children.length > 0) {
          actualContent = children[0];
        }
      }

      if (!actualContent) {
        throw new Error(
          'AsciiArt component requires either src, content prop, or children'
        );
      }

      // Handle State<string> or string content - determine initial value
      let contentValue: string;
      if (actualContent instanceof State) {
        contentValue = actualContent.value;
      } else {
        contentValue = actualContent;
      }

      // Parse the content directly and measure dimensions only if not provided
      const parsed = parseSprite(contentValue);
      const { maxW, maxH } = measureFrames(parsed.frames);

      parsedFrames = parsed.frames;
      parsedLoop = parsed.defaults.loop || false;
      calculatedWidth = Math.max(1, maxW + borderPadding);
      calculatedHeight = Math.max(1, maxH + borderPadding);
    } else {
      // For src loading, use placeholder
      parsedFrames = [
        {
          lines: [['L', 'o', 'a', 'd', 'i', 'n', 'g', '.', '.', '.']],
          meta: { duration: 0 },
        },
      ];
      parsedLoop = false;
      calculatedWidth = 12; // "Loading..." length + border
      calculatedHeight = 1 + borderPadding;
    }

    // Call super() with calculated or provided dimensions
    const { children, content, src, ...componentProps } = options;
    super({
      ...componentProps,
      width: options.width ?? options.style?.width ?? calculatedWidth,
      height: options.height ?? options.style?.height ?? calculatedHeight,
    });

    // Set initial state
    this.frames = parsedFrames;
    this.loop = parsedLoop;

    if (isLoadingSrc && options.src) {
      // Set loading state
      this.src = options.src;
      this.isLoading = true;

      // Start async loading using AssetManager
      AssetManager.getSprite(options.src)
        .then((spriteAsset) => {
          this.isLoading = false;
          this.loadError = undefined;
          // Calculate dimensions from sprite frames
          const { maxW, maxH } = measureFrames(spriteAsset.frames);
          // Wrap in Asset format for updateContentFromAsset
          const asset = {
            kind: 'sprite' as const,
            width: maxW,
            height: maxH,
            data: spriteAsset,
          };
          this.updateContentFromAsset(asset);
          requestRender();
          this.forceRenderIfNeeded();
        })
        .catch((error: Error) => {
          this.isLoading = false;
          this.loadError = error.message || 'Failed to load ASCII art';
          this.updateContent(`Error: ${this.loadError}`);
          requestRender();
          this.forceRenderIfNeeded();
        });
    } else {
      // Set up state subscription for reactive content
      if (actualContent instanceof State) {
        this.contentState = actualContent;
        this.bind(this.contentState, (newValue: string) => {
          this.updateContent(newValue);
        });
      }

      // Start animation if we have multiple frames
      if (this.frames.length > 1) {
        this.startAnimation();
      }
    }
  }

  private startAnimation() {
    // Kick the very first frame sound (if any)
    this.maybePlaySound(this.frames[this.frameIndex]?.meta.sound);
    this.scheduleNext();
  }

  private scheduleNext() {
    const current = this.frames[this.frameIndex];
    const dur = Math.max(0, current?.meta.duration ?? 0);

    // Safety: if duration is 0 or missing, render next microtask to avoid tight loops
    const delay = Number.isFinite(dur) && dur > 0 ? dur : 0;

    this.clearTimer();
    this.timer = setTimeout(() => {
      this.advanceFrame();
    }, delay);
  }

  private advanceFrame() {
    if (this.frames.length <= 1) return;

    this.frameIndex++;
    if (this.frameIndex >= this.frames.length) {
      if (this.loop) {
        this.frameIndex = 0;
      } else {
        this.frameIndex = this.frames.length - 1; // stick on last
        this.clearTimer();
        requestRender();
        return;
      }
    }

    // Sound for the new frame
    this.maybePlaySound(this.frames[this.frameIndex]?.meta.sound);

    requestRender();
    this.scheduleNext();
  }

  private maybePlaySound(id?: string) {
    if (!id) return;
    // Sound system not implemented yet - just log for now
  }

  private clearTimer() {
    if (this.timer) {
      clearTimeout(this.timer);
      this.timer = null;
    }
  }

  private updateContent(newContent: string): void {
    // Stop current animation
    this.clearTimer();

    // Re-parse the new content
    const parsed = parseSprite(newContent);
    const { maxW, maxH } = measureFrames(parsed.frames);
    const newWidth = maxW + (this.border ? 2 : 0);
    const newHeight = maxH + (this.border ? 2 : 0);

    // Update component dimensions
    this.originalHeight = newHeight;
    this.originalWidth = newWidth;
    this.width = newWidth;
    this.height = newHeight;

    // Update frames and reset animation state
    this.frames = parsed.frames;
    this.loop = parsed.defaults.loop || false;
    this.frameIndex = 0;

    // Restart animation if needed
    if (this.frames.length > 1) {
      this.startAnimation();
    }

    // Request a re-render
    requestRender();
  }

  private updateContentFromAsset(asset: Asset): void {
    // Stop current animation
    this.clearTimer();

    // Use AssetManager's pre-calculated dimensions (includes all frames)
    const spriteAsset = asset.data as SpriteAsset;
    const newWidth = asset.width + (this.border ? 2 : 0);
    const newHeight = asset.height + (this.border ? 2 : 0);

    // Update component dimensions
    this.originalHeight = newHeight;
    this.originalWidth = newWidth;
    this.width = newWidth;
    this.height = newHeight;

    // Update frames and reset animation state
    this.frames = spriteAsset.frames;
    this.loop = spriteAsset.defaults.loop || false;
    this.frameIndex = 0;

    // Restart animation if needed
    if (this.frames.length > 1) {
      this.startAnimation();
    }

    // Request a re-render
    requestRender();
  }

  private extractSpriteName(src: string): string {
    // Handle old path format: "./art/sprites/player.art" -> "player"
    if (src.includes('/sprites/')) {
      const parts = src.split('/sprites/');
      if (parts.length > 1) {
        const spritePart = parts[1];
        const spriteName = spritePart.replace('.art', '');
        return spriteName;
      }
    }

    // Handle direct asset name: "player" -> "player"
    return src;
  }

  private forceRenderIfNeeded(): void {
    // Use the base class method for focus refresh (which also triggers render)
    this.notifyAppOfFocusRefresh();
  }

  override destroy(): void {
    super.destroy();
    this.clearTimer();
    // Note: Component.destroy() automatically handles state unsubscriptions
  }

  override draw(): string[][] {
    const buffer = super.draw();
    const xOffset = this.border ? 1 : 0;
    const yOffset = this.border ? 1 : 0;
    const innerWidth = this.width - (this.border ? 2 : 0);
    const innerHeight = this.height - (this.border ? 2 : 0);

    const frame = this.frames[this.frameIndex];
    if (!frame) return buffer;

    const lines = frame.lines;
    for (let y = 0; y < Math.min(lines.length, innerHeight); y++) {
      const line = lines[y];
      for (let x = 0; x < Math.min(line.length, innerWidth); x++) {
        buffer[y + yOffset][x + xOffset] = line[x];
      }
    }
    this.buffer = buffer;
    return buffer;
  }
}

/* =========================
   Parsing & utilities
   ========================= */

/**
 * parseSprite — supports:
 *  - Defaults: first non-empty line starting with § {json}
 *  - Frames: blocks terminated by ¶ {json} (meta for previous block)
 *  - Stills: if no §/¶ present, entire input is a single frame using fallbacks
 *  - Graceful JSON error handling (collects errors; uses fallbacks)
 *  - Trims CRLF; preserves leading/trailing spaces inside art lines
 */
function parseSprite(text: string): {
  defaults: SpriteDefaults;
  frames: SpriteFrame[];
  errors: string[];
} {
  const errors: string[] = [];
  const lines = text.replace(/\r\n?/g, '\n').split('\n');

  let defaults: SpriteDefaults = {};
  let sawAnyArt = false;
  let firstNonEmptySeen = false;

  // Buffers
  let currentBlock: string[] = [];
  const rawFrames: { art: string[]; meta?: FrameMeta }[] = [];

  const flush = (meta?: FrameMeta) => {
    // Allow empty frames (rare), but usually there is content
    rawFrames.push({ art: currentBlock.slice(), meta });
    currentBlock = [];
  };

  const tryParseJSON = (s: string, where: string): any => {
    try {
      return JSON.parse(s);
    } catch (e: any) {
      errors.push(`JSON parse error ${where}: ${e?.message ?? String(e)}`);
      return {};
    }
  };

  // Scan lines
  for (let i = 0; i < lines.length; i++) {
    const raw = lines[i]!;
    const trimmedStart = raw.trimStart();

    // First non-empty line special-cases defaults
    if (!firstNonEmptySeen && trimmedStart.length > 0) {
      firstNonEmptySeen = true;
      if (trimmedStart.startsWith('§')) {
        const payload = raw.slice(raw.indexOf('§') + 1).trim();
        if (payload) {
          const d = tryParseJSON(payload, `in defaults at line ${i + 1}`);
          // Only pick the keys we support for now
          defaults = {
            duration: asNum(d?.duration),
            loop: asBool(d?.loop),
          };
        }
        // continue to next line; defaults line itself is not art
        continue;
      }
    }

    // Frame separator
    if (trimmedStart.startsWith('¶')) {
      const payload = raw.slice(raw.indexOf('¶') + 1).trim();
      const metaRaw = payload
        ? tryParseJSON(payload, `in frame meta at line ${i + 1}`)
        : {};
      const meta: FrameMeta = {
        duration: asNum(metaRaw?.duration),
        sound: typeof metaRaw?.sound === 'string' ? metaRaw.sound : undefined,
      };
      flush(meta);
      sawAnyArt = true;
      continue;
    }

    // Otherwise, this is art content (preserve exactly; only strip trailing \r earlier)
    currentBlock.push(raw);
    if (raw.length > 0) sawAnyArt = true;
  }

  // If file didn't end with a separator, flush the trailing block
  if (currentBlock.length) {
    flush({});
  }

  // If we never saw § or ¶ and we have art, treat entire input as a still
  const usedSpriteFormat = lines.some(
    (l) => l.trimStart().startsWith('§') || l.trimStart().startsWith('¶')
  );
  if (!usedSpriteFormat && sawAnyArt) {
    const still: SpriteFrame = {
      lines: normalizeBlock(lines),
      meta: { duration: 0 }, // irrelevant; there’s only one frame
    };
    return {
      defaults: { duration: 0, loop: false },
      frames: [still],
      errors,
    };
  }

  const frames: SpriteFrame[] = rawFrames.map(({ art, meta }) => {
    const merged: FrameMeta = {
      duration: meta?.duration ?? defaults.duration ?? 100,
      sound: meta?.sound,
    };
    return { lines: normalizeBlock(art), meta: merged };
  });

  // Edge case: if no frames collected (e.g., empty file), produce a single blank frame
  if (frames.length === 0) {
    frames.push({ lines: [[]], meta: { duration: defaults.duration ?? 100 } });
  }

  return { defaults, frames, errors };
}

/** Normalize a block of lines into a 2D char array (ragged-right preserved) */
function normalizeBlock(blockLines: string[]): string[][] {
  // Drop a single leading empty line if present (authoring convenience)
  const lines = blockLines.slice();

  if (lines.length && lines[0] === '') {
    lines.shift();
  }

  const result = lines.map((line) => [...line]);
  return result;
}

/** Measure max width/height across frames to size component surface */
function measureFrames(frames: SpriteFrame[]): { maxW: number; maxH: number } {
  let maxW = 1;
  let maxH = 1;
  for (const f of frames) {
    maxH = Math.max(maxH, f.lines.length || 1);
    for (const ln of f.lines) {
      maxW = Math.max(maxW, ln.length || 0);
    }
  }
  return { maxW, maxH };
}

/* Small helpers */
function asNum(v: any): number | undefined {
  return typeof v === 'number' && Number.isFinite(v) ? v : undefined;
}
function asBool(v: any): boolean {
  return typeof v === 'boolean' ? v : false;
}
