import { Component, ComponentProps } from '../core/Component';
import { State } from '../core/State';
export interface TabsOptions extends Omit<ComponentProps, 'height' | 'width'> {
    tabs: string[];
    selectedTab: State<string>;
    height?: number;
    width?: number;
}
export declare class Tabs extends Component {
    private readonly tabs;
    private readonly selectedTab;
    private selectedIndex;
    focusable: boolean;
    hasFocus: boolean;
    constructor(options: TabsOptions);
    handleEvent(event: string): boolean;
    draw(): string[][];
}
