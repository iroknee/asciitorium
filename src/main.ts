import { AsciiArt } from './components/AsciiArt';
import { Text } from './components/Text';
import { ListBox } from './components/ListBox';
import { HorizontalLine } from './components/HorizonalLine';
import { MarkdownViewer } from './components/MarkdownViewer';
import { ProgressBar } from './components/ProgressBar';
import a1982 from './1982.txt?raw';
import App from './core/App';
import { Signal } from './core/Signal';

// Load all markdown files in ./docs/ at build time
const markdownFiles = import.meta.glob('./docs/*.md', { as: 'raw' });

const app = new App({
  width: 72,
  height: 35,
  fontFamily: 'PrintChar21',
});

const title = new AsciiArt({ art: a1982 });
const line = new HorizontalLine({ length: 70 });
const subTitle = new Text({ text: 'an ASCII GUI framework' });

app.add({ component: title, alignX: 'center', alignY: 'top' });
app.add({ component: line, alignX: 'center', alignY: title.height });
app.add({ component: subTitle, alignX: 'center', alignY: title.height + line.height });

const componentSignal = new Signal('Button');

const componentList = new ListBox({
  label: 'Components',
  width: 22,
  height: 22,
  border: true,
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
  selectedItem: componentSignal
});

app.add({
  component: componentList,
  alignX: 2,
  alignY: title.height + subTitle.height + 2
});

const markdownPreview = new MarkdownViewer({
  label: 'Docs',
  border: true,
  width: 46,
  height: 22,
});

app.add({
  component: markdownPreview,
  alignX: 24,
  alignY: title.height + subTitle.height + 2
});

const progressBar = new ProgressBar({
  label: 'Loading',
  width: 46,
  progress: 0,
  showPercent: true,
  onUpdate: () => app.render(),
});

app.add({
  component: progressBar,
  alignX: 'center',
  alignY: title.height + subTitle.height + 2 + markdownPreview.height + 1,
});

// Update markdown when a new component is selected
componentSignal.subscribe(async (componentName) => {
  const path = `./docs/${componentName}.md`;
  let markdown = `# ${componentName}\n\nNo documentation found.`;

  if (markdownFiles[path]) {
    try {
      markdown = await markdownFiles[path]() as string;
    } catch (e) {
      console.error(`Error loading ${path}:`, e);
    }
  }

  markdownPreview.setMarkdown(markdown);
  app.render();
});

// Animate loading bar
progressBar.animateTo(0.6);