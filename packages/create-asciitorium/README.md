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

## Project Structure

A typical generated project will look like:

```
my-asciitorium-app/
  ├── public/
  ├── src/
  ├── index.html
  ├── package.json
  ├── tsconfig.json
  └── vite.config.ts
```

## Requirements

- Node.js >= 18
- npm or pnpm

## Learn More

- [Asciitorium Documentation](https://github.com/iroknee/asciitorium)

## License

MIT
