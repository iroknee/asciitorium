/**
 * JSX factory function to create elements.
 * This function is used by the JSX transpiler to convert JSX syntax into
 * calls to this function.
 *
 * @param type The component type (class or function).
 * @param props The properties passed to the component.
 * @param _key Optional key for the element (not used here).
 * @returns An instance of the component with the given props.
 */
export declare function jsx(type: any, props: any, _key?: string): any;
export declare const jsxs: typeof jsx;
export declare const jsxDEV: typeof jsx;
export declare const Fragment: () => never;
