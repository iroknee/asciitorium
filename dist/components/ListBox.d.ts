import { Component, ComponentProps } from '../core/Component';
import { State } from '../core/State';
export interface ListBoxOptions extends Omit<ComponentProps, 'height'> {
    items: string[];
    selectedItem: State<string>;
    height?: number;
}
export declare class ListBox extends Component {
    private readonly items;
    private readonly selectedItem;
    private selectedIndex;
    focusable: boolean;
    hasFocus: boolean;
    constructor(options: ListBoxOptions);
    handleEvent(event: string): boolean;
    draw(): string[][];
}
