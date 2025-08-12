import { Component, ComponentProps } from '../core/Component';
export interface ArtOptions extends Omit<ComponentProps, 'width' | 'height'> {
    content: string;
    frameDurationMs?: number;
    loop?: boolean;
    width?: number;
    height?: number;
}
export declare class AsciiArt extends Component {
    private readonly rawContent;
    private frames;
    private frameIndex;
    private animationInterval?;
    private loop;
    constructor(options: ArtOptions);
    destroy(): void;
    draw(): string[][];
}
