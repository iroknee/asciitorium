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
} from './index.js';

import { GettingStarted } from './GettingStarted.js';
import { ComponentBasics } from './ComponentBasics.js';
import { LayoutBasics } from './LayoutBasics.js';
import { NavigationBasics } from './NavigationBasics.js';
import { StateBasics } from './StateBasics.js';
import { AlignmentBasics } from './AlignmentBasics.js';
import { TextBasics } from './TextBasics.js';
import { KeybindingsBasics } from './KeybindingsBasics.js';
import { SpritesBasics } from './SpritesBasics.js';
import { FontsBasics } from './FontsBasics.js';
import { MaterialsBasics } from './MaterialsBasics.js';
import { MapsBasics } from './MapsBasics.js';
import { FPVBasics } from './FPVBasics.js';

// Doc component mapping
const docMap: Record<string, any> = {
  start: GettingStarted,
  components: ComponentBasics,
  text: TextBasics,
  layout: LayoutBasics,
  align: AlignmentBasics,
  navigation: NavigationBasics,
  keybindings: KeybindingsBasics,
  state: StateBasics,
  sprites: SpritesBasics,
  fonts: FontsBasics,
  materials: MaterialsBasics,
  maps: MapsBasics,
  fpv: FPVBasics,
};

// Main state for component selection with persistence
const selectedKey = new PersistentState<string>(
  'start',
  'asciitorium.getting.started.selected'
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
  <App>
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
        <OptionGroup label="Component Framework">
          <Option value="components">Component Basics</Option>
          <Option value="text">Text</Option>
          <Option value="layout">Layouts</Option>
          <Option value="align">Alignment</Option>
          <Option value="navigation">Component Navigation</Option>
          <Option value="keybindings">Keybindings</Option>
          <Option value="state">State Management</Option>
        </OptionGroup>
        <OptionGroup label="ASCII Art & Game Engine">
          <Option value="sprites">Sprites</Option>
          <Option value="fonts">Fonts</Option>
          <Option value="materials">Materials</Option>
          <Option value="maps">Maps</Option>
          <Option value="fpv">First Person View</Option>
        </OptionGroup>
      </Select>
      <Switch width="fill" height="fill" component={selected} />
    </Row>
    <PerfMonitor visible={showPerfMonitor} />
  </App>
);

await app.start();
