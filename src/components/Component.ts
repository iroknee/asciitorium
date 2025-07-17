export abstract class Component {
  abstract readonly width: number;
  abstract readonly height: number;

  focusable: boolean = false;
  hasFocus: boolean = false;

  protected children: Component[] = [];

  // Override in subclasses to provide rendering logic
  abstract draw(): string;

  // Override for interactive components to listen for events and respond
  handleEvent(event: string): boolean {
    return false;
  }

  // Add a child component
  addChild(child: Component): void {
    this.children.push(child);
  }

  // Get all focusable descendants (including children of children)
  getFocusableDescendants(): Component[] {
    const focusables: Component[] = [];
    for (const child of this.children) {
      if (child.focusable) {
        focusables.push(child);
      }
      focusables.push(...child.getFocusableDescendants());
    }
    return focusables;
  }

  // Expose children if needed for layout
  getChildren(): Component[] {
    return this.children;
  }
}