import { Component, ComponentProps } from '../Component';

/** Props shared by all layout components */
export interface LayoutProps extends ComponentProps {
  children?: Component[];
}
export abstract class Layout extends Component {
  protected children: Component[] = [];

  constructor(props: LayoutProps) {
    super(props);
  }

  public addChild(child: Component): void {
    this.children.push(child);
    this.recalculateLayout();
    this.dirty = true;
  }

  public removeChild(child: Component): void {
    const index = this.children.indexOf(child);
    if (index !== -1) {
      this.children.splice(index, 1);
      this.recalculateLayout();
      this.dirty = true;
    }
  }

  public getChildren(): Component[] {
    return this.children;
  }

  protected abstract recalculateLayout(): void;

  override draw(): string[][] {
    const needsRedraw = this.children.some((c) => c.dirty);
    if (needsRedraw) this.dirty = true;

    if (this.dirty) {
      this.recalculateLayout();
      super.draw();

      const sorted = [...this.children].sort((a, b) => a.z - b.z);
      for (const child of sorted) {
        const buf = child.draw();
        for (let j = 0; j < buf.length; j++) {
          for (let i = 0; i < buf[j].length; i++) {
            const px = child.x + i;
            const py = child.y + j;
            if (px >= 0 && px < this.width && py >= 0 && py < this.height) {
              this.buffer[py][px] = buf[j][i];
            }
          }
        }
      }

      this.dirty = false;
    }

    return this.buffer;
  }

  public getAllDescendants(): Component[] {
    const result: Component[] = [];

    for (const child of this.children) {
      result.push(child);
      if (typeof (child as any).getAllDescendants === 'function') {
        const grandChildren = (child as any).getAllDescendants();
        result.push(...grandChildren);
      }
    }

    return result;
  }
}
