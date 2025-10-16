import {
  App,
  Art,
  Select,
  Option,
  Switch,
  Row,
  Text,
  PerfMonitor,
  PersistentState,
  State,
  Keybind,
} from './index';

import {
  GettingStartedDoc,
  ComponentsStatesDoc,
  KeybindingsHotkeysDoc,
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

// Doc component mapping
const docMap: Record<string, any> = {
  'getting-started': GettingStartedDoc,
  'components-states': ComponentsStatesDoc,
  'keybindings-hotkeys': KeybindingsHotkeysDoc,
  'art': ArtDoc,
  'button': ButtonDoc,
  'form': FormDoc,
  'modal': ModalDoc,
  'dungeon-crawler': DungeonCrawlerDoc,
  'layout-sizing': LayoutSizingDoc,
  'scrollable-text': ScrollableTextDoc,
  'sliders': SlidersDoc,
  'tabs': TabsDoc,
};

// Main state for component selection with persistence
const selectedKey = new PersistentState<string>('getting-started', 'selected-doc');
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
  <App font="PrintChar21" width={80}>
    <Keybind keyBinding="F12" action={togglePerfMonitor} global />

    <Art src="title" align="center" />
    <Text align="center" gap={1}>
      an ascii ui + game framework for web and cli
    </Text>
    <Row height="fill">
      <Select label="Docs" width="33%" height="fill" selected={selectedKey}>
        <Option value="getting-started">Getting Started</Option>
        <Option value="components-states">Components & State</Option>
        <Option value="keybindings-hotkeys">Keybindings & Hotkeys</Option>
        <Option value="button">Button</Option>
        <Option value="form">Form</Option>
        <Option value="modal">Modal</Option>
        <Option value="dungeon-crawler">Dungeon Crawler</Option>
        <Option value="layout-sizing">Layout & Sizing</Option>
        <Option value="scrollable-text">Scrollable Text</Option>
        <Option value="sliders">Sliders</Option>
        <Option value="tabs">Tabs</Option>
      </Select>
      <Switch width="fill" height="fill" component={selected} />
    </Row>
    <Text align="center" gap={1}>
      ↑ ↓ to Nav • [Enter] to Select • [P] to enable Perf Monitor
    </Text>
    <PerfMonitor visible={showPerfMonitor} />
  </App>
);

await app.start();
