import { Component, ComponentProps } from '../core/Component';
import { App } from '../core/App';
import { isCPUSupported, isMemorySupported } from '../core/environment';

export interface PerfMonitorOptions extends ComponentProps {
  time?: boolean;
  cpu?: boolean;
  memory?: boolean;
  fps?: boolean;
}

export class PerfMonitor extends Component {
  private showRenderTime: boolean;
  private showCPU: boolean;
  private showMemory: boolean;
  private showFPS: boolean;

  constructor(options: PerfMonitorOptions) {
    const showRT = options.time ?? true;
    const showCPU = options.cpu ?? true;
    const showMem = options.memory ?? false;
    const showFPS = options.fps ?? false;

    // Calculate height based on enabled metrics
    let lines = 2;
    if (showRT) lines++;
    if (showCPU) lines++;
    if (showMem) lines++;
    if (showFPS) lines++;

    const height = Math.max(1, lines) + (options.border ? 2 : 0);

    super({
      ...options,
      width: options.width ?? 15,
      height,
      border: true,
      label: 'Stats',
    });

    this.showRenderTime = showRT;
    this.showCPU = showCPU;
    this.showMemory = showMem;
    this.showFPS = showFPS;
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
    super.draw();

    const root = this.getAsciitoriumRoot();
    if (!root) {
      return this.buffer;
    }

    const innerWidth = this.width - (this.border ? 2 : 0);
    let currentLine = this.border ? 1 : 0;
    const startX = this.border ? 1 : 0;

    // Render Time
    if (this.showRenderTime) {
      const renderTime = root.getRenderTime();
      const rtStr = renderTime.toFixed(1).padStart(5, ' ');
      const text = `time ${rtStr}ms`;

      for (let i = 0; i < text.length && i < innerWidth; i++) {
        if (currentLine < this.height && startX + i < this.width) {
          this.buffer[currentLine][startX + i] = text[i];
        }
      }
      currentLine++;
    }

    // CPU Usage
    if (this.showCPU) {
      let text: string;
      if (isCPUSupported()) {
        const cpuUsage = root.getCPUUsage();
        const cpuStr = cpuUsage.toFixed(1).padStart(5, ' ');
        text = `cpu  ${cpuStr}%`;
      } else {
        text = `cpu    N/A`;
      }

      for (let i = 0; i < text.length && i < innerWidth; i++) {
        if (currentLine < this.height && startX + i < this.width) {
          this.buffer[currentLine][startX + i] = text[i];
        }
      }
      currentLine++;
    }

    // Memory Usage
    if (this.showMemory) {
      let text: string;
      if (isMemorySupported()) {
        const memUsage = root.getMemoryUsage();
        const memStr = memUsage.toFixed(1).padStart(5, ' ');
        text = `mem  ${memStr}mb`;
      } else {
        text = `mem    N/A`;
      }

      for (let i = 0; i < text.length && i < innerWidth; i++) {
        if (currentLine < this.height && startX + i < this.width) {
          this.buffer[currentLine][startX + i] = text[i];
        }
      }
      currentLine++;
    }

    // FPS
    if (this.showFPS) {
      const fps = root.getFPS();
      const fpsStr = fps.toString().padStart(3, ' ');
      const text = `fps  ${fpsStr}`;

      for (let i = 0; i < text.length && i < innerWidth; i++) {
        if (currentLine < this.height && startX + i < this.width) {
          this.buffer[currentLine][startX + i] = text[i];
        }
      }
      currentLine++;
    }

    return this.buffer;
  }
}
