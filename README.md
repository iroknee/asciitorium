```text
                _ _ _             _
  __ _ ___  ___(_|_) |_ ___  _ __(_)_   _ _ __ ___
 / _` / __|/ __| | | __/ _ \| '__| | | | | '_ ` _ \
| (_| \__ \ (__| | | || (_) | |  | | |_| | | | | | |
 \__,_|___/\___|_|_|\__\___/|_|  |_|\__,_|_| |_| |_|
```

**asciitorium** is a ui framework for building retro terminal interfaces that fully function in the browser as well as the terminal. Why? I am still not sure :). But it started with wanting to create a text based game reminisent of Wizardy I, Zork or Bards Tale that I played in the 80s as a kid. I put loads of hours into those games, enjoying their storyline, puzzles, and challenges, and very few games I play these days are similar. I started developing it, and I realized it would be fun to create a ui framework while I was at it. Given my experience with React, I felt I could further explore what a 1982 ascii interface could have been like had we had more modern design principles. So here is that first pass.

### So what can it be used for?

- Terminal-style web apps
- ASCII dashboards
- Text-driven games
- BBS-inspired experiments

## Features

- Support for TypeScript
- Works in both **Web** and **CLI** (DOM or stdout)
- Built-in components
- Reactive `State<T>` system for live updates
- Custom JSX runtime (like React, minus baggage)

## Installation

```bash
npm install asciitorium
```

or if you prefer `pnpm`:

```bash
pnpm install asciitorium
```

## Hello World (Web Demo)

main.tsx

```tsx
import {
  Asciitorium,
  HorizontalLine,
  Text,
  TextInput,
  State,
  bootstrap,
} from 'asciitorium';

const reactiveState = new State('Say Hello!');

const app = (
  <Asciitorium width={64} height={16}>
    <Text value="a ui for cli" align="center" />
    <HorizontalLine align="center" />
    <TextInput value={reactiveState} width={32} align="center" border />
    <Text value={reactiveState} border width={32} align="center" />
  </Asciitorium>
);

await bootstrap(app);
```

index.html

```html
<!-- index.html -->
<!doctype html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <title>asciitorium</title>
    <link rel="stylesheet" href="index.css" />
  </head>
  <body>
    <pre id="screen">Loading...</pre>
    <script type="module" src="/src/main.tsx"></script>
  </body>
</html>
```

---

## Local Development

```bash
git clone https://github.com/tgruby/asciitorium
cd asciitorium
pnpm install
```

### Run web demo

```bash
pnpm start:web
```

### Run terminal demo

```bash
pnpm start:cli
```

### Build it all

```bash
pnpm build
```

### Format with Prettier

```bash
pnpm format
```

## License

MIT
