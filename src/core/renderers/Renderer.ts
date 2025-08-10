/**
 * An interface for rendering a 2D array of strings to some output.
 */
export interface Renderer {
  render(buffer: string[][]): void;
}
