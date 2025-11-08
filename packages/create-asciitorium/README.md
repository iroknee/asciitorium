# create-asciitorium

`create-asciitorium` is a command-line tool that helps you quickly scaffold a new [asciitorium](https://github.com/iroknee/asciitorium) project. It sets up all the necessary files, folders, and dependencies so you can start building a Command-Line User Interface (CLUI) application with minimal setup.

## Features

- Interactive CLI for project setup
- Generates a ready-to-use asciitorium project structure
- Installs dependencies automatically
- Supports TypeScript and Vite
- Includes example code and assets

## Getting Started

### Installation

To start a new asciitorium project:

```bash
npm create asciitorium my-app
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

`create-asciitorium` contains a few scripts that helps get building asciitorium `.art` files.

To generate FIGlet ASCII art assets (automatically placed in public/art):

```bash
npm run figlet font "a phrase"
```

#### FIGlet Examples

Here are some practical examples for generating ASCII art:

```bash
# Generate stylized text for menus
npm run figlet small "Main Menu"

# Generate large title text
npm run figlet block "GAME OVER"
```

You may list all available FIGlet fonts supported:

```bash
npm run figlet:fonts
```

To generate asciitorium map files (placed in public/art/maps):

```bash
node scripts/map-builder.js <width> <height> <filename> [--smooth]

# Examples:
node scripts/map-builder.js 10 10 dungeon-level-1.art
node scripts/map-builder.js 15 20 castle-maze.art --smooth
```

The `--smooth` flag uses Unicode box drawing characters for improved visual appearance.

## Generated Project Structure

A typical generated project will look like:

```bash
my-app/
  ├── public/
  │   ├── art/
  │   │   └── maps/         # asciitorium map/legend files.
  │   │   └── materials/    # asciitorium 3D & 2D scenery files
  │   │   └── fonts/        # asciitorium font files
  │   │   └── sprites/      # asciitorium sprite files
  ├── scripts/
  │   ├── gen-figlet-art.js # FIGlet art generator
  │   └── map-builder.js   # asciitorium map generator
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

## License

MIT
