import { Component } from './Component';

export interface ProgressBarOptions {
  label: string;
  width: number;
  progress: number; // 0 to 1
  showPercent?: boolean;
  onUpdate?: () => void; // <-- to trigger render
}

export class ProgressBar extends Component {
  label: string;
  width: number;
  height: number = 3;
  private progress: number;
  private targetProgress: number | null = null;
  showPercent: boolean;
  private onUpdate?: () => void;
  private animationInterval?: ReturnType<typeof setInterval>;

  constructor({
    label,
    width,
    progress,
    showPercent = false,
    onUpdate,
  }: ProgressBarOptions) {
    super();
    this.label = label;
    this.width = width;
    this.progress = Math.max(0, Math.min(1, progress));
    this.showPercent = showPercent;
    this.onUpdate = onUpdate;
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
    const innerWidth = this.width - 2;
    const filledLength = Math.round(this.progress * innerWidth);
    const emptyLength = innerWidth - filledLength;

    let barContent = '█'.repeat(filledLength) + ' '.repeat(emptyLength);

    if (this.showPercent) {
      const percentStr = `${Math.round(this.progress * 100)}%`;
      const start = Math.floor((innerWidth - percentStr.length) / 2);
      const padded =
        barContent.slice(0, start) +
        percentStr +
        barContent.slice(start + percentStr.length);

      barContent = padded.slice(0, innerWidth);
    }

    const top =
      ' ⎽' +
      this.label +
      '⎽'.repeat(Math.max(0, this.width - 3 - this.label.length));
    const bar = `⎹${barContent}⎸`;
    const bottom = ' ' + '⎺'.repeat(this.width - 2);

    return [top, bar, bottom].map((line) => Array.from(line));
  }
}
