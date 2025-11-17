import {
  App,
  Art,
  Select,
  Option,
  OptionGroup,
  Switch,
  Row,
  Column,
  PerfMonitor,
  PersistentState,
  State,
  Keybind,
  MobileController,
} from './index.js';

import {
  GettingStarted,
  ComponentBasics,
  LayoutBasics,
  NavigationBasics,
  StateBasics,
  LifecycleBasics,
  AlignmentBasics,
  TextBasics,
  KeybindingsBasics,
  SpritesBasics,
  FontsBasics,
  MaterialsBasics,
  MapsBasics,
  FPVBasics,
  ArtRaceConditionTest,
} from './examples/index.js';

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
  lifecycle: LifecycleBasics,
  sprites: SpritesBasics,
  fonts: FontsBasics,
  materials: MaterialsBasics,
  maps: MapsBasics,
  fpv: FPVBasics,
  racetest: ArtRaceConditionTest,
};

// Main state for component selection with persistence
const selectedKey = new PersistentState<string>(
  'start',
  'asciitorium.document.tutorial.selected'
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

// Create Select instance so we can reference it in keybindings
const docSelect = (
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
      <Option value="align">Align & Gaps</Option>
      <Option value="navigation">Component Navigation</Option>
      <Option value="keybindings">Keybindings</Option>
      <Option value="state">State Management</Option>
      <Option value="lifecycle">Lifecycle & Cleanup</Option>
    </OptionGroup>
    <OptionGroup label="ASCII Art & Game Engine">
      <Option value="sprites">Sprites</Option>
      <Option value="fonts">Fonts</Option>
      <Option value="materials">Materials</Option>
      <Option value="maps">Maps</Option>
      <Option value="fpv">First Person View</Option>
    </OptionGroup>
    <OptionGroup label="Tests">
      <Option value="racetest">Art Race Condition</Option>
    </OptionGroup>
  </Select>
);

const app = (
  <App align="top-center">
    <Keybind keyBinding="F12" action={togglePerfMonitor} />

    <Art src="asciitorium" gap={{ bottom: 1 }} />
    <Row height="fill">
      <Column width={28} height="fill">
        {/* Explicit keybindings for Select navigation */}
        <Keybind keyBinding="ArrowDown" action={() => docSelect.moveNext()} />
        <Keybind keyBinding="ArrowUp" action={() => docSelect.movePrevious()} />
        <Keybind keyBinding="Enter" action={() => docSelect.select()} />
        <Keybind keyBinding=" " action={() => docSelect.select()} />
        <Keybind keyBinding="PageDown" action={() => docSelect.pageDown()} />
        <Keybind keyBinding="PageUp" action={() => docSelect.pageUp()} />
        <Keybind keyBinding="Home" action={() => docSelect.moveToStart()} />
        <Keybind keyBinding="End" action={() => docSelect.moveToEnd()} />

        {/* Mobile controls for Select */}
        <MobileController
          dpad={{
            up: () => docSelect.movePrevious(),
            down: () => docSelect.moveNext(),
          }}
          buttons={{
            a: () => docSelect.select(),
          }}
        />

        {docSelect}
      </Column>
      <Switch width="fill" height="fill" component={selected} />
    </Row>
    <PerfMonitor visible={showPerfMonitor} />
  </App>
);

await app.start();
