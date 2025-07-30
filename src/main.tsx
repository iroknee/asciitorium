import { AsciiArt } from './components/AsciiArt';
import { Text } from './components/Text';
import { ListBox } from './components/ListBox';
import { HorizontalLine } from './components/HorizonalLine';
import { MarkdownViewer } from './components/MarkdownViewer';
import { ProgressBar } from './components/ProgressBar';
import a1982 from './1982.txt?raw';
import App from './core/App';
import { State } from './core/State';
import { TextInput } from './components/TextInput';
import { Button } from './components/Button';
import { CelticBorder } from './components/CelticBorder';
import { DomRenderer } from './core/DomRenderer';
import { RowLayout } from './core/RowLayout';

const screen = document.getElementById('screen')!;
screen.style.fontFamily = 'PrintChar21';

const app = (
  <App width={64} height={32} border={true} fit={true} renderer={new DomRenderer(screen)}>
    
    <Text
      border={true}
      value="Header: Welcome to ASCII UI"
      align="top-left"
    />
    <AsciiArt border={true} content={a1982} align="middle-center" />
    <Text
      border={true}
      value="Footer: Press Ctrl+C to exit."
      align="bottom-right"
    />
  </App>
);
// const app = new App({
//   width: 80,
//   height: 45,
//   renderer: new DomRenderer(screen),
//   fontFamily: 'PrintChar21',
// });

// // Add components, attach key events
// window.addEventListener('keydown', (event) => {
//   app.handleKey(event.key);
// });

// // Add corner components
// app.add({ component: new CelticBorder('upperLeft'), alignX: 'left', alignY: 'top' });
// app.add({ component: new CelticBorder('upperRight'), alignX: 'right', alignY: 'top' });
// app.add({ component: new CelticBorder('lowerLeft'), alignX: 'left', alignY: 'bottom' });
// app.add({ component: new CelticBorder('lowerRight'), alignX: 'right', alignY: 'bottom' });

// app.add({
//   component: new CelticBorder('lowerRight'),
//   alignX: 'right',
//   alignY: 'bottom',
// });

// const title = new AsciiArt({ content: a1982 });
// app.add({ component: title, alignX: 'center', alignY: 'top' });

// const line = new HorizontalLine({ length: 64 });
// app.add({ component: line, alignX: 'center', alignY: title.height });

// const subTitle = new Text({ value: 'an ASCII GUI framework' });
// app.add({ component: subTitle, alignX: 'center', alignY: title.height + line.height });

// const selectedComponent = new State('Text');

// const componentList = new ListBox({
//   label: 'Components',
//   width: 22,
//   height: 22,
//   border: true,
//   items: ['Text', 'ListBox', 'ProgressBar'],
//   selectedItem: selectedComponent,
// });
// app.add({ component: componentList, alignX: 2, alignY: title.height + subTitle.height + 3 });

// const markdownPreview = new MarkdownViewer({
//   label: 'Docs',
//   border: true,
//   width: 46,
//   height: 22,
// });
// app.add({ component: markdownPreview, alignX: 24, alignY: title.height + subTitle.height + 3 });

// const progressBar = new ProgressBar({
//   label: 'Loading',
//   width: 46,
//   progress: 0,
//   showPercent: true,
//   onUpdate: () => app.render(),
// });
// app.add({ component: progressBar, alignX: 'center', alignY: 'bottom' });
// progressBar.animateTo(1);

// // Update markdown when a new component is selected
// selectedComponent.subscribe(async (componentName) => {
//   const path = `./docs/${componentName}.md`;
//   let markdown = `# ${componentName}\n\nNo documentation found.`;

//   if (markdownFiles[path]) {
//     try {
//       markdown = (await markdownFiles[path]()) as string;
//     } catch (e) {
//       console.error(`Error loading ${path}:`, e);
//     }
//   }

//   markdownPreview.setMarkdown(markdown);
//   app.render();
// });

// const name = new State('');

// const input = new TextInput({
//   width: 22,
//   height: 3,
//   border: true,
//   label: 'Name',
//   state: name,
//   placeholder: 'enter your name...',
// });
// app.add({ component: input, alignX: 38, alignY: title.height + subTitle.height + markdownPreview.height + 5 });

// const btn = new Button({
//   name: 'OK',
//   border: true,
//   onClick: () => {
//     console.log('Button clicked!');
//   },
// });
// app.add({ component: btn, alignX: 60, alignY: title.height + subTitle.height + markdownPreview.height + 5 });
