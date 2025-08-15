import { Component, ComponentProps } from '../core/Component';
import type { State } from '../core/State';
import { requestRender } from '../core/RenderScheduler';

export interface ProgressBarOptions extends Omit<ComponentProps, 'height'> {
  percent: State<number>; // expects 0–100
  showPercentage?: boolean;
  durationMs?: number; // animation duration
  height?: number; // fixed height of 3
}

export class ProgressBar extends Component {
  // Store percent as 0–100 internally
  private value = 0;
  private readonly showPercentage: boolean;
  private animationInterval?: ReturnType<typeof setInterval>;
  private readonly durationMs: number;

  constructor(options: ProgressBarOptions) {
    options.height = 3;
    options.border = false;
    super(options as ComponentProps);

    this.showPercentage = options.showPercentage ?? false;
    this.durationMs = options.durationMs ?? 1000;

    // Bind to a 0–100 State<number>
    this.bind(options.percent, (newValue) => {
      this.animateTo(newValue, this.durationMs);
    });
  }

  private animateTo(value: number, durationMs: number = 1000): void {
    // Clamp to 0–100
    const target = Math.max(0, Math.min(100, value));

    if (this.animationInterval) clearInterval(this.animationInterval);

    const steps = 10;
    const delay = durationMs / steps;
    const start = this.value; // also 0–100
    let currentStep = 0;

    this.animationInterval = setInterval(() => {
      currentStep++;
      const t = currentStep / steps; // 0..1
      this.value = start + (target - start) * t;

      if (currentStep >= steps) {
        clearInterval(this.animationInterval);
        this.animationInterval = undefined;
        this.value = target;
      }
      requestRender();
    }, delay);
  }

  override draw(): string[][] {
    const width = this.width ?? 10;
    const innerWidth = width - 2;

    // Convert 0–100 to cells filled
    const filledLength = Math.round((this.value / 100) * innerWidth);
    const emptyLength = Math.max(0, innerWidth - filledLength);

    let barContent =
      '█'.repeat(Math.max(0, filledLength)) +
      ' '.repeat(Math.max(0, emptyLength));

    if (this.showPercentage && innerWidth > 0) {
      const percentStr = `${Math.round(this.value)}%`;
      // Center the text; if it overflows, truncate
      const startIdx = Math.max(
        0,
        Math.floor((innerWidth - percentStr.length) / 2)
      );
      const before = barContent.slice(0, startIdx);
      const after = barContent.slice(startIdx + percentStr.length);
      barContent = (before + percentStr + after).slice(0, innerWidth);
    }

    // Frame lines (kept as in your original)
    const top = ' ⎽' + '⎽'.repeat(Math.max(0, width - 3));
    const mid = `⎹${barContent}⎸`;
    const bot = ' ' + '⎺'.repeat(Math.max(0, width - 2));

    this.buffer = [top, mid, bot].map((line) => Array.from(line));
    return this.buffer;
  }
}
