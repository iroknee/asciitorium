import {
  App,
  Text,
  Button,
  Select,
  Option,
  OptionGroup,
  TextInput,
  Row,
  Column,
  Art,
  Keybind,
  State,
} from 'asciitorium';

// ============================================================================
// Test 1: Size Behavior
// ============================================================================
console.log('TEST 1: Size Behavior');

const test1Width = new State(0);
const test1Height = new State(0);

// ============================================================================
// Test 2: Text Newlines
// ============================================================================
console.log('TEST 2: Text Newlines (pilcrow vs backslash-n)');

// ============================================================================
// Test 3: State Reactivity
// ============================================================================
console.log('TEST 3: State Reactivity');

const reactiveCount = new State(0);
const reactiveName = new State('Initial');

// Verify State subscription works
reactiveCount.subscribe((value) => {
  console.log(`✅ State subscription triggered: count = ${value}`);
});

// ============================================================================
// Test 4: Button Auto-sizing
// ============================================================================
console.log('TEST 4: Button Auto-sizing');

const buttonClicks = new State(0);

// ============================================================================
// Test 5: Select with Options
// ============================================================================
console.log('TEST 5: Select Component');

const selectedFruit = new State<string>('apple');
const selectedWeapon = new State<string>('sword');

selectedFruit.subscribe((value) => {
  console.log(`✅ Selected fruit changed to: ${value}`);
});

// ============================================================================
// Test 6: TextInput with State
// ============================================================================
console.log('TEST 6: TextInput Component');

const textValue = new State('');
const numberValue = new State(42);

// ============================================================================
// Test 7: Keybind Tests
// ============================================================================
console.log('TEST 7: Keybind Component');

const keybindTriggerCount = new State(0);
const keybindDisabled = new State(false);

// ============================================================================
// Test 8: Column Width Default
// ============================================================================
console.log('TEST 8: Column Width Behavior');

// ============================================================================
// Test 9: Row Width Default
// ============================================================================
console.log('TEST 9: Row Width Behavior');

// ============================================================================
// Test 10: Art Component
// ============================================================================
console.log('TEST 10: Art Component (if art files exist)');

// ============================================================================
// Render App
// ============================================================================

const app = (
  <App>
    {/* Keybinds for testing */}
    <Keybind
      keyBinding="k"
      action={() => {
        keybindTriggerCount.value++;
        console.log(`✅ Keybind 'k' triggered: ${keybindTriggerCount.value}`);
      }}
      disabled={keybindDisabled}
    />
    <Keybind
      keyBinding="d"
      action={() => {
        keybindDisabled.value = !keybindDisabled.value;
        console.log(`🔄 Keybind disabled toggled: ${keybindDisabled.value}`);
      }}
    />
    <Keybind
      keyBinding="c"
      action={() => {
        reactiveCount.value++;
      }}
    />

    <Column width="100%" gap={1}>
      {/* Header */}
      <Text border={true} textAlign="center" width="100%">
        ASCIITORIUM Reference Validation Tests
      </Text>

      {/* Test 1: Size Behavior */}
      <Text border={true} width="100%">
        TEST 1: Size Behavior
      </Text>
      <Row gap={2}>
        <Column gap={1}>
          <Text border={true} width={30}>
            Fixed width (30)
          </Text>
          <Text border={true}>
            Auto width (omitted)
          </Text>
          <Text border={true}>
            Width should fit this content exactly plus border
          </Text>
        </Column>
        <Column gap={1}>
          <Button width={25}>Fixed Width Button</Button>
          <Button>Auto-calculated</Button>
          <Button>Wider Button Text Content</Button>
        </Column>
      </Row>

      {/* Test 2: Text Newlines */}
      <Text border={true} width="100%">
        TEST 2: Text Newlines
      </Text>
      <Row gap={2}>
        <Text border={true} width={30}>
          Using pilcrow:¶Line 1¶Line 2¶Line 3
        </Text>
        <Text border={true} width={30}>
          Using \n:
Line 1
Line 2
Line 3
        </Text>
      </Row>

      {/* Test 3: State Reactivity */}
      <Text border={true} width="100%">
        TEST 3: State Reactivity
      </Text>
      <Column gap={1}>
        <Text border={true}>
          Reactive count: {reactiveCount} (Press [C] to increment)
        </Text>
        <Text border={true}>
          Count value via .value: {reactiveCount.value}
        </Text>
        <Button onClick={() => reactiveCount.value++}>
          Increment (count: {reactiveCount})
        </Button>
        <Button onClick={() => reactiveName.value = 'Changed!'}>
          Change Name
        </Button>
        <Text border={true}>
          Name: {reactiveName}
        </Text>
      </Column>

      {/* Test 4: Button Auto-sizing */}
      <Text border={true} width="100%">
        TEST 4: Button Auto-sizing
      </Text>
      <Column gap={1}>
        <Button onClick={() => buttonClicks.value++}>
          Click
        </Button>
        <Button onClick={() => buttonClicks.value++}>
          Medium Button
        </Button>
        <Button onClick={() => buttonClicks.value++}>
          This is a very long button label
        </Button>
        <Text>Button clicks: {buttonClicks}</Text>
      </Column>

      {/* Test 5: Select */}
      <Text border={true} width="100%">
        TEST 5: Select Component
      </Text>
      <Row gap={2}>
        <Column gap={1}>
          <Text>Simple Select:</Text>
          <Select selected={selectedFruit} width={30} height={10}>
            <Option value="apple" label="Apple" />
            <Option value="banana" label="Banana" />
            <Option value="cherry" label="Cherry" />
            <Option value="date" label="Date" />
          </Select>
          <Text>Selected: {selectedFruit}</Text>
        </Column>
        <Column gap={1}>
          <Text>Grouped Select:</Text>
          <Select selected={selectedWeapon} width={30} height={12}>
            <OptionGroup label="Melee">
              <Option value="sword" label="Sword" />
              <Option value="axe" label="Axe" />
              <Option value="mace" label="Mace" />
            </OptionGroup>
            <OptionGroup label="Ranged">
              <Option value="bow" label="Bow" />
              <Option value="crossbow" label="Crossbow" />
            </OptionGroup>
          </Select>
          <Text>Selected: {selectedWeapon}</Text>
        </Column>
      </Row>

      {/* Test 6: TextInput */}
      <Text border={true} width="100%">
        TEST 6: TextInput Component
      </Text>
      <Column gap={1}>
        <Text>String Input:</Text>
        <TextInput value={textValue} placeholder="Enter text..." width={40} />
        <Text>Value: [{textValue}]</Text>

        <Text>Number Input:</Text>
        <TextInput value={numberValue} width={20} />
        <Text>Number value: {numberValue}</Text>
      </Column>

      {/* Test 7: Keybind */}
      <Text border={true} width="100%">
        TEST 7: Keybind Component
      </Text>
      <Column gap={1}>
        <Text>
          Press [K] to trigger keybind (count: {keybindTriggerCount})
        </Text>
        <Text>
          Press [D] to toggle keybind disabled: {keybindDisabled.value ? 'DISABLED' : 'ENABLED'}
        </Text>
        <Text>
          Press [C] to increment counter via keybind
        </Text>
      </Column>

      {/* Test 8: Column Width */}
      <Text border={true} width="100%">
        TEST 8: Column Width (auto-sizes to children)
      </Text>
      <Column gap={1} border={true}>
        <Text>Short</Text>
        <Text>This is much longer text content</Text>
        <Text>Medium length</Text>
      </Column>

      {/* Test 9: Row Width */}
      <Text border={true} width="100%">
        TEST 9: Row Width (default: fill)
      </Text>
      <Row gap={2} border={true}>
        <Text>Item 1</Text>
        <Text>Item 2</Text>
        <Text>Item 3</Text>
      </Row>

      {/* Test 10: Art (if available) */}
      <Text border={true} width="100%">
        TEST 10: Art Component (requires art files)
      </Text>
      <Column gap={1}>
        <Text>If art/asciitorium.art exists, it should render below:</Text>
        {/* Uncomment if you have art files:
        <Art sprite="asciitorium" align="center" />
        */}
        <Text>Art test skipped (no art files in template)</Text>
      </Column>

      {/* Instructions */}
      <Text border={true} width="100%" textAlign="center">
        Press [Ctrl+C] to exit | [Tab] to navigate
      </Text>
    </Column>
  </App>
);

await app.start();
