# asciitorium

This mono-repo contains the source code for **asciitorium**, an ASCII-based ui framework that runs in both the web and cli, along with related tooling such as the `create-asciitorium` project scaffolder.

![example](asciitorium.png)

---

## 📦 Packages

### [`asciitorium`](packages/asciitorium)

A TypeScript-based UI framework for building retro-style terminal interfaces.  
It uses `<pre>` blocks and styled spans in the browser, and a terminal renderer for cli apps.  
Includes a custom JSX runtime so you can write components similar to React.

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
npm -r build
```

### Run a package in dev mode

```bash
npm --filter <package-name> dev
```

Example:

```bash
npm --filter asciitorium dev
```

---

## 📂 Monorepo Structure

```bash
packages/
├──asciitorium/        # The core UI framework
└──create-asciitorium/ # CLI to scaffold new projects
pnpm-workspace.yaml    # Workspace configuration
package.json           # Root scripts and settings
```

---

## 📄 License

This repository is licensed under the MIT License. See the [LICENSE](packages/asciitorium/LICENSE) file for details.
