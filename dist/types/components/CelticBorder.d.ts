import { Component, ComponentProps } from '../core/Component';
export type CelticCorner = 'topLeft' | 'topRight' | 'bottomLeft' | 'bottomRight';
export interface CelticBorderOptions extends Partial<ComponentProps> {
    corner: CelticCorner;
}
export declare class CelticBorder extends Component {
    private lines;
    constructor({ corner, ...options }: CelticBorderOptions);
    draw(): string[][];
}
