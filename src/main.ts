import { Layout } from './components/Layout';
import OgreFont from './fonts/Ogre.flf?raw';
import { FIGfont } from './components/FIGfont';
import { Label } from './components/Label';
import { ListBox } from './components/ListBox';
import { Alert } from './components/Alert';

const screen = document.getElementById('screen')!;
screen.style.fontFamily = 'PrintChar21';

const layout = new Layout({
  width: 80,
  height: 40,
  border: false,
});

const title = new FIGfont('1984', OgreFont);
const subTitle = new Label('an ASCII UI framework');

layout.add({ component: title, alignX: 'center', alignY: 'top' });
layout.add({ component: subTitle, alignX: 'center', alignY: title.height });

const listBoxLeft = new ListBox({
  label: 'Components',
  width: 20,
  height: 14,
  items: ['Container', 'Button', 'Label', 'ListBox', 'FIGfont', 'TextBox', 'ProgressBar', 'Markdown'],
  selectedIndex: 3,
  border: true,
  focusable: true,
});

const listBoxRight = new ListBox({
  label: 'Examples',
  width: 20,
  height: 14,
  items: ['Hello World', 'Modal Demo', 'Text Entry', 'Theme Test'],
  selectedIndex: 0,
  border: true,
  focusable: true,
});

// Add both list boxes to the screen
layout.add({
  component: listBoxLeft,
  alignX: 'left',
  alignY: title.height + subTitle.height + 1,
});

layout.add({
  component: listBoxRight,
  alignX: 'right',
  alignY: title.height + subTitle.height + 1,
});

// Track focusable components and current focus index
const focusables = [listBoxLeft, listBoxRight];
let focusedIndex = 0;
focusables[focusedIndex].hasFocus = true;

function setFocus(index: number) {
  focusables[focusedIndex].hasFocus = false;
  focusedIndex = index;
  focusables[focusedIndex].hasFocus = true;
}

function render() {
  screen.textContent = layout.draw();
}

const alert = new Alert({
  message: 'Alert!',
  onDismiss: () => {
    layout.remove(alert);
    render(); // Your re-render call
  }
});

layout.add({ component: alert, alignX: 'center', alignY: 10 });

render();

window.addEventListener('keydown', (event) => {
  if (event.key === 'Tab') {
    event.preventDefault(); // avoid browser focus shifting
    const nextIndex = (focusedIndex + 1) % focusables.length;
    setFocus(nextIndex);
    render();
    return;
  }

  const focused = focusables[focusedIndex];
  const handled = focused.handleEvent?.(event.key);
  if (handled) {
    render();
    event.preventDefault();
  }
});