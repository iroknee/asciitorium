/** ------------------------------------------------------------------------
 * Switch/Case primitives (optional JSX sugar via your runtime)
 * ---------------------------------------------------------------------- */

import { Component } from "../core/Component";
import { State } from "../core/State";
import { Case } from "./Case";

export interface SwitchProps {
  value: State<string> | string;
  fallback?: Component | (() => Component);
  children?: Case[]; // constructed via JSX runtime or by hand
}

export class Switch extends Component {
  private valueSub?: (v: string) => void;
  private value: string;

  constructor(private props2: SwitchProps) {
    super({});
    if ((props2.value as any)?.subscribe) {
      const s = props2.value as State<string>;
      this.value = s.value;
      const on = (v: string) => this.update(v);
      s.subscribe(on);
      this.valueSub = on;
      (this as any).unbindFns.push?.(() => s.unsubscribe(on));
      this.update(s.value);
    } else {
      this.value = props2.value as string;
      this.update(this.value);
    }
  }

  private update(val: string) {
    this.value = val;

    // Clear existing visible child(ren)
    const toRemove = [...this.getChildren()];
    for (const c of toRemove) {
      c.destroy();
      this.removeChild(c);
    }

    const cases = (this.props2.children ?? []) as Case[];
    const match = cases.find((c) => c.when === val)?.getChild();
    const child =
      match ??
      (typeof this.props2.fallback === 'function'
        ? (this.props2.fallback as () => Component)()
        : this.props2.fallback);

    if (child) this.addChild(child);

    this.notifyAppOfFocusRefresh();
  }
}
