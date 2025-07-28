import { Component, ComponentOptions } from '../core/Component';

export interface ProgressBarOptions extends Omit<ComponentOptions, 'height' > {
  progress: number; // 0 to 1
  showPercent?: boolean;
  onUpdate?: () => void; // <-- to trigger render
  height?: number; // allow setting height for internal use
}

export class ProgressBar extends Component {
  readonly label: string;
  readonly height: number = 3;
  private progress: number;
  private targetProgress: number | null = null;
  private readonly showPercent: boolean;
  private readonly onUpdate?: () => void;
  private animationInterval?: ReturnType<typeof setInterval>;

  constructor(options: ProgressBarOptions) {
    options.height = 3; // Progress bar is always 3 lines tall
    options.border = false; // Default to having a border
    super(options as ComponentOptions);
    this.label = options.label ?? '';
    this.progress = Math.max(0, Math.min(1, options.progress));
    this.showPercent = options.showPercent ?? false;
    this.onUpdate = options.onUpdate;
  }

  setProgress(value: number): void {
    this.progress = Math.max(0, Math.min(1, value));
    this.targetProgress = null;
    this.onUpdate?.();
  }

  animateTo(value: number, durationMs = 1000): void {
    const clamped = Math.max(0, Math.min(1, value));
    if (this.animationInterval) clearInterval(this.animationInterval);

    const steps = 30;
    const delay = durationMs / steps;
    const start = this.progress;
    let currentStep = 0;

    this.animationInterval = setInterval(() => {
      currentStep++;
      const t = currentStep / steps;
      this.progress = start + (clamped - start) * t;
      this.onUpdate?.();

      if (currentStep >= steps) {
        clearInterval(this.animationInterval);
        this.progress = clamped;
        this.onUpdate?.();
      }
    }, delay);
  }

  draw(): string[][] {
    const width = this.width ?? 10;
    const innerWidth = width - 2;

    const filledLength = Math.round(this.progress * innerWidth);
    const emptyLength = innerWidth - filledLength;

    let barContent = '█'.repeat(filledLength) + ' '.repeat(emptyLength);

    if (this.showPercent) {
      const percentStr = `${Math.round(this.progress * 100)}%`;
      const start = Math.floor((innerWidth - percentStr.length) / 2);
      const before = barContent.slice(0, start);
      const after = barContent.slice(start + percentStr.length);
      barContent = (before + percentStr + after).slice(0, innerWidth);
    }

    const top = ' ⎽' + this.label + '⎽'.repeat(Math.max(0, width - 3 - this.label.length));
    const mid = `⎹${barContent}⎸`;
    const bot = ' ' + '⎺'.repeat(width - 2);

    return [top, mid, bot].map((line) => Array.from(line));
  }
}