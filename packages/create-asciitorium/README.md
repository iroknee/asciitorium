# create-asciitorium

`create-asciitorium` is a command-line tool that helps you quickly scaffold a new [asciitorium](https://github.com/iroknee/asciitorium) project. It sets up all the necessary files, folders, and dependencies so you can start building ASCII art-based web applications with minimal setup.

## Features

- Interactive CLI for project setup
- Generates a ready-to-use asciitorium project structure
- Installs dependencies automatically
- Supports TypeScript and Vite
- Includes example code and assets

## Getting Started

### Installation

The recommended way to start a new project is with the npm create command:

```bash
npm create asciitorium@latest my-app
```

This will create a new directory with the specified project name, scaffold the project, and install dependencies.

### Next Steps

After creating your project:

```bash
cd my-app

# Start development server (web mode)
npm run web

# Run in terminal mode
npm run cli

# Build for production
npm run build
```

### Other Scripts

Generate FIGlet ASCII art assets (placed in public/art):

```bash
npm run figlet font "a phrase"
```

List available FIGlet fonts:

```bash
npm run figlet:fonts
```

Generate ASCII maze files (placed in public/art/mazes):

```bash
node scripts/maze-builder.js <width> <height> <filename> [--smooth]

# Examples:
node scripts/maze-builder.js 10 10 dungeon-level-1.txt
node scripts/maze-builder.js 15 20 castle-maze.txt --smooth
```

The `--smooth` flag uses Unicode box drawing characters for improved visual appearance.

## Generated Project Structure

A typical generated project will look like:

```
my-asciitorium-app/
  ├── public/
  │   ├── art/
  │   │   └── mazes/        # Generated maze files
  │   └── fonts/            # Custom fonts
  ├── scripts/
  │   ├── gen-figlet-art.js # FIGlet art generator
  │   └── maze-builder.js   # ASCII maze generator
  ├── src/
  │   ├── main.tsx          # Main application entry
  │   └── vite-env.d.ts     # TypeScript definitions
  ├── index.html            # HTML template
  ├── package.json          # Dependencies and scripts
  ├── tsconfig.json         # TypeScript configuration
  └── vite.config.ts        # Vite build configuration
```

## Requirements

- Node.js >= 18
- npm or pnpm

## Learn More

- [Asciitorium Documentation](https://github.com/iroknee/asciitorium)

## 📝 Changelog

See [CHANGELOG.md](https://github.com/iroknee/asciitorium/CHANGELOG.md) for detailed release notes and migration guides.

## License

MIT
