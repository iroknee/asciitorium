import { VerticalLayout, VerticalLayoutProps } from './layouts/VerticalLayout';
import { FocusManager } from './FocusManager';
import { Component } from './Component';
export declare class Asciitorium extends VerticalLayout {
    readonly focus: FocusManager;
    private readonly renderer;
    private fpsCounter;
    private totalRenderTime;
    constructor(props: VerticalLayoutProps);
    render(): void;
    addChild(component: Component): void;
    removeChild(component: Component): void;
    handleKey(key: string): void;
}
