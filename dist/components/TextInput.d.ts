import { Component, ComponentProps } from '../core/Component';
import { State } from '../core/State';
export interface TextInputOptions extends Omit<ComponentProps, 'height'> {
    value?: State<string>;
    placeholder?: string;
    height?: number;
}
export declare class TextInput extends Component {
    private readonly value;
    private readonly placeholder;
    private cursorIndex;
    private suppressCursorSync;
    focusable: boolean;
    hasFocus: boolean;
    constructor(options: TextInputOptions);
    handleEvent(event: string): boolean;
    draw(): string[][];
}
