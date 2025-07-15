import { Container } from './components/Container';
import { Button } from './components/Button';
import OgreFont from './fonts/Ogre.flf?raw';
import { FIGfont } from './components/FIGfont';
import { Label } from './components/Label';
import { ListBox } from './components/ListBox';

const screen = document.getElementById('screen')!;


// Root screen container
const screenContainer = new Container({
  width: 80,
  height: 40,
  border: false
});

// ─── Button ──────────────────────────────
const button = new Button('Click Me');
screenContainer.add({
  component: button,
  alignX: 'center',
  alignY: 'bottom'
});


const title = new FIGfont('1984', OgreFont);
const subTitle = new Label('an ASCII UI framework');
screenContainer.add({ component: title, alignX: 'center', alignY: 'top' })
screenContainer.add({ component: subTitle, alignX: 'center', alignY: title.height })

const listBox = new ListBox({
  label: 'UI Components',
  width: 30,
  height: 20,
  items: ['Container', 'Button', 'Label', 'ListBox', 'FIGfont', 'TextBox', 'ProgressBar', 'Markdown'],
  selectedIndex: 3,
  border: true,
  focusable: false,
});

screenContainer.add({
  component: listBox,
  alignX: 'left',
  alignY: title.height + subTitle.height + 1,
});

// render AFTER all components are added (including async)
const output = screenContainer.draw();
screen.textContent = output;
