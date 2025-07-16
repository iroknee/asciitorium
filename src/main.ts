import { Layout } from './components/Layout';
import OgreFont from './fonts/Ogre.flf?raw';
import { FIGfont } from './components/FIGfont';
import { Label } from './components/Label';
import { ListBox } from './components/ListBox';
import { Alert } from './components/Alert';
import { ProgressBar } from './components/ProgressBar';
import { HorizontalLine } from './components/HorizonalLine';
import { CelticBorder } from './components/CelticBorder';
import { Button } from './components/Button';

const screen = document.getElementById('screen')!;
screen.style.fontFamily = 'PrintChar21';

const layout = new Layout({
  width: 70,
  height: 40,
  border: false,
});

layout.add({ component: new CelticBorder('upperLeft'), alignX: 'left', alignY: 'top' });
layout.add({ component: new CelticBorder('upperRight'), alignX: 'right', alignY: 'top' });
layout.add({ component: new CelticBorder('lowerLeft'), alignX: 'left', alignY: 'bottom' });
layout.add({ component: new CelticBorder('lowerRight'), alignX: 'right', alignY: 'bottom' });

const title = new FIGfont('1984', OgreFont);
const line = new HorizontalLine(27);
const subTitle = new Label('an ASCII UI framework');

layout.add({ component: title, alignX: 'center', alignY: 'top' });
layout.add({ component: line, alignX: 'center', alignY: title.height });
layout.add({ component: subTitle, alignX: 'center', alignY: title.height + line.height });

const componentList = new ListBox({
  label: 'Components',
  width: 20,
  height: 22,
  items: ['Alert', 'Button', 'CelticBorder', 'FIGfont', 'HorizontalLine', 'Label', 'Layout', 'ListBox', 'ProgressBar'],
  selectedIndex: 3,
  border: true,
  focusable: true,
});

// Add both list boxes to the screen
layout.add({
  component: componentList,
  alignX: 2,
  alignY: title.height + subTitle.height + 2,
});

// Track focusable components and current focus index
const focusables = [componentList];
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

const progressBar = new ProgressBar({
  label: 'Uploading',
  width: 30,
  progress: 0,
  showPercent: true,
  onUpdate: () => {
    render();
  }
});

layout.add({ component: progressBar, alignX: 'center', alignY: 'bottom' });

progressBar.animateTo(1.0, 3000); // Animate to 100% over 3 seconds


const button = new Button({
  label: 'Click Me',
  onClick: () => {
    const alert = new Alert({
      message: 'You clicked the button!',
      onDismiss: () => {
        layout.remove(alert);
        render(); // Your re-render call
      }
    });
    layout.add({ component: alert, alignX: 'center', alignY: 10 });
    render();
  }
});

layout.add({
  component: button,
  alignX: 'center',
  alignY: layout.height - 6 // Adjust position as needed
});

// Add the button to the focusables array
focusables.push(button);

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