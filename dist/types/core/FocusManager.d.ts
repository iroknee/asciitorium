import { Component } from './Component';
import { Layout } from './layouts/Layout';
export declare class FocusManager {
    private contextStack;
    private index;
    pushContext(components: Component[]): void;
    popContext(): void;
    private get currentContext();
    private setFocus;
    private clearFocus;
    focusNext(): void;
    focusPrevious(): void;
    handleKey(key: string): boolean;
    reset(layout: Layout): void;
    getFocusableDescendants(parent: Layout): Component[];
}
