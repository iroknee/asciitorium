# 1982 – ASCII-Based Web GUI Framework

1982 is a lightweight, TypeScript-based ASCII UI rendering engine inspired by old-school terminal interfaces. The goal is to build a web-delivered, CLI-style visual interface using `<pre>` rendering and styled HTML spans — no external frameworks or virtual DOMs.

## Features

- ASCII-based UI rendering
- Lightweight and framework-free
- Customizable components

## Directory Structure

```bash
1982/
├── src/                  # Source code
│   ├── components/       # UI components
│   └── main.ts           # Demo entry point
├── index.html            # Demo and Examples
├── dist/                 # Build output
├── tsconfig.json         # TypeScript configuration
├── vite.config.ts        # Vite configuration
├── package.json          # Project metadata and dependencies
└── README.md             # Project documentation
```

## Getting Started

### Prerequisites

- Node.js (v16 or later)
- pnpm (preferred package manager)

### Installation

1. Clone the repository:

   ```bash
   git clone <repository-url>
   cd 1982
   ```

2. Install dependencies:

   ```bash
   pnpm install
   ```

### Running the Development Server

Start the Vite development server:

```bash
pnpm dev
```

Open your browser and navigate to `http://localhost:3000`.

### Building the Project

Generate a production build:

```bash
pnpm build
```

The build output will be located in the `dist/` directory.

### Generating Documentation

Generate TypeScript documentation:

```bash
pnpm doc
```

## License

This project is licensed under the MIT License. See the `LICENSE` file for details.
