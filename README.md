# asciitorium

### An ASCII-Based UI Framework for Web & CLI

**asciitorium** is a lightweight UI framework built with TypeScript that lets you build retro-style terminal interfaces for the web or command line. Inspired by old-school green terminals and BBS UIs, it uses raw `<pre>` blocks and styled HTML spans — no virtual DOM, no frameworks, just characters.

You can use asciitorium to create:

- ASCII games
- Text-based dashboards
- Terminal-style apps in the browser
- Retro-styled experiments

---

## ✨ Features

- Pure TypeScript – no framework dependencies
- Lightweight `<pre>`-based rendering
- Web or CLI rendering (DOM + Terminal)
- Built-in components: `Text`, `Button`, `ListBox`, `ProgressBar`, `AsciiArt`, `Tabs`, and more
- Stateful rendering with reactive `State<T>`
- Custom JSX runtime support for declarative UI

---

## 🚀 Installation

```bash
npm install asciitorium
```

or with pnpm:

```bash
pnpm install asciitorium
```

---

## Minimal Example

Here’s a quick web example that mounts a small ASCII UI into a browser page:

```ts
import {
  App,
  Text,
  Button,
  TextInput,
  State,
  DomRenderer
} from 'asciitorium';

const screen = document.getElementById('screen')!;
screen.style.fontFamily = 'monospace';

const message = new State("Hello world!");

const app = (
  <App width={50} height={10} renderer={new DomRenderer(screen)}>
    <Text value="What's your name?" align="top" />
    <TextInput text={message} align="center" />
    <Button name="Greet" align="bottom" onClick={() => alert(`Hi ${message.value}`)} />
  </App>
);

window.addEventListener('keydown', (e) => app.handleKey(e.key));
```

And in your index.html:

```html
<!doctype html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <title>asciitorium</title>
    <link rel="stylesheet" href="index.css" />
  </head>
  <body>
    <pre id="screen">Loading...</pre>
    <script type="module" src="/src/index.tsx"></script>
  </body>
</html>
```

---

## Development Setup (For Contributors / Demos)

Clone & Install

```bash
git clone https://github.com/tgruby/asciitorium
cd asciitorium
pnpm install
```

Run Web Demo

```bash
pnpm start:web
```

Run CLI Demo

```bash
pnpm start:cli
```

Build code

```bash
pnpm build
```

Prettier Format Code

```bash
pnpm format
```

## License

MIT — free to use, build, and share.

---

## 🤖 Inspired By

- my 1982 Apple ][ computer
- Wizardy I
- FIGlet
