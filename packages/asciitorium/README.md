# asciitorium

**asciitorium** is a UI framework for building retro terminal interfaces that fully function in the browser as well as the terminal.  
Why? I am still not sure 🙂. But it started with wanting to create a text-based game reminiscent of **Wizardry I**, **Zork**, and **Bard's Tale** from the 80s. I realized it would be fun to create a UI framework while I was at it — given my experience with React, here is that first pass.

## So what can it be used for?

- Terminal-style web apps
- ASCII dashboards
- Text-driven games
- BBS-inspired experiments

## Features

- Support for TypeScript
- Works in both **Web** and **CLI** (DOM or stdout)
- Built-in components
- Reactive `State<T>` system for live updates
- Custom JSX runtime (like React, minus the baggage)

---

## 🚀 Developing

### 1️⃣ Install dependencies

```bash
pnpm install
```

### 2️⃣ Run in the browser (Web mode)

```bash
pnpm start:web
```

- Starts the Vite dev server
- Open your browser at **http://localhost:5173** (or the port Vite displays)
- Uses the `DomRenderer` to draw into a `<pre>` block

### 3️⃣ Run in the terminal (CLI mode)

```bash
pnpm start:cli
```

- Renders directly to stdout
- Uses the `TerminalRenderer` for an interactive terminal UI

### 4️⃣ Build for production

```bash
pnpm build
```

- Builds both the browser bundle and TypeScript definitions

### 5️⃣ Preview the production build

```bash
pnpm preview
```

- Serves the `dist/` output locally using Vite

### 6️⃣ Format the code

```bash
pnpm format
```

- Runs Prettier across the entire project

### 7️⃣ Generate FIGlet ASCII art assets

```bash
pnpm art FIGlet-font-name "phrase" 
```

- Runs the `scripts/generate-art.js` tool to build `.txt` ASCII art files

To list available FIGlet fonts:

```bash
pnpm art:fonts
```

---

## 📂 Project Structure

```txt
asciitorium/
├── src/              # Core source code
├── public/           # Static assets (images, favicon, ascii art)
├── scripts/          # Helper scripts (e.g., ASCII art generator)
├── package.json
└── README.md
```

---

## 📜 License

MIT
