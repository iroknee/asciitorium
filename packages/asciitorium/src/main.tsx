import {
  App,
  Art,
  Select,
  Option,
  Switch,
  Row,
  PerfMonitor,
  PersistentState,
  State,
  Keybind,
} from './index';

import {
  ComponentsStatesDoc,
  ButtonDoc,
  FormDoc,
  ModalDoc,
  LayoutSizingDoc,
  ScrollableTextDoc,
  TabsDoc,
  ArtDoc,
  SlidersDoc,
  DungeonCrawlerDoc,
} from './docs';

import { KeybindingsExample } from './KeybindingsExample';
import { GettingStarted } from './GettingStarted';
import { AsciiArt } from './AsciiArt';

// Doc component mapping
const docMap: Record<string, any> = {
  'getting-started': GettingStarted,
  'components-states': ComponentsStatesDoc,
  keybindings: KeybindingsExample,
  art: AsciiArt,
  button: ButtonDoc,
  form: FormDoc,
  modal: ModalDoc,
  'dungeon-crawler': DungeonCrawlerDoc,
  'layout-sizing': LayoutSizingDoc,
  'scrollable-text': ScrollableTextDoc,
  sliders: SlidersDoc,
  tabs: TabsDoc,
};

// Main state for component selection with persistence
const selectedKey = new PersistentState<string>(
  'getting-started',
  'selected-doc'
);
const selected = new State<any>(docMap[selectedKey.value]);

// Sync selected component with persisted key
selectedKey.subscribe((key) => {
  selected.value = docMap[key];
});

// State for PerfMonitor visibility (F12 toggle)
const showPerfMonitor = new State(false);

// toggle PerfMonitor with "F12" key
const togglePerfMonitor = () => {
  showPerfMonitor.value = !showPerfMonitor.value;
};

const app = (
  <App font="PrintChar21" width={80} height={52}>
    <Keybind keyBinding="F12" action={togglePerfMonitor} global />

    <Art src="asciitorium" align="center" gap={{ bottom: 1 }} />
    <Row height="fill">
      <Select
        label="Documentation"
        width="33%"
        height="fill"
        selected={selectedKey}
      >
        <Option value="getting-started">Getting Started</Option>
        <Option value="art">Ascii Art - Sprites</Option>
        <Option value="keybindings">Keybindings</Option>
        <Option value="components-states">Components & State</Option>
        <Option value="layout-sizing">Layout & Sizing</Option>
        <Option value="form">Form</Option>
        <Option value="modal">Modal</Option>
        <Option value="dungeon-crawler">Dungeon Crawler</Option>
        <Option value="scrollable-text">Scrollable Text</Option>
        <Option value="sliders">Sliders</Option>
        <Option value="tabs">Tabs</Option>
      </Select>
      <Switch width="fill" height="fill" component={selected} />
    </Row>
    <PerfMonitor visible={showPerfMonitor} />
  </App>
);

await app.start();
