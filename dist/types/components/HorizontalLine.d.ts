import { Component, ComponentProps } from '../core/Component';
export interface HorizontalLineOptions extends Omit<ComponentProps, 'width' | 'height'> {
    length?: number;
}
export declare class HorizontalLine extends Component {
    constructor(options: HorizontalLineOptions);
    draw(): string[][];
}
