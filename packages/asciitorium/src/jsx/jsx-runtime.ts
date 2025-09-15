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
export function jsx(type: any, props: any, _key?: string): any {
  if (props?.children) {
    // Flatten children if they're an array of arrays
    props.children = Array.isArray(props.children)
      ? props.children.flat()
      : [props.children];
  }

  // Check if it's a function component (not a class constructor)
  if (typeof type === 'function' && !type.prototype?.constructor) {
    return type(props); // Call as function
  }
  
  return new type(props); // Instantiate as class
}

export const jsxs = jsx;
export const jsxDEV = jsx;

// Fragment component for <> </> syntax
export { Fragment } from '../components/Fragment';