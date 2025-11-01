import {
  App,
  Art,
  Select,
  Option,
  OptionGroup,
  Switch,
  Row,
  PerfMonitor,
  PersistentState,
  State,
  Keybind,
} from './index';

import { GettingStarted } from './GettingStarted';
import { ArtBasics } from './ArtBasics';
import { ComponentBasics } from './ComponentBasics';
import { LayoutBasics } from './LayoutBasics';
import { NavigationBasics } from './NavigationBasics';
import { StateBasics } from './StateBasics';
import { AlignmentBasics } from './AlignmentBasics';
import { TextBasics } from './TextBasics';
import { KeybindingsBasics } from './KeybindingsBasics';

// Doc component mapping
const docMap: Record<string, any> = {
  start: GettingStarted,
  components: ComponentBasics,
  art: ArtBasics,
  layout: LayoutBasics,
  navigation: NavigationBasics,
  text: TextBasics,
  keybindings: KeybindingsBasics,
  align: AlignmentBasics,
  state: StateBasics,
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
  <App font="PrintChar21">
    <Keybind keyBinding="F12" action={togglePerfMonitor} />

    <Art src="asciitorium" align="center" gap={{ bottom: 1 }} />
    <Row height="fill">
      <Select
        label="Documentation"
        width={28}
        height="fill"
        hotkey="d"
        selected={selectedKey}
      >
        <Option value="start">Getting Started</Option>
        <Option value="components">Component Basics</Option>
        <Option value="text">Text</Option>
        <Option value="layout">Layouts</Option>
        <Option value="align">Alignment</Option>
        <Option value="navigation">Component Navigation</Option>
        <Option value="keybindings">Keybindings</Option>
        <Option value="state">State Management</Option>
        <OptionGroup label="The Art Component">
          <Option value="app">Sprites</Option>
          <Option value="art">Fonts</Option>
          <Option value="perf">Materials</Option>
        </OptionGroup>
      </Select>
      <Switch width="fill" height="fill" component={selected} />
    </Row>
    <PerfMonitor visible={showPerfMonitor} />
  </App>
);

await app.start();
