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

import { KeybindingsExample } from './KeybindingsExample';
import { GettingStarted } from './GettingStarted';
import { ArtBasics } from './ArtBasics';
import { ComponentBasics } from './ComponentBasics';
import { NavigationBasics } from './NavigationBasics';
import { StateBasics } from './StateBasics';

// Doc component mapping
const docMap: Record<string, any> = {
  start: GettingStarted,
  components: ComponentBasics,
  art: ArtBasics,
  navigation: NavigationBasics,
  keybindings: KeybindingsExample,
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
        <Option value="start">Getting Started</Option>
        <Option value="components">Components</Option>
        <Option value="state">State</Option>
        <Option value="art">Ascii Art - Sprites</Option>
        <Option value="navigation">Navigation</Option>
        <Option value="keybindings">Keybindings</Option>
      </Select>
      <Switch width="fill" height="fill" component={selected} />
    </Row>
    <PerfMonitor visible={showPerfMonitor} />
  </App>
);

await app.start();
