# asciitorium

**asciitorium** is a ui framework for building retro terminal interfaces that fully function in the browser as well as the terminal. Why? I am still not sure :). But it started with wanting to create a text based game reminisent of Wizardy I, Zork or Bards Tale from the 80s. I realized it would be fun to create a ui framework while I was at it. Given my experience with React. Here is that first pass.

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

## Creating an asciitorium app

## Setup

```bash
npm create vite@latest
```

supply:

- prject-name
- vanilla
- Typescript

```bash
cd <project_name>
npm install asciitorium
npm install --save-dev prettier
npm install --save-dev @vitejs/plugin-vue-jsx
```

create a vite.config.ts:

```js
export default {
  // ...existing config...
  esbuild: {
    jsxImportSource: 'asciitorium',
  },
};
```

Update tsconfig, add:

```json
    "jsx": "react-jsx",  // <-- add
    "erasableSyntaxOnly": true, // <-- remove
```

- update index.html:

```html
<!doctype html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <title>asciitorium</title>
    <style>
      body {
        margin: 0;
        background: black;
        color: #3fff00;

        /* Center the screen horizontally */
        display: flex;
        justify-content: center;
        height: 100vh; /* Full viewport height */
      }
    </style>
  </head>
  <body>
    <pre id="screen">Loading...</pre>
    <script type="module" src="/src/main.tsx"></script>
  </body>
</html>
```

create a new main.tsx with:

```jsx
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

### run

on web:

```bash
npm run dev
```

on cli:

```bash
tsx src/main.tsx
```

## License

MIT
