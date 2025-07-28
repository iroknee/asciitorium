# ListBox Component

The ListBox is a scrollable, selectable list of items for ASCII-based UIs. It allows users to navigate and select items using keyboard input, and integrates with the Signal system for reactive selection. This component is part of the 1982 ASCII GUI framework and is rendered using the core Component system.

## Import

```js
import { ListBox } from './components/ListBox';
```

## Usage

Create and add a ListBox to your App instance:

```js
import { Signal } from './core/Signal';

const selected = new Signal('Item 1');
const listBox = new ListBox({
  items: ['Item 1', 'Item 2', 'Item 3'],
  selectedItem: selected,
  width: 24,
  height: 10,
  label: 'Options',
  alignX: 'left',
  alignY: 5,
});

app.add({
  component: listBox,
  alignX: 'left',
  alignY: 5,
});
```

## Constructor Options

The ListBox accepts the following options via its constructor:

| Property     | Type           | Required | Description                                          |
| ------------ | -------------- | -------- | ---------------------------------------------------- |
| items        | string[]       | ✓        | Array of items to display in the list.               |
| selectedItem | Signal<string> | ✓        | Signal holding the currently selected item.          |
| width        | number         | ✓        | Width of the ListBox in characters.                  |
| height       | number         | ✓        | Height of the ListBox in rows.                       |
| label        | string         | X        | Optional label to display at the top of the ListBox. |
| alignX       | string/number  | X        | Horizontal alignment or position.                    |
| alignY       | string/number  | X        | Vertical alignment or position.                      |

> Note: The ListBox is always focusable and supports keyboard navigation.

## Methods

### handleEvent(event: string): boolean

Handles keyboard events for navigation:

- `ArrowUp` or `w`: Move selection up
- `ArrowDown` or `s`: Move selection down

Returns `true` if the event was handled and the selection changed.

### draw(): string[][]

Renders the ListBox as a 2D array of characters for ASCII display.

## Example: Reacting to Selection

```js
selected.subscribe((value) => {
  console.log('Selected item:', value);
});
```

## Notes

• The ListBox will display scroll indicators (↑/↓) if there are more items than visible rows.
• The selected item is highlighted, and focus is indicated with a special marker.
• The Signal system allows for reactive updates when the selection changes.

## See Also

• Signal — Reactive value system for selection and state.
• Component — Base class for all components.
