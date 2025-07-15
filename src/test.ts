import { Layout } from './components/Layout';
import { Button } from './components/Button';
import BigFont from './fonts/Ogre.flf?raw';
import { FIGfont } from './components/FIGfont';

const screen = document.getElementById('screen')!;


// Root screen container
const screenContainer = new Layout({
  label: 'Demo Screen',
  width: 80,
  height: 40,
  border: true
});

// ─── Top Row ─────────────────────────────

// Top-Left: left/top aligned, single-line string content
const topLeft = new Layout({
  label: 'Top-Left Component',
  width: 24,
  height: 8,
  content: 'Default Centered'
});
screenContainer.add({
  component: topLeft,
  alignX: 'left',
  alignY: 'top'
});

// Top-Center: center/top aligned, multi-line string content
const topCenter = new Layout({
  label: 'Top-Center Component',
  width: 24,
  height: 8,
  border: false,
  fill: '.',
  content: ['No Border', 'Center-Bottom Aligned'],
  contentAlign: { alignX: 'center', alignY: 'bottom' }
});
screenContainer.add({
  component: topCenter,
  alignX: 'center',
  alignY: 0
});

// Top-Right: right/top aligned, string[] content
const topRight = new Layout({
  label: 'Top-Right',
  width: 24,
  height: 8,
  content: ['Right!', 'Aligned!'],
  contentAlign: { alignX: 'right', alignY: 'top' }
});
screenContainer.add({
  component: topRight,
  alignX: 'right',
  alignY: 'top'
});

// ─── Middle Center ───────────────────────

// Centered: center/center aligned, function content, focused
// const centered = new Container({
//   label: 'Centered',
//   width: 24,
//   height: 8,
//   content: () => ['Center ', 'Centered', 'Content'],
//   contentAlign: 'center',
//   focusable: true
// });
// centered.hasFocus = true;
// screenContainer.add({
//   component: centered,
//   alignX: 'center',
//   alignY: 'center'
// });

// ─── Bottom Row ──────────────────────────

// Bottom-Left: left/bottom aligned, multi-line content
const bottomLeft = new Layout({
  label: 'Bottom-Left',
  width: 24,
  height: 8,
  border: true,
  content: 'Bottom Left',
  contentAlign: { alignX: 'left', alignY: 'bottom' }
});
screenContainer.add({
  component: bottomLeft,
  alignX: 'left',
  alignY: 'bottom'
});

// Bottom-Right: right/bottom aligned, no border
const bottomRight = new Layout({
  label: 'Bottom-Right',
  width: 24,
  height: 8,
  border: false,
  content: 'Right-Bottom',
  contentAlign: { alignX: 'right', alignY: 'bottom' }
});
screenContainer.add({
  component: bottomRight,
  alignX: 'right',
  alignY: 'bottom'
});

// ─── Single-Line Box ─────────────────────

// Line: height = 1, centered horizontally
const lineComp = new Layout({
  width: 24,
  height: 1,
  border: false,
  content: 'Single line',
  contentAlign: 'center'
});
screenContainer.add({
  component: lineComp,
  alignX: 'right',
  alignY: 'center'
});

// ─── Nested Component ────────────────────

// Parent box
const nestParent = new Layout({
  label: 'Nested',
  width: 22,
  height: 7,
  border: true,
  content: 'Parent',
  contentAlign: { alignX: 'center', alignY: 'top' }
});

// Child inside parent box
const nestedChild = new Layout({
  label: 'Child',
  width: 10,
  height: 3,
  border: true,
  content: 'Nest',
  contentAlign: 'center'
});
nestParent.add({
  component: nestedChild,
  alignX: 'center',
  alignY: 'bottom'
});

screenContainer.add({
  component: nestParent,
  alignX: 0,
  alignY: 'center'
});

// ─── Button ──────────────────────────────
const button = new Button('Click Me');
screenContainer.add({
  component: button,
  alignX: 'center',
  alignY: 'bottom'
});


const title = new FIGfont('1984', BigFont);
console.log(title.draw());
screenContainer.add({
  component: title,
  alignX: 'center',
  alignY: 'center'
})

// render AFTER all components are added (including async)
const output = screenContainer.draw();
screen.textContent = output;
