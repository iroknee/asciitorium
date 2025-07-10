import { Component } from './components/Component';

const screen = document.getElementById('screen')!;

// Create the first component with some size and border
const h1 = new Component({
  width: 30,
  height: 7,
  border: true,
  fill: '.'
});

// Add a centered string to the first component
h1.add({
  x: 'center',
  y: 'top',
  string: 'Hello World',
  highlight: false,
  color: 'red'
});

// Create the second component with highlighted text
const h2 = new Component({
  width: 30,
  height: 7,
  border: true
});

h2.add({ x: 'right', y: 'bottom', string: 'rb' });
h2.add({ x: 'left', y: 'top', string: 'lt' });
h2.add({ x: 'center', y: 'center', string: 'cc', highlight: true });
h2.add({ x: 'center', y: 'top', string: 'ct' });
h2.add({ x: 'center', y: 'bottom', string: 'cb' });
h2.add({ x: 'right', y: 'top', string: 'rt' });
h2.add({ x: 'left', y: 'bottom', string: 'lb' });
h2.add({ x: 'right', y: 'center', string: 'rc' });
h2.add({ x: 'left', y: 'center', string: 'lc' });

// Create a larger canvas component
const canvas = new Component({
  width: 50,
  height: 20,
  border: true
});

// Add h1 and h2 to the canvas with some overlap
canvas.add({ x: 4, y: 2, component: h1 });
canvas.add({ x: 8, y: 4, component: h2 });

// Render the canvas to the screen
screen.innerHTML = canvas.draw();