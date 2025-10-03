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

Asciitorium supports viewing ascii art files. There are a few easy ways to create some specific ascii art, including FIGlet fonts and maps.

To generate FIGlet ASCII art assets (automatically placed in public/art):

```bash
npm run figlet font "a phrase"
```

#### FIGlet Examples

Here are some practical examples for generating ASCII art:

```bash
# Generate a game title
npm run figlet big "DUNGEON QUEST"

# Create a welcome message
npm run figlet standard "Welcome"

# Generate stylized text for menus
npm run figlet small "Main Menu"

# Create decorative headers
npm run figlet banner "Level 1"

# Generate large title text
npm run figlet block "GAME OVER"
```

#### Popular FIGlet Fonts

Some commonly used fonts include:

- `big` - Large, bold letters
- `standard` - Default FIGlet font
- `small` - Compact text
- `banner` - Wide banner-style text
- `block` - Solid block letters
- `slant` - Italicized appearance
- `shadow` - Text with shadow effect

You may also list all available FIGlet fonts supported:

```bash
npm run figlet:fonts
```

To generate ASCII maze files (placed in public/art/mazes):

```bash
node scripts/maze-builder.js <width> <height> <filename> [--smooth]

# Examples:
node scripts/maze-builder.js 10 10 dungeon-level-1.txt
node scripts/maze-builder.js 15 20 castle-maze.txt --smooth
```

The `--smooth` flag uses Unicode box drawing characters for improved visual appearance.

## Generated Project Structure

A typical generated project will look like:

```bash
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

## License

MIT
