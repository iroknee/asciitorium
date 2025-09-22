import { Component, ComponentProps } from '../core/Component';
import { App } from '../core/App';
import { isCPUSupported, isMemorySupported } from '../core/environment';

export interface PerfMonitorOptions extends ComponentProps {
  // No feature toggles - auto-detects supported features
}

export class PerfMonitor extends Component {
  private showCPU: boolean;
  private showMemory: boolean;

  constructor(options: PerfMonitorOptions) {
    // Auto-detect supported features
    const showCPU = isCPUSupported();
    const showMem = isMemorySupported();

    // Single line display - calculate width based on enabled metrics
    let estimatedWidth = 0; // No base padding needed
    estimatedWidth += 15; // "RTM: 009.5/ms |"
    if (showCPU) estimatedWidth += 14; // " CPU: 012.3% |"
    if (showMem) estimatedWidth += 17; // " MEM: 0123.4/mb |"
    estimatedWidth += 13; // " FPS: 060/fps"

    super({
      ...options,
      width: options.width ?? options.style?.width ?? estimatedWidth,
      align: options.align ?? 'right',
      label: 'Stats',
    });

    this.showCPU = showCPU;
    this.showMemory = showMem;
  }

  private getAsciitoriumRoot(): App | null {
    let current: Component | undefined = this.parent;
    while (current) {
      if (current instanceof App) {
        return current;
      }
      current = current.parent;
    }
    return null;
  }

  draw(): string[][] {
    // If not visible, return empty buffer immediately
    if (!this.visible) {
      return [];
    }

    super.draw();

    const root = this.getAsciitoriumRoot();
    if (!root) {
      return this.buffer;
    }

    const innerWidth = this.width - (this.border ? 2 : 0);
    const currentLine = this.border ? 1 : 0;
    const startX = this.border ? 1 : 0;

    // Build single line text with all enabled metrics
    const parts: string[] = [];

    // CPU Usage (only if supported)
    if (this.showCPU) {
      const cpuUsage = root.getCPUUsage();
      const cpuStr = cpuUsage.toFixed(1).padStart(5, '0'); // "012.3"
      parts.push(`CPU: ${cpuStr}% |`);
    }

    // Memory Usage (only if supported)
    if (this.showMemory) {
      const memUsage = root.getMemoryUsage();
      const memStr = memUsage.toFixed(1).padStart(6, '0'); // "0123.4"
      parts.push(`MEM: ${memStr}mb |`);
    }

    // Render Time
    const renderTime = root.getRenderTime();
    const rtStr = renderTime.toFixed(0).padStart(5, '0'); // "009.5"
    parts.push(`REN: ${rtStr}ms |`);

    // FPS
    const fps = root.getFPS();
    const fpsStr = fps.toString().padStart(3, '0'); // "060"
    parts.push(`FPS: ${fpsStr}`);

    // Join all parts with spaces and render
    const text = parts.join(' ');
    for (let i = 0; i < text.length && i < innerWidth; i++) {
      if (currentLine < this.height && startX + i < this.width) {
        this.buffer[currentLine][startX + i] = text[i];
      }
    }

    return this.buffer;
  }
}
