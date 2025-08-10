let I = null;
function C(h) {
  I = h;
}
function M() {
  I?.();
}
async function P(h) {
  if (typeof window < "u" && typeof document < "u") {
    const t = document.getElementById("screen");
    if (!t) throw new Error("Missing #screen element for DOM renderer");
    t.style.fontFamily = "PrintChar21", window.addEventListener("keydown", (e) => {
      h.handleKey(e.key);
    });
  } else {
    const { default: t } = await import("readline");
    t.emitKeypressEvents(process.stdin), process.stdin.isTTY && process.stdin.setRawMode(!0), process.stdin.on("keypress", (e, s) => {
      const r = F(s);
      h.handleKey(r);
    });
  }
  C(() => h.render());
}
function F(h) {
  if (!h) return "";
  switch (h.ctrl && h.name === "c" && process.exit(), h.name) {
    case "return":
      return "Enter";
    case "escape":
      return "Escape";
    case "backspace":
      return "Backspace";
    case "tab":
      return "Tab";
    case "up":
      return "ArrowUp";
    case "down":
      return "ArrowDown";
    case "left":
      return "ArrowLeft";
    case "right":
      return "ArrowRight";
    default:
      return h.sequence || "";
  }
}
class u {
  constructor(t) {
    if (this.showLabel = !0, this.fixed = !1, this.x = 0, this.y = 0, this.z = 0, this.focusable = !1, this.hasFocus = !1, this.transparentChar = "‽", this.unbindFns = [], t.width < 1) throw new Error("Component width must be > 0");
    if (t.height < 1) throw new Error("Component height must be > 0");
    this.width = t.width, this.height = t.height, this.label = t.label, this.showLabel = t.showLabel ?? !0, this.border = t.border ?? !1, this.fill = t.fill ?? " ", this.align = t.align, this.fixed = t.fixed ?? !1, this.x = t.x ?? 0, this.y = t.y ?? 0, this.z = t.z ?? 0, this.buffer = [];
  }
  setParent(t) {
    this.parent = t;
  }
  bind(t, e) {
    const s = (r) => {
      e(r);
    };
    t.subscribe(s), this.unbindFns.push(() => t.unsubscribe(s));
  }
  destroy() {
    for (const t of this.unbindFns) t();
    this.unbindFns = [];
  }
  handleEvent(t) {
    return !1;
  }
  draw() {
    this.buffer = Array.from(
      { length: this.height },
      () => Array.from(
        { length: this.width },
        () => this.fill === this.transparentChar ? "‽" : this.fill
      )
    );
    const t = (e, s, r) => {
      e >= 0 && e < this.width && s >= 0 && s < this.height && (this.buffer[s][e] = r);
    };
    if (this.border) {
      const e = this.width, s = this.height;
      t(0, 0, "╭"), t(e - 1, 0, "╮"), t(0, s - 1, "╰"), t(e - 1, s - 1, "╯");
      for (let r = 1; r < e - 1; r++)
        t(r, 0, "─"), t(r, s - 1, "─");
      for (let r = 1; r < s - 1; r++)
        t(0, r, "│"), t(e - 1, r, "│");
    }
    if (this.label && this.showLabel) {
      const e = ` ${this.label} `, s = 1;
      for (let r = 0; r < e.length && r + s < this.width - 1; r++)
        t(r + s, 0, e[r]);
    }
    return this.buffer;
  }
}
class w extends u {
  constructor(t) {
    super(t), this.children = [];
  }
  addChild(t) {
    t.setParent(this), this.children.push(t), this.recalculateLayout();
  }
  removeChild(t) {
    const e = this.children.indexOf(t);
    e !== -1 && (this.children.splice(e, 1), this.recalculateLayout());
  }
  getChildren() {
    return this.children;
  }
  draw() {
    this.recalculateLayout(), super.draw();
    const t = [...this.children].sort((e, s) => e.z - s.z);
    for (const e of t) {
      const s = e.draw();
      for (let r = 0; r < s.length; r++)
        for (let n = 0; n < s[r].length; n++) {
          const i = e.x + n, o = e.y + r;
          i >= 0 && i < this.width && o >= 0 && o < this.height && (this.buffer[o][i] = s[r][n]);
        }
    }
    return this.buffer;
  }
  getAllDescendants() {
    const t = [];
    for (const e of this.children)
      if (t.push(e), typeof e.getAllDescendants == "function") {
        const s = e.getAllDescendants();
        t.push(...s);
      }
    return t;
  }
}
function p(h, t, e, s, r) {
  let n = "left", i = "top";
  if (typeof h == "string")
    switch (h) {
      case "top-left":
        i = "top", n = "left";
        break;
      case "top":
        i = "top", n = "center";
        break;
      case "top-right":
        i = "top", n = "right";
        break;
      case "left":
        i = "middle", n = "left";
        break;
      case "center":
        i = "middle", n = "center";
        break;
      case "right":
        i = "middle", n = "right";
        break;
      case "bottom-left":
        i = "bottom", n = "left";
        break;
      case "bottom":
        i = "bottom", n = "center";
        break;
      case "bottom-right":
        i = "bottom", n = "right";
        break;
      default:
        i = "top", n = "left";
        break;
    }
  else typeof h == "object" && h !== null && (n = h.x ?? "left", i = h.y ?? "top");
  const o = t - s, l = e - r;
  let c;
  typeof n == "number" ? c = n : n === "center" ? c = Math.floor(o / 2) : n === "right" ? c = o : c = 0;
  let a;
  return typeof i == "number" ? a = i : i === "middle" ? a = Math.floor(l / 2) : i === "bottom" ? a = l : a = 0, { x: c, y: a };
}
function m(h) {
  return typeof h == "object" && typeof h.subscribe == "function";
}
class A extends w {
  constructor(t) {
    super(t), this.fit = t.fit ?? !1;
  }
  recalculateLayout() {
    const t = this.border ? 1 : 0, e = this.width - 2 * t, s = this.height - 2 * t, r = this.children.length;
    let n = t;
    for (const i of this.children) {
      if (i.fixed)
        continue;
      this.fit && r > 0 && (i.height = Math.floor(s / r)), i.width || (i.width = e);
      const { x: o } = p(
        i.align,
        e,
        i.height,
        i.width,
        i.height
      );
      i.x = t + o, i.y = n, n += i.height;
    }
  }
}
class S {
  constructor() {
    this.contextStack = [], this.index = 0;
  }
  pushContext(t) {
    this.clearFocus();
    const e = t.filter((s) => s.focusable);
    this.contextStack.push(e), this.index = 0, this.setFocus(0);
  }
  popContext() {
    this.clearFocus(), this.contextStack.pop(), this.index = 0, this.setFocus(0);
  }
  get currentContext() {
    return this.contextStack[this.contextStack.length - 1] || [];
  }
  setFocus(t) {
    this.index = t;
    const e = this.currentContext[this.index];
    e && (e.hasFocus = !0);
  }
  clearFocus() {
    const t = this.currentContext[this.index];
    t && (t.hasFocus = !1);
  }
  focusNext() {
    this.currentContext.length !== 0 && (this.clearFocus(), this.index = (this.index + 1) % this.currentContext.length, this.setFocus(this.index));
  }
  // TODO: this doesn't work, still goes forward
  focusPrevious() {
    this.currentContext.length !== 0 && (this.clearFocus(), this.index = (this.index - 1 + this.currentContext.length) % this.currentContext.length, this.setFocus(this.index));
  }
  handleKey(t) {
    return this.currentContext[this.index]?.handleEvent?.(t) ?? !1;
  }
  reset(t) {
    const e = this.getFocusableDescendants(t).filter(
      (s) => s.focusable
    );
    this.contextStack = [e], this.index = 0, this.setFocus(0);
  }
  getFocusableDescendants(t) {
    const e = [];
    for (const s of t.getChildren())
      s.focusable && e.push(s), s instanceof w && e.push(...this.getFocusableDescendants(s));
    return e;
  }
}
class v {
  constructor(t) {
    this.screen = t, this.screen.style.whiteSpace = "pre";
  }
  render(t) {
    this.screen.textContent = t.map((e) => e.join("")).join(`
`);
  }
}
class L {
  render(t) {
    const e = t.map((s) => s.join("")).join(`
`);
    process.stdout.write("\x1Bc"), process.stdout.write(e + `
`);
  }
}
class B extends A {
  constructor(t) {
    super(t), this.fpsCounter = 0, this.totalRenderTime = 0, this.renderer = k(), this.focus = new S();
    const e = Array.isArray(t.children) ? t.children : t.children ? [t.children] : [];
    for (const s of e)
      super.addChild(s);
    this.focus.reset(this), this.render(), setInterval(() => {
      this.fpsCounter > 0 && this.renderer instanceof v && console.log(
        `FPS: ${this.fpsCounter}, total render time: ${this.totalRenderTime.toFixed(2)} ms`
      ), this.fpsCounter = 0, this.totalRenderTime = 0;
    }, 1e3);
  }
  render() {
    const t = typeof performance < "u" && performance.now ? performance.now() : Date.now();
    this.fpsCounter++;
    const e = Array.from(
      { length: this.height },
      () => Array.from({ length: this.width }, () => " ")
    ), s = this.getAllDescendants().concat([this]);
    s.sort((n, i) => (n.z ?? 0) - (i.z ?? 0));
    for (const n of s) {
      const i = n.draw(), o = n.x, l = n.y, c = n.transparentChar;
      for (let a = 0; a < i.length; a++) {
        const d = l + a;
        if (!(d < 0 || d >= this.height))
          for (let f = 0; f < i[a].length; f++) {
            const b = o + f;
            if (b < 0 || b >= this.width) continue;
            const x = i[a][f];
            x !== c && (e[d][b] = x);
          }
      }
    }
    this.renderer.render(e);
    const r = typeof performance < "u" && performance.now ? performance.now() : Date.now();
    this.totalRenderTime += r - t;
  }
  addChild(t) {
    super.addChild(t), this.focus?.reset(this), this.render();
  }
  removeChild(t) {
    super.removeChild(t), this.focus.reset(this), this.render();
  }
  handleKey(t) {
    if (t === "Tab") {
      this.focus.focusNext(), this.render(), event?.preventDefault();
      return;
    }
    if (t === "Shift") {
      this.focus.focusPrevious(), this.render(), event?.preventDefault();
      return;
    }
    this.focus.handleKey(t) && this.render();
  }
}
function k() {
  if (typeof window < "u" && typeof document < "u") {
    const h = document.getElementById("screen");
    if (!h) throw new Error("No #screen element found for DOM rendering");
    return new v(h);
  } else
    return new L();
}
class E {
  constructor(t) {
    this.listeners = [], this._value = t;
  }
  get value() {
    return this._value;
  }
  set value(t) {
    this._value !== t && (this._value = t, this.listeners.forEach((e) => e(t)));
  }
  subscribe(t) {
    this.listeners.push(t), t(this._value);
  }
  unsubscribe(t) {
    this.listeners = this.listeners.filter((e) => e !== t);
  }
}
class W extends w {
  constructor(t) {
    super(t), this.fit = t.fit ?? !1;
    const e = Array.isArray(t.children) ? t.children : t.children ? [t.children] : [];
    for (const s of e)
      this.addChild(s);
  }
  recalculateLayout() {
    const t = this.border ? 1 : 0, e = this.height - 2 * t, s = this.width - 2 * t, r = this.children.length;
    let n = t;
    for (const i of this.children) {
      if (i.fixed) continue;
      this.fit && r > 0 && (i.width = Math.floor(s / r)), i.height || (i.height = e);
      const { y: o } = p(
        i.align,
        i.width,
        e,
        i.width,
        i.height
      );
      i.x = n, i.y = t + o, n += i.width;
    }
  }
}
class z extends u {
  constructor(t) {
    const e = T(t.content), s = e[0] ?? [[" "]], r = Math.max(1, ...s.map((o) => o.length)), n = Math.max(1, s.length), i = t.border ? 2 : 0;
    if (super({
      ...t,
      width: t.width ?? r + i,
      height: t.height ?? n + i
    }), this.frames = [], this.frameIndex = 0, this.loop = !0, this.rawContent = t.content, this.frames = e, this.loop = t.loop ?? !0, this.frames.length > 1) {
      const o = t.frameDurationMs ?? 250;
      this.animationInterval = setInterval(() => {
        this.frameIndex++, this.frameIndex >= this.frames.length && (this.loop ? this.frameIndex = 0 : (this.frameIndex = this.frames.length - 1, clearInterval(this.animationInterval))), M();
      }, o);
    }
  }
  destroy() {
    super.destroy(), this.animationInterval && clearInterval(this.animationInterval);
  }
  draw() {
    const t = super.draw(), e = this.border ? 1 : 0, s = this.border ? 1 : 0, r = this.width - (this.border ? 2 : 0), n = this.height - (this.border ? 2 : 0), i = this.frames[this.frameIndex];
    if (!i) return t;
    for (let o = 0; o < Math.min(i.length, n); o++) {
      const l = i[o];
      for (let c = 0; c < Math.min(l.length, r); c++)
        t[o + s][c + e] = l[c];
    }
    return this.buffer = t, t;
  }
}
function T(h, t = "↲") {
  return (h.includes(t) ? h.split(t) : [h]).map((s) => {
    const r = s.split(`
`).map((n) => [...n.replace(/\r$/, "")]);
    return r[0].length === 0 && r.shift(), r;
  });
}
class H extends u {
  constructor({ onClick: t, ...e }) {
    const s = e.label ?? "Button", r = !1, n = e.width ?? s.length + 6, i = e.height ?? 3, o = e.border ?? !0;
    super({ ...e, width: n, height: i, border: o, label: s, showLabel: r }), this.focusable = !0, this.hasFocus = !1, this.onClick = t;
  }
  handleEvent(t) {
    return t === "Enter" || t === " " ? (this.onClick?.(), !0) : !1;
  }
  draw() {
    const t = super.draw(), e = this.border ? 1 : 0, s = this.border ? 1 : 0, r = this.width - e * 2, n = this.height - s * 2, i = this.label ?? "Button", o = e + Math.max(Math.floor((r - i.length) / 2), 0), l = s + Math.floor(n / 2);
    for (let c = 0; c < i.length && o + c < this.width - e; c++)
      t[l][o + c] = i[c];
    if (this.hasFocus) {
      const c = e;
      t[l][c] = ">";
    }
    return this.buffer = t, t;
  }
}
const D = {
  topLeft: ["╭⎯╮╭⎯⎯⎯⎯⎯", "⏐╭⎯⎯⎯⎯", "╰⎯⏐╯", "╭⏐╯", "⏐⏐", "⏐⏐", "⏐", "⏐"],
  topRight: [
    "⎯⎯⎯⎯╮╭⎯╮",
    " ⎯⎯⎯⎯⎯╮⏐",
    "    ╰⏐⎯╯",
    "     ╰⏐╮",
    "      ⏐⏐",
    "      ⏐⏐",
    "       ⏐",
    "       ⏐"
  ],
  bottomLeft: ["⏐", "⏐", "⏐⏐", "⏐⏐", "╰⏐╮", "╭⎯⏐╮", "⏐╰⎯⎯⎯⎯⎯", "╰⎯╯╰⎯⎯⎯⎯⎯"],
  bottomRight: [
    "       ⏐",
    "       ⏐",
    "      ⏐⏐",
    "      ⏐⏐",
    "     ╭⏐╯",
    "    ╭⏐⎯╮",
    "  ⎯⎯⎯⎯╯⏐",
    "⎯⎯⎯⎯╯╰⎯╯"
  ]
};
class $ extends u {
  constructor({ corner: t, ...e }) {
    const s = D[t], r = Math.max(...s.map((i) => i.length)), n = s.length;
    super({
      width: r,
      height: n,
      fill: " ",
      border: !1,
      ...e
    }), this.lines = s.map((i) => Array.from(i));
  }
  draw() {
    return this.buffer = Array.from(
      { length: this.height },
      (t, e) => Array.from({ length: this.width }, (s, r) => this.lines[e]?.[r] ?? " ")
    ), this.buffer;
  }
}
class j extends u {
  constructor(t) {
    const e = t.length ?? 12;
    super({
      ...t,
      width: e,
      height: 1
      // Always one line tall
    });
  }
  draw() {
    super.draw();
    const t = "⎺", e = 0, s = this.border ? 1 : 0, r = this.border ? this.width - 1 : this.width;
    for (let n = s; n < r; n++)
      this.buffer[e][n] = t;
    return this.buffer;
  }
}
class K extends u {
  constructor(t) {
    const e = t.height ?? 8, s = t.border ?? !0;
    super({ ...t, height: e, border: s }), this.selectedIndex = 0, this.focusable = !0, this.hasFocus = !1, this.items = t.items, this.selectedItem = t.selectedItem, this.selectedIndex = Math.max(
      0,
      this.items.findIndex((r) => r === this.selectedItem.value)
    ), this.bind(this.selectedItem, (r) => {
      const n = this.items.indexOf(r);
      n !== -1 && n !== this.selectedIndex && (this.selectedIndex = n);
    });
  }
  handleEvent(t) {
    const e = this.selectedIndex;
    return (t === "ArrowUp" || t === "w") && this.selectedIndex > 0 ? this.selectedIndex-- : (t === "ArrowDown" || t === "s") && this.selectedIndex < this.items.length - 1 && this.selectedIndex++, this.selectedIndex !== e ? (this.selectedItem.value = this.items[this.selectedIndex], !0) : !1;
  }
  draw() {
    const t = super.draw(), e = this.border ? 1 : 0, s = 1, r = 1, n = this.height - 3 * e - s, i = Math.max(1, Math.floor(n / r)), o = this.items.length, l = Math.max(
      0,
      Math.min(
        this.selectedIndex - Math.floor(i / 2),
        Math.max(0, o - i)
      )
    ), c = this.items.slice(l, l + i);
    if (l > 0) {
      const a = e, d = this.width - 2;
      t[a][d] = "↑";
    }
    if (c.forEach((a, d) => {
      const f = e + s + d * r, b = e, y = `${l + d === this.selectedIndex && this.hasFocus ? ">" : " "} ${a}`.slice(0, this.width - 2 * e).padEnd(this.width - 2 * e, " ");
      for (let g = 0; g < y.length; g++)
        t[f][b + g] = y[g];
    }), l + i < o) {
      const a = this.height - 1 - e, d = this.width - 2;
      t[a][d] = "↓";
    }
    return this.buffer = t, t;
  }
}
class O extends u {
  constructor(t) {
    t.height = 3, t.border = !1, super(t), this.progress = 0, this.percentage = t.percentage ?? !1, this.durationMs = t.durationMs ?? 500, this.bind(t.progress, (e) => {
      this.animateTo(e, this.durationMs);
    });
  }
  animateTo(t, e = 500) {
    const s = Math.max(0, Math.min(1, t));
    this.animationInterval && clearInterval(this.animationInterval);
    const r = 30, n = e / r, i = this.progress;
    let o = 0;
    this.animationInterval = setInterval(() => {
      o++;
      const l = o / r;
      this.progress = i + (s - i) * l, o >= r && (clearInterval(this.animationInterval), this.progress = s);
    }, n);
  }
  draw() {
    const t = this.width ?? 10, e = t - 2, s = Math.round(this.progress * e), r = e - s;
    let n = "█".repeat(s) + " ".repeat(r);
    if (this.percentage) {
      const c = `${Math.round(this.progress * 100)}%`, a = Math.floor((e - c.length) / 2), d = n.slice(0, a), f = n.slice(a + c.length);
      n = (d + c + f).slice(0, e);
    }
    const i = " ⎽" + "⎽".repeat(Math.max(0, t - 3)), o = `⎹${n}⎸`, l = " " + "⎺".repeat(t - 2);
    return this.buffer = [i, o, l].map((c) => Array.from(c)), this.buffer;
  }
}
class X extends u {
  constructor(t) {
    const s = t.width ?? t.tabs.reduce((n, i) => n + i.length + 2, 2) + (t.tabs.length - 1), r = t.border ?? !0;
    super({ ...t, height: 3, width: s, border: r }), this.selectedIndex = 0, this.focusable = !0, this.hasFocus = !1, this.tabs = t.tabs, this.selectedTab = t.selectedTab, this.selectedIndex = Math.max(
      0,
      this.tabs.findIndex((n) => n === this.selectedTab.value)
    ), this.bind(this.selectedTab, (n) => {
      const i = this.tabs.indexOf(n);
      i !== -1 && i !== this.selectedIndex && (this.selectedIndex = i);
    });
  }
  handleEvent(t) {
    const e = this.selectedIndex;
    return (t === "ArrowLeft" || t === "a") && this.selectedIndex > 0 ? this.selectedIndex-- : (t === "ArrowRight" || t === "d") && this.selectedIndex < this.tabs.length - 1 && this.selectedIndex++, this.selectedIndex !== e ? (this.selectedTab.value = this.tabs[this.selectedIndex], !0) : !1;
  }
  draw() {
    const t = super.draw(), e = this.border ? 1 : 0, s = Math.floor(this.height / 2);
    let r = e;
    for (let n = 0; n < this.tabs.length; n++) {
      const i = this.tabs[n], l = n === this.selectedIndex && this.hasFocus ? `[${i}]` : ` ${i} `;
      for (let c = 0; c < l.length && r + c < this.width - e; c++)
        t[s][r + c] = l[c];
      r += l.length, n < this.tabs.length - 1 && r < this.width - e - 1 && (t[s][r] = "⏐", r += 1);
    }
    return this.buffer = t, t;
  }
}
class Y extends u {
  constructor(t) {
    const e = m(t.value) ? t.value.value : t.value, s = Math.max(1, String(e).length), r = t.border ? 2 : 0;
    super({
      ...t,
      width: t.width ?? s + r,
      height: t.height ?? 1 + (t.border ? 2 : 0)
    }), this.source = t.value, m(this.source) && this.source.subscribe(() => {
    });
  }
  get value() {
    return m(this.source) ? String(this.source.value) : String(this.source);
  }
  draw() {
    super.draw();
    const t = this.width - (this.border ? 2 : 0), e = this.height - (this.border ? 2 : 0), { x: s, y: r } = p(
      this.align,
      t,
      e,
      Math.min(this.value.length, t),
      1
    ), n = this.border ? s + 1 : s, i = this.border ? r + 1 : r;
    for (let o = 0; o < this.value.length && o + n < this.width; o++)
      this.buffer[i][n + o] = this.value[o];
    return this.buffer;
  }
}
class _ extends u {
  constructor(t) {
    const e = t.height ?? 3, s = t.border ?? !0;
    super({ ...t, height: e, border: s }), this.cursorIndex = 0, this.suppressCursorSync = !1, this.focusable = !0, this.hasFocus = !1, this.value = t.value ?? new E(""), this.placeholder = t.placeholder ?? "", this.bind(this.value, (r) => {
      this.suppressCursorSync || (this.cursorIndex = r.length);
    });
  }
  handleEvent(t) {
    let e = !1;
    const s = this.value.value;
    if (t.length === 1 && t >= " ") {
      const r = s.slice(0, this.cursorIndex), n = s.slice(this.cursorIndex);
      this.suppressCursorSync = !0, this.value.value = r + t + n, this.suppressCursorSync = !1, this.cursorIndex++, e = !0;
    } else if (t === "Backspace") {
      if (this.cursorIndex > 0) {
        const r = s.slice(0, this.cursorIndex - 1), n = s.slice(this.cursorIndex);
        this.suppressCursorSync = !0, this.value.value = r + n, this.suppressCursorSync = !1, this.cursorIndex--, e = !0;
      }
    } else t === "ArrowLeft" ? (this.cursorIndex = Math.max(0, this.cursorIndex - 1), e = !0) : t === "ArrowRight" && (this.cursorIndex = Math.min(s.length, this.cursorIndex + 1), e = !0);
    return !!e;
  }
  draw() {
    const t = super.draw(), e = this.hasFocus ? "> " : "  ", s = e.length, r = this.border ? 1 : 0, n = this.border ? 1 : 0, o = this.width - (this.border ? 2 : 0) - s, c = (this.value.value || this.placeholder).slice(0, o);
    for (let a = 0; a < s; a++)
      t[r][n + a] = e[a];
    for (let a = 0; a < c.length && a < o; a++)
      t[r][n + s + a] = c[a];
    if (this.hasFocus) {
      const a = Math.min(
        this.cursorIndex,
        c.length,
        o - 1
      );
      t[r][n + s + a] = "▉";
    }
    return this.buffer = t, t;
  }
}
export {
  z as AsciiArt,
  B as Asciitorium,
  H as Button,
  $ as CelticBorder,
  u as Component,
  W as HorizontalLayout,
  j as HorizontalLine,
  K as ListBox,
  O as ProgressBar,
  E as State,
  X as Tabs,
  Y as Text,
  _ as TextInput,
  A as VerticalLayout,
  P as bootstrap
};
