import { Component, ComponentProps } from '../core/Component';
export interface ButtonOptions extends Omit<ComponentProps, 'width' | 'height'> {
    onClick?: () => void;
    width?: number;
    height?: number;
}
export declare class Button extends Component {
    readonly onClick?: () => void;
    focusable: boolean;
    hasFocus: boolean;
    constructor({ onClick, ...options }: ButtonOptions);
    handleEvent(event: string): boolean;
    draw(): string[][];
}
