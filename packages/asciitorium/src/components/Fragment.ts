import { Component, ComponentProps } from '../core/Component';

/**
 * Properties for Fragment component
 */
export interface FragmentProps extends ComponentProps {}

/**
 * Fragment component that acts as an invisible container for grouping child components.
 *
 * Similar to React Fragment, this component renders its children without adding any
 * visual elements like borders or backgrounds. It's useful for grouping components
 * without affecting the layout structure.
 *
 * Example usage:
 * ```tsx
 * <Fragment>
 *   <Text content="First item" />
 *   <Text content="Second item" />
 * </Fragment>
 *
 * // Or using the shorthand syntax:
 * <>
 *   <Text content="First item" />
 *   <Text content="Second item" />
 * </>
 * ```
 */
export class Fragment extends Component {
  constructor(props: FragmentProps) {
    super({
      width: 'fill',
      height: 'auto',
      ...props,
      border: false,
      fill: undefined,
    });
    this.focusable = false;
  }

  /**
   * Fragment renders completely transparently - only its children are visible.
   * The Fragment itself adds no visual elements.
   */
  draw(): string[][] {
    // Recalculate layout to ensure children are properly positioned
    this.recalculateLayout();

    // If no children, return minimal buffer
    if (this.children.length === 0) {
      return [[' ']];
    }

    // Create buffer and fill with transparent character
    this.buffer = Array.from({ length: this.height }, () =>
      Array.from({ length: this.width }, () => this.transparentChar)
    );

    // Sort children by z-index (lower values render first, higher on top)
    const sorted = [...this.children].sort((a, b) => a.z - b.z);

    // Render each child into our buffer
    for (const child of sorted) {
      const childBuffer = child.draw();

      for (let j = 0; j < childBuffer.length; j++) {
        for (let i = 0; i < childBuffer[j].length; i++) {
          const px = child.x + i;
          const py = child.y + j;

          if (px >= 0 && px < this.width && py >= 0 && py < this.height) {
            const char = childBuffer[j][i];
            if (char !== child.transparentChar) {
              this.buffer[py][px] = char;
            }
          }
        }
      }
    }

    return this.buffer;
  }
}