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
 * prject-name
 * vanilla
 * Typescript

```bash
cd <project_name>
npm install asciitorium
npm install --save-dev prettier
npm install --save-dev @vitejs/plugin-vue-jsx
```

Update tsconfig, add:

```json
    add --> "jsx": "preserve",
    remove --> "erasableSyntaxOnly": true,
```

* update index.html to point to main.tsx instead of main.ts.

* Rename main.ts to main.tsx.

Replace main.ts contents with:

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
