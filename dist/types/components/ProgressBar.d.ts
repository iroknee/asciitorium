import { Component, ComponentProps } from '../core/Component';
import type { State } from '../core/State';
export interface ProgressBarOptions extends Omit<ComponentProps, 'height'> {
    progress: State<number>;
    percentage?: boolean;
    durationMs?: number;
    height?: number;
}
export declare class ProgressBar extends Component {
    private progress;
    private readonly percentage;
    private animationInterval?;
    private readonly durationMs;
    constructor(options: ProgressBarOptions);
    private animateTo;
    draw(): string[][];
}
