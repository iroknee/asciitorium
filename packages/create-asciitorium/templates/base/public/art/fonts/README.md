# Asciitorium Fonts

> **Note**: This directory is empty by default. The asciitorium library includes starter assets in `node_modules/asciitorium/public/art/fonts/` that are automatically available without copying. See the main [art/README.md](../README.md) for details on using and customizing library assets.

This directory contains ASCII font files for the **Banner** component. Fonts
allow you to display large, stylized text using ASCII art characters.

## Font File Format

Font files use the `.art` extension and follow a structured format with metadata
separators:

### File Structure

``` txt
§ {"kind":"font"}
¶ {"character":"A"}
╭─╮
│ │
├─┤
╵ ╵

¶ {"character":"a"}

╭─╮
╭─┤
╰─╰

¶ {"character":["b", "B"]}
╷
├─╮
│ │
╯─╯
```

### Key Components

1. **File Header** (`§` separator)
   - Must start with `§ {"kind":"font"}`
   - Indicates this is a font asset

2. **Glyph Sections** (`¶` separator)
   - Each glyph begins with `¶ {"character":"x"}` where `x` is the character
   - Character can be a single string: `"a"`
   - Or an array for multiple mappings: `["b", "B"]` (both lowercase and
     uppercase)
   - Glyph content follows immediately after the metadata line

3. **Glyph Content**
   - ASCII art representation of the character
   - Each glyph can be any width/height
   - Vertical positioning is preserved (blank lines matter!)
   - Maximum font height is determined by the tallest glyph

**Tips:**

- Empty lines within glyphs are preserved to maintain vertical alignment
- The first line after the glyph metadata is part of the character (no automatic
  trimming)
- Map multiple characters to the same glyph using arrays:
  `{"character":["a","A"]}`
- All glyphs should have consistent height for best results (pad with empty
  lines if needed)

## Using Fonts in Your App

### Basic Usage

```tsx
<Banner font="pencil" text="asciitorium" />
```

### With Letter Spacing

```tsx
<Banner font="marker" text="HELLO" letterSpacing={1} />
```

### With Reactive State

```tsx
import { State } from 'asciitorium';

const titleText = new State<string>("Welcome");

<Banner font="shadows" text={titleText} align="center" />
```

### Available Props

- `font` (required): Name of the font file (without `.art` extension)
- `text`: String or `State<string>` to render
- `letterSpacing`: Additional spacing between characters (default: 0)
- Plus all standard component props: `position`, `border`, `align`, `style`,
  etc.

## Technical Details

### Loading

Fonts are loaded asynchronously via the `AssetManager`:

```typescript
const fontAsset = await AssetManager.getFont('myfont');
```

### Caching

Font assets are cached on first load - subsequent uses of the same font reuse
the cached data.

### Fallback Rendering

If a character is not found in the font, the Banner component renders the
character itself as a single-width glyph on the top line.
