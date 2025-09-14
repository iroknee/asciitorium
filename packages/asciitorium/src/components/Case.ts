import { Component } from "../core/Component";

export class Case extends Component {
  public when: string;
  private _child: Component | (() => Component);

  constructor(opts: { when: string; children?: Component | (() => Component) | Component[] }) {
    super({});
    this.when = opts.when;
    // Handle both single child and array of children
    if (Array.isArray(opts.children)) {
      this._child = opts.children[0]; // Take first child if array
    } else {
      this._child = opts.children!;
    }
  }
  getChild() {
    return typeof this._child === 'function'
      ? (this._child as () => Component)()
      : this._child;
  }
}
