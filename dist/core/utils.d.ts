import type { Alignment } from './types';
import { State } from './State';
export declare function resolveAlignment(align: Alignment | undefined, parentWidth: number, parentHeight: number, childWidth: number, childHeight: number): {
    x: number;
    y: number;
};
export declare function isState<T>(v: any): v is State<T>;
export declare function loadAsciiAsset(relativePath: string): Promise<string>;
