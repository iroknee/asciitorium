import { Component, ComponentProps } from '../core/Component';
import type { State } from '../core/State';
import { Alignment } from 'core/types';
export interface TextOptions extends Omit<ComponentProps, 'height' | 'width'> {
    value: string | State<string>;
    height?: number;
    width?: number;
    align?: Alignment;
}
export declare class Text extends Component {
    private source;
    constructor(options: TextOptions);
    get value(): string;
    draw(): string[][];
}
