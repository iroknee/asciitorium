import { Container } from './components/Container';
import OgreFont from './fonts/Ogre.flf?raw';
import { FIGfont } from './components/FIGfont';
import { Label } from './components/Label';
import { ListBox } from './components/ListBox';
import { Alert } from './components/Alert';
import { ProgressBar } from './components/ProgressBar';
import { HorizontalLine } from './components/HorizonalLine';
import { CelticBorder } from './components/CelticBorder';
import { Button } from './components/Button';
import { FocusManager } from './utils/FocusManager';

const screen = document.getElementById('screen')!;
screen.style.fontFamily = 'PrintChar21';

const layout = new Container({
  width: 70,
  height: 40,
  border: false,
});

layout.add({
  component: new CelticBorder('upperLeft'),
  alignX: 'left',
  alignY: 'top',
});
layout.add({
  component: new CelticBorder('upperRight'),
  alignX: 'right',
  alignY: 'top',
});
layout.add({
  component: new CelticBorder('lowerLeft'),
  alignX: 'left',
  alignY: 'bottom',
});
layout.add({
  component: new CelticBorder('lowerRight'),
  alignX: 'right',
  alignY: 'bottom',
});

const title = new FIGfont('1984', OgreFont);
const line = new HorizontalLine(27);
const subTitle = new Label('an ASCII framework');

layout.add({ component: title, alignX: 'center', alignY: 'top' });
layout.add({ component: line, alignX: 'center', alignY: title.height });
layout.add({
  component: subTitle,
  alignX: 'center',
  alignY: title.height + line.height,
});

const componentList = new ListBox({
  label: 'Components',
  width: 20,
  height: 22,
  items: [
    'Alert',
    'Button',
    'CelticBorder',
    'FIGfont',
    'HorizontalLine',
    'Label',
    'Layout',
    'ListBox',
    'ProgressBar',
  ],
  selectedIndex: 3,
  border: true,
});

// Add both list boxes to the screen
layout.add({
  component: componentList,
  alignX: 2,
  alignY: title.height + subTitle.height + 2,
});

function render() {
  const screenBuffer = layout.draw();
  console.log(screenBuffer.map((row) => row.join('')).join('\n'));
  screen.textContent = screenBuffer.map((row) => row.join('')).join('\n');
}

const progressBar = new ProgressBar({
  label: 'Uploading',
  width: 30,
  progress: 0,
  showPercent: true,
  onUpdate: () => {
    render();
  },
});

layout.add({ component: progressBar, alignX: 'center', alignY: 'bottom' });

progressBar.animateTo(1.0, 3000); // Animate to 100% over 3 seconds

const button = new Button({
  label: 'Click Me',
  onClick: () => {
    const alert = new Alert({
      message: 'Something happened!',
      onDismiss: () => {
        focusManager.popContext();
        layout.remove(alert);
        render();
      },
    });
    layout.add({ component: alert, alignX: 'center', alignY: 10 });
    focusManager.pushContext(alert.getFocusableDescendants());
    render();
  },
});

layout.add({
  component: button,
  alignX: 'center',
  alignY: layout.height - 6, // Adjust position as needed
});

render();

const focusManager = new FocusManager();
focusManager.reset(layout); // derive from layout tree

window.addEventListener('keydown', (event) => {
  if (event.key === 'Tab') {
    event.preventDefault();
    focusManager.focusNext();
    render();
    return;
  }

  if (focusManager.handleKey(event.key)) {
    render();
    event.preventDefault();
  }
});
