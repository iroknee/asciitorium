# Text Component

The Text component displays a single line of text in your ASCII-based UI. It is a simple, lightweight component for static or dynamic text, and is part of the 1982 ASCII GUI framework rendered using the core Component system.

## Import

```js
import { Text } from './components/Text';
```

## Usage

Create and add a Text component to your App instance:

```js
const text = new Text({
  text: 'Hello, world!',
  alignX: 'center',
  alignY: 5,
});

app.add({
  component: text,
  alignX: 'center',
  alignY: 5,
});
```

## Constructor Options

The Text component accepts the following options via its constructor:

| Property | Type          | Required | Description                       |
| -------- | ------------- | -------- | --------------------------------- |
| text     | string        | ✓        | The text to display.              |
| alignX   | string/number | X        | Horizontal alignment or position. |
| alignY   | string/number | X        | Vertical alignment or position.   |

> Note: The width is automatically set to the length of the text, and the height is always 1.

## Methods

### draw(): string[][]

Renders the text as a 2D array of characters for ASCII display.

## Example: Updating Text

```js
text.text = 'Updated!';
app.render();
```

## Notes

• The Text component is ideal for labels, titles, or any single-line content.
• The width is dynamically set based on the text length.
• The component does not support multi-line text; use a different component for paragraphs.

## See Also

• Component — Base class for all components.
