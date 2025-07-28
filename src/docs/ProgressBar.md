# ProgressBar Component

The ProgressBar is a horizontal visual indicator that displays progress from 0% to 100%. It supports optional percentage text, custom labels, and animated transitions. This component is part of the 1982 ASCII GUI framework and is rendered using the core Component system.

## Import

``` js
import { ProgressBar } from './components/ProgressBar';
```

## Usage

Create and add a ProgressBar to your App instance:

```js
const progressBar = new ProgressBar({
  label: 'Loading',
  width: 46,
  progress: 0.25,
  showPercent: true,
  onUpdate: () => app.render(),
});

app.add({
  component: progressBar,
  alignX: 'center',
  alignY: 10,
});
```

## Constructor Options

The ProgressBar accepts the following options via its constructor:

| Property    | Type       | Required | Description                                                                     |
| ----------- | ---------- | -------- | ------------------------------------------------------------------------------- |
| label       | string     | ✓        | Label to display above the progress bar.                                        |
| progress    | number     | ✓        | Initial progress value between 0 and 1.                                         |
| width       | number     | ✓        | Total width of the component including borders.                                 |
| showPercent | boolean    | X        | Whether to overlay a percentage label in the center of the bar. Default: false. |
| onUpdate    | () => void | X        | Callback triggered when the progress updates (used to trigger re-renders).      |

> Note: The height is fixed at 3 rows (label, bar, bottom border).

## Methods

setProgress(value: number): void

Sets the progress instantly to a new value between 0 and 1.

```js
progressBar.setProgress(0.75);
```

animateTo(value: number, durationMs = 1000): void

Animates the progress smoothly to a target value over a duration in milliseconds.

```js
progressBar.animateTo(1.0, 3000); // animate to 100% over 3 seconds
```

## Notes

• Progress values are automatically clamped between 0 and 1.
• onUpdate is useful for triggering redraws when using animation or dynamic updates.
• The percentage text will overwrite bar characters when showPercent: true.

## See Also

• App — Application container used to render components.
• Component — Base class for all components.
