# asciitorium

This mono-repo contains the source code for **asciitorium**, an ASCII-based ui framework that runs in both the web and cli, along with related tooling such as the `create-asciitorium` project scaffolder.

![example](asciitorium.png)

---

## 📦 Packages

### [`asciitorium`](packages/asciitorium)

A TypeScript-based UI framework for building retro-style terminal interfaces.  
It uses `<pre>` blocks and styled spans in the browser, and a terminal renderer for cli apps.  
Includes a custom JSX runtime so you can write components similar to React.

**Installation:**
```bash
npm install asciitorium
```

Key features:

- Works in both Web (DOM) and CLI (Terminal)
- Pure TypeScript, lightweight, no external framework dependencies
- Built-in components (`Text`, `Button`, `ListBox`, `ProgressBar`, etc.)
- Stateful rendering with reactive `State<T>`
- Custom JSX runtime for declarative UI

See the [package README](packages/asciitorium/README.md) for full usage details.

---

### [`create-asciitorium`](packages/create-asciitorium)

A CLI tool to scaffold new projects using **asciitorium** with **Vite + TypeScript** preconfigured.

Usage:

```bash
# Create a new project
npm create asciitorium my-app

# Move into your new project
cd my-app

# Install
npm install

# Start the dev server (web)
npm run web

# Run in the terminal (CLI)
npm run cli
```

---

## 🛠 Development

This repo uses **npm** workspaces.

### Install dependencies

```bash
npm install
```

### Build all packages

```bash
npm run build --workspaces
```

### Work on a specific package

```bash
# Build only the core library
npm run build --workspace=asciitorium

# Run the asciitorium demo in web mode
cd packages/asciitorium && npm run web

# Run the asciitorium demo in CLI mode
cd packages/asciitorium && npm run cli
```

---

## 📂 Monorepo Structure

```bash
packages/
├──asciitorium/        # The core UI framework
└──create-asciitorium/ # CLI to scaffold new projects
package.json           # Root scripts and workspace configuration
```

---

## 📄 License

This repository is licensed under the MIT License. See the [LICENSE](packages/asciitorium/LICENSE) file for details.
