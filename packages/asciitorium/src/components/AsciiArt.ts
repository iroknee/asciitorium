import { Component, ComponentProps } from '../core/Component';
import { requestRender } from '../core/RenderScheduler';

export interface ArtOptions extends Omit<ComponentProps, 'width' | 'height' | 'children'> {
  content?: string; // raw text loaded from .txt (UTF-8)
  width?: number; // optional fixed width
  height?: number; // optional fixed height
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

export class AsciiArt extends Component {
  private readonly frames: SpriteFrame[] = [];
  private frameIndex = 0;
  private loop = false;
  private timer: ReturnType<typeof setTimeout> | null = null;

  constructor(options: ArtOptions) {
    // Support both content prop and JSX children
    let actualContent = options.content;
    
    if (!actualContent && options.children) {
      const children = Array.isArray(options.children) ? options.children : [options.children];
      if (children.length > 0) {
        actualContent = children[0];
      }
    }
    
    if (!actualContent) {
      throw new Error('AsciiArt component requires either content prop or children');
    }

    // Parse content (supports §/¶ JSON; falls back to single still)
    const parsed = parseSprite(actualContent);

    // Compute width/height from max of all frames (unless provided)
    const { maxW, maxH } = measureFrames(parsed.frames);
    const borderPadding = options.border ? 2 : 0;

    const { children, content, ...componentProps } = options;
    super({
      ...componentProps,
      width: options.width ?? Math.max(1, maxW + borderPadding),
      height: options.height ?? Math.max(1, maxH + borderPadding),
    });

    this.frames = parsed.frames;
    this.loop = parsed.defaults.loop || false;

    // If we have animation (2+ frames), start it
    if (this.frames.length > 1) {
      this.startAnimation();
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

  override destroy(): void {
    super.destroy();
    this.clearTimer();
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
