import { Alignment } from './types';
import type { State } from './State';
export interface ComponentProps {
    label?: string;
    showLabel?: boolean;
    width: number;
    height: number;
    border?: boolean;
    fill?: string;
    align?: Alignment;
    bind?: State<any> | ((state: State<any>) => void);
    fixed?: boolean;
    x?: number;
    y?: number;
    z?: number;
}
export declare abstract class Component {
    label: string | undefined;
    showLabel: boolean;
    width: number;
    height: number;
    border: boolean;
    fill: string;
    align?: Alignment;
    fixed: boolean;
    x: number;
    y: number;
    z: number;
    focusable: boolean;
    hasFocus: boolean;
    transparentChar: string;
    protected buffer: string[][];
    private unbindFns;
    parent?: Component;
    constructor(props: ComponentProps);
    setParent(parent: Component): void;
    bind<T>(state: State<T>, apply: (val: T) => void): void;
    destroy(): void;
    handleEvent(event: string): boolean;
    draw(): string[][];
}
