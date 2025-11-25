# asciitorium

**asciitorium** is an ASCII-based Command-Line User Interface (CLUI) framework that runs in both the web and terminal.

## Installation

**Recommended:** Create a new asciitorium project using the create tooling:

```bash
npm create asciitorium my-app
```

or add asciitorium to your existing project:

```bash
npm install asciitorium
```

## Asset Management

Asciitorium includes a curated set of ASCII art assets (fonts, sprites, materials, sounds, maps) that are automatically available to all projects:

- **20 art files**: Materials, sprites, fonts, and maps
- **3 sound files**: Door sounds and ambient effects
- **Total size**: ~428 KB

### Automatic Asset Resolution

Projects automatically have access to library assets without copying files:

```typescript
// Use library assets directly
<Art sprite="beating-heart" />
<Banner font="shadows" text="Welcome" />
const material = await AssetManager.getMaterial('wall-brick');
```

### Customization

- **Library assets**: Located in `node_modules/asciitorium/public/art/` (read-only)
- **Project assets**: Located in `public/art/` (your custom assets)
- **Resolution**: Project assets override library assets by name

To customize a library asset, copy it to your project's `public/art/` directory and modify.

### Updates

Run `npm update asciitorium` to get the latest asset improvements. Your project assets are never modified.

See [Art Assets Documentation](./public/art/README.md) for complete details.

## Documentation

For complete documentation, examples, and usage guides, see the [GitHub Repository](https://github.com/iroknee/asciitorium).

## License

MIT
