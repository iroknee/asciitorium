import { Component, Container, Button } from './components/Container';

const screen = document.getElementById('screen')!;


// Root screen container
const screenContainer = new Container({
  label: 'Demo Screen',
  width: 80,
  height: 40,
  border: true
});

// ─── Top Row ─────────────────────────────

// Top-Left: left/top aligned, single-line string content
const topLeft = new Container({
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
const topCenter = new Container({
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
const topRight = new Container({
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
const centered = new Container({
  label: 'Centered',
  width: 24,
  height: 8,
  content: () => ['Center ', 'Centered', 'Content'],
  contentAlign: 'center',
  focusable: true
});
centered.hasFocus = true;
screenContainer.add({
  component: centered,
  alignX: 'center',
  alignY: 'center'
});

// ─── Bottom Row ──────────────────────────

// Bottom-Left: left/bottom aligned, multi-line content
const bottomLeft = new Container({
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
const bottomRight = new Container({
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
const lineComp = new Container({
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
const nestParent = new Container({
  label: 'Nested',
  width: 22,
  height: 7,
  border: true,
  content: 'Parent',
  contentAlign: { alignX: 'center', alignY: 'top' }
});

// Child inside parent box
const nestedChild = new Container({
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

// ─── Render Everything ───────────────────
const output = screenContainer.draw();
screen.textContent = output;