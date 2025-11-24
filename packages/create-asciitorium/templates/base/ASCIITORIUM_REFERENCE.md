# ASCIITORIUM Quick Reference

> **For LLMs**: This document provides correct usage patterns for ASCIITORIUM
> components. Always refer to the examples here rather than assuming React-like
> conventions.

## Quick Index

**Core Concepts:**

- [State Management](#state-management)
- [JSX & Props](#jsx--props)
- [Component Lifecycle](#component-lifecycle)

**Layout:**

- [Row](#row)
- [Column](#column)

**UI Components:**

- [Text](#text)
- [Button](#button)
- [Select](#select)
- [Switch](#switch)
- [TextInput](#textinput)
- [Art](#art)

**Game Components:**

- [GameWorld](#gameworld)
- [MapView](#mapview)
- [FirstPersonView](#firstpersonview)

**Special:**

- [Keybind](#keybind)
- [PerfMonitor](#perfmonitor)



## State Management

### Basic Usage

```tsx
import { State } from 'asciitorium';

// Create reactive state
const count = new State(0);

// Read value
console.log(count);

// Update value (triggers reactivity)
count.value = 42;
```

### Props

| Prop           | Type | Description         |
| -------------- | ---- | ------------------- |
| `initialValue` | `T`  | Initial state value |

### Common Patterns

**Pattern 1: Counter**

```tsx
const count = new State(0);

<Button onClick={() => count.value++}>Increment: {count}</Button>;
```

**Pattern 2: Toggle**

```tsx
const isVisible = new State(false);

<Keybind
  keyBinding="p"
  action={() => isVisible.value = !isVisible.value}
/>
<PerfMonitor visible={isVisible} />
```

**Pattern 3: Conditional Rendering**

```tsx
const showDebug = new State(false);

{
  showDebug.value && <Text>Debug info here</Text>;
}
```

### Common Mistakes

❌ **WRONG** - Using React's useState

```tsx
const [count, setCount] = useState(0); // NO! This is React, not ASCIITORIUM
```

✅ **CORRECT** - Using ASCIITORIUM State

```tsx
const count = new State(0);
```

❌ **WRONG** - Forgetting .value

```tsx
count++; // NO! count is a State object
```

✅ **CORRECT** - Using .value

```tsx
count.value++;
```



## JSX & Props

### Core Concepts

ASCIITORIUM uses custom JSX runtime. Components accept props either:

1. Via explicit props (e.g., `content="text"`)
2. Via JSX children (e.g., `<Text>text</Text>`)

### Common Prop Patterns

**Sizing:**

```tsx
width={40}           // Fixed width
height={10}          // Fixed height
width="fill"         // Fill parent
// Omit width/height for auto-sizing (or use 'auto', equivalent)
```

**Positioning:**

```tsx
position={{ x: 5, y: 10, z: 10 }}    // Absolute positioning, z is optional
```

**Styling:**

```tsx
border={true}                  // Show border
gap={1}                        // Spacing
align="center"                 // Alignment (layout-specific)
```

### Common Mistakes

❌ **WRONG** - Using className or style objects

```tsx
<Text className="my-class" style={{ color: 'red' }}>
  NO!
</Text>
```

✅ **CORRECT** - Using ASCIITORIUM props

```tsx
<Text border={true} width={40}>
  YES!
</Text>
```



## Row

### Basic Usage

```tsx
<Row gap={2} align="center">
  <Button>One</Button>
  <Button>Two</Button>
  <Button>Three</Button>
</Row>
```

### Props

| Prop     | Type                            | Default  | Description            |
| -------- | ------------------------------- | -------- | ---------------------- |
| `gap`    | `number`                        | `0`      | Space between children |
| `align`  | `'top' \| 'center' \| 'bottom'` | `'top'`  | Vertical alignment     |
| `width`  | `number \| 'fill'`              | `'fill'` | Component width        |
| `height` | `number \| 'fill'`              | `'auto'` | Component height       |

### Common Patterns

**Pattern 1: Button Row**

```tsx
<Row gap={2} align="center">
  <Button onClick={() => save()}>Save</Button>
  <Button onClick={() => cancel()}>Cancel</Button>
</Row>
```

**Pattern 2: Mixed Content**

```tsx
<Row gap={1}>
  <Text width={20}>Label:</Text>
  <TextInput width={30} value={inputState} />
</Row>
```



## Column

### Basic Usage

```tsx
<Column gap={1} align="center" width="100%">
  <Text>Header</Text>
  <Text>Content</Text>
  <Text>Footer</Text>
</Column>
```

### Props

| Prop     | Type                            | Default  | Description                                     |
| -------- | ------------------------------- | -------- | ----------------------------------------------- |
| `gap`    | `number`                        | `0`      | Space between children                          |
| `align`  | `'left' \| 'center' \| 'right'` | `'left'` | Horizontal alignment                            |
| `width`  | `number \| 'fill' \| '100%'`    | -        | Auto-sizes to children (omit) or set explicitly |
| `height` | `number \| 'fill'`              | `'auto'` | Component height                                |

### Common Patterns

**Pattern 1: Centered Layout**

```tsx
<Column align="center" width="100%" gap={2}>
  <Art sprite="logo" />
  <Text>Welcome</Text>
  <Button>Start</Button>
</Column>
```

**Pattern 2: Form Layout**

```tsx
<Column gap={1}>
  <Text>Username:</Text>
  <TextInput value={username} />
  <Text>Password:</Text>
  <TextInput value={password} />
  <Button>Login</Button>
</Column>
```



## Text

### Basic Usage

```tsx
// Using JSX children
<Text>Hello, world!</Text>

// Using content prop
<Text content="Hello, world!" />

// Using State
<Text>{myState}</Text>
```

### Props

| Prop              | Type                                                                                                                 | Default      | Description                                              |
| ----------------- | -------------------------------------------------------------------------------------------------------------------- | ------------ | -------------------------------------------------------- |
| `content`         | `string \| State<any>`                                                                                               | -            | Text content (alternative to children)                   |
| `children`        | `string \| State<any>`                                                                                               | -            | JSX children                                             |
| `textAlign`       | `'top-left' \| 'top' \| 'top-right' \| 'left' \| 'center' \| 'right' \| 'bottom-left' \| 'bottom' \| 'bottom-right'` | `'top-left'` | Text alignment within box                                |
| `width`           | `number \| 'fill' \| 'auto'`                                                                                         | -            | Component width (omit for auto-sizing to content)        |
| `height`          | `number \| 'auto'`                                                                                                   | -            | Component height (omit for auto-sizing to wrapped lines) |
| `border`          | `boolean`                                                                                                            | `false`      | Show border                                              |
| `scrollable`      | `boolean`                                                                                                            | `false`      | Enable scrolling (arrow keys)                            |
| `wrap`            | `boolean`                                                                                                            | `true`       | Enable text wrapping                                     |
| `typewriter`      | `boolean`                                                                                                            | `false`      | Typewriter reveal effect                                 |
| `typewriterSpeed` | `number`                                                                                                             | `20`         | Characters per second for typewriter                     |

### Common Patterns

**Pattern 1: Static Text**

```tsx
<Text border={true} width={40}>
  This is a simple text box with a border.
</Text>
```

**Pattern 2: Reactive Text**

```tsx
const playerName = new State('Hero');

<Text>Player: {playerName}</Text>;
```

**Pattern 3: Multi-line with Pilcrow**

```tsx
<Text>Line one¶Line two¶Line three</Text>
```

**Pattern 4: Scrollable Content**

```tsx
<Text scrollable={true} height={10} width={60}>
  Long content that needs scrolling...
</Text>
```

**Pattern 5: Typewriter Effect**

```tsx
<Text typewriter={true} typewriterSpeed={30}>
  This text appears character by character...
</Text>
```

### Common Mistakes

❌ **WRONG** - Using \n for newlines

```tsx
<Text>Line one\nLine two</Text> // \n doesn't work in text content
```

✅ **CORRECT** - Using ¶ (pilcrow) for newlines

```tsx
<Text>Line one¶Line two</Text>
```

❌ **WRONG** - Accessing State directly

```tsx
<Text>{count}</Text> // Shows as object
```

✅ **CORRECT** - Both work (State is auto-resolved in Text)

```tsx
<Text>{count}</Text>           // State auto-resolved
<Text>{count.value}</Text>     // Explicit .value also works
```



## Button

### Basic Usage

```tsx
// Using JSX children
<Button onClick={() => console.log('clicked')}>
  Click Me
</Button>

// Using content prop
<Button content="Click Me" onClick={() => console.log('clicked')} />
```

### Props

| Prop       | Type         | Default              | Description                                   |
| ---------- | ------------ | -------------------- | --------------------------------------------- |
| `content`  | `string`     | -                    | Button text (alternative to children)         |
| `children` | `string`     | -                    | JSX children                                  |
| `onClick`  | `() => void` | -                    | Click handler                                 |
| `width`    | `number`     | `content.length + 7` | Auto-calculated based on content              |
| `height`   | `number`     | `4`                  | Button height                                 |
| `border`   | `boolean`    | `true`               | Show border                                   |
| `hotkey`   | `string`     | -                    | Hotkey letter (press F1 to toggle visibility) |

### Common Patterns

**Pattern 1: Simple Button**

```tsx
<Button onClick={() => startGame()}>Start Game</Button>
```

**Pattern 2: State-Modifying Button**

```tsx
const count = new State(0);

<Button onClick={() => count.value++}>Count: {count}</Button>;
```

**Pattern 3: Button with Hotkey**

```tsx
<Button hotkey="s" onClick={() => save()}>
  Save Game
</Button>
```

### Common Mistakes

❌ **WRONG** - Using onClick with event parameter

```tsx
<Button onClick={(e) => handleClick(e)}>Click</Button> // NO event parameter
```

✅ **CORRECT** - onClick receives no parameters

```tsx
<Button onClick={() => handleClick()}>Click</Button>
```

❌ **WRONG** - Setting width too small

```tsx
<Button width={5}>Very Long Text</Button> // Text will be cut off
```

✅ **CORRECT** - Let it auto-size or calculate properly

```tsx
<Button>Very Long Text</Button> // Auto-sizes
```



## Select

### Basic Usage

```tsx
import { State, Select, Option } from 'asciitorium';

const selected = new State<string>('option1');

<Select selected={selected}>
  <Option value="option1" label="First Option" />
  <Option value="option2" label="Second Option" />
  <Option value="option3" label="Third Option" />
</Select>;
```

### Props (Select)

| Prop       | Type          | Default | Description          |
| ---------- | ------------- | ------- | -------------------- |
| `selected` | `State<T>`    | -       | Selected value state |
| `children` | `Option<T>[]` | -       | Option children      |
| `width`    | `number`      | -       | Component width      |
| `height`   | `number`      | `3`     | Component height     |
| `border`   | `boolean`     | `true`  | Show border          |

### Props (Option)

| Prop    | Type     | Description   |
| ------- | -------- | ------------- |
| `value` | `T`      | Option value  |
| `label` | `string` | Display label |

### Common Patterns

**Pattern 1: String Select**

```tsx
const difficulty = new State<string>('normal');

<Select selected={difficulty}>
  <Option value="easy" label="Easy Mode" />
  <Option value="normal" label="Normal Mode" />
  <Option value="hard" label="Hard Mode" />
</Select>;
```

**Pattern 2: Grouped Options**

```tsx
import { Select, Option, OptionGroup } from 'asciitorium';

const weapon = new State<string>('sword');

<Select selected={weapon}>
  <OptionGroup label="Melee">
    <Option value="sword" label="Sword" />
    <Option value="axe" label="Axe" />
  </OptionGroup>
  <OptionGroup label="Ranged">
    <Option value="bow" label="Bow" />
    <Option value="crossbow" label="Crossbow" />
  </OptionGroup>
</Select>;
```

**Pattern 3: React to Selection**

```tsx
const mode = new State<string>('explore');

// Subscribe to changes
mode.subscribe((newMode) => {
  console.log(`Mode changed to: ${newMode}`);
});

<Select selected={mode}>
  <Option value="explore" label="Explore" />
  <Option value="combat" label="Combat" />
</Select>;
```

### Common Mistakes

❌ **WRONG** - Using value without State

```tsx
<Select selected="option1">  // NO! selected must be a State
```

✅ **CORRECT** - Using State

```tsx
const selected = new State("option1");
<Select selected={selected}>
```

❌ **WRONG** - Old API (items array)

```tsx
<Select items={['a', 'b']} selectedItem={state} /> // Deprecated
```

✅ **CORRECT** - New API (Option children)

```tsx
<Select selected={state}>
  <Option value="a" label="Option A" />
  <Option value="b" label="Option B" />
</Select>
```



## Switch

### Basic Usage

```tsx
import { State, Switch, Case, Default } from 'asciitorium';

const userRole = new State<string>('guest');

<Switch condition={userRole}>
  <Case when="admin" create={AdminPanel} />
  <Case when="user" create={UserPanel} />
  <Case when="guest" create={GuestPanel} />
  <Default create={GuestPanel} />
</Switch>;
```

### Props (Switch)

| Prop        | Type                             | Default | Description                        |
| ----------- | -------------------------------- | ------- | ---------------------------------- |
| `condition` | `State<string> \| State<number>` | -       | State to match against Case values |
| `width`     | `number \| 'fill'`               | -       | Component width                    |
| `height`    | `number \| 'fill'`               | -       | Component height                   |

### Props (Case)

| Prop     | Type               | Description                         |
| -------- | ------------------ | ----------------------------------- |
| `when`   | `string \| number` | Value to match against condition    |
| `create` | `any`              | Component class/function to create  |
| `with`   | `any`              | Optional props to pass to component |

### Props (Default)

| Prop     | Type  | Description                         |
| -------- | ----- | ----------------------------------- |
| `create` | `any` | Component class/function to create  |
| `with`   | `any` | Optional props to pass to component |

### Common Patterns

**Pattern 1: Simple Conditional Rendering**

```tsx
import { State, Switch, Case, Default } from 'asciitorium';

// Function components
const AdminPanel = () => <Column>Admin View</Column>;
const UserPanel = () => <Column>User View</Column>;
const GuestPanel = () => <Column>Guest View</Column>;

const userRole = new State<string>('guest');

<Column>
  <Button onClick={() => (userRole.value = 'admin')}>Admin</Button>
  <Button onClick={() => (userRole.value = 'user')}>User</Button>
  <Button onClick={() => (userRole.value = 'guest')}>Guest</Button>

  <Switch condition={userRole} width="fill" height="fill">
    <Case when="admin" create={AdminPanel} />
    <Case when="user" create={UserPanel} />
    <Case when="guest" create={GuestPanel} />
    <Default create={GuestPanel} />
  </Switch>
</Column>;
```

**Pattern 2: Class Components with Props**

```tsx
import { State, Switch, Case, Component } from 'asciitorium';

class SettingsPanel extends Component {
  constructor(props: { theme: string }) {
    super(props);
    // Use props.theme
  }
}

const currentView = new State<string>('settings');

<Switch condition={currentView}>
  <Case when="settings" create={SettingsPanel} with={{ theme: 'dark' }} />
  <Case when="profile" create={ProfilePanel} />
</Switch>;
```

**Pattern 3: Navigation with Select**

```tsx
import { State, Select, Option, Switch, Case } from 'asciitorium';

const selectedPage = new State<string>('home');

<Column>
  <Select selected={selectedPage}>
    <Option value="home" label="Home" />
    <Option value="about" label="About" />
    <Option value="contact" label="Contact" />
  </Select>

  <Switch condition={selectedPage} width="fill" height="fill">
    <Case when="home" create={HomePage} />
    <Case when="about" create={AboutPage} />
    <Case when="contact" create={ContactPage} />
  </Switch>
</Column>;
```

**Pattern 4: Numeric Conditions**

```tsx
const level = new State<number>(1);

<Switch condition={level}>
  <Case when={1} create={Level1} />
  <Case when={2} create={Level2} />
  <Case when={3} create={Level3} />
  <Default create={CompletionScreen} />
</Switch>;
```

### Common Mistakes

❌ **WRONG** - Using JSX children

```tsx
<Switch condition={role}>
  <Case when="admin">
    <AdminPanel /> {/* Components persist in memory! */}
  </Case>
</Switch>
```

✅ **CORRECT** - Using create prop

```tsx
<Switch condition={role}>
  <Case when="admin" create={AdminPanel} />
</Switch>
```

❌ **WRONG** - Missing Default fallback

```tsx
<Switch condition={status}>
  <Case when="loading" create={Spinner} />
  {/* No fallback - nothing shows if status is unknown */}
</Switch>
```

✅ **CORRECT** - Including Default

```tsx
<Switch condition={status}>
  <Case when="loading" create={Spinner} />
  <Default create={ErrorMessage} />
</Switch>
```



## TextInput

### Basic Usage

```tsx
const username = new State('');

<TextInput value={username} placeholder="Enter username..." />;
```

### Props

| Prop          | Type                             | Default | Description                                |
| ------------- | -------------------------------- | ------- | ------------------------------------------ |
| `value`       | `State<string> \| State<number>` | -       | Input value state (string or number)       |
| `placeholder` | `string`                         | `''`    | Placeholder text                           |
| `numeric`     | `boolean`                        | `false` | Restricts input to numbers only            |
| `width`       | `number`                         | -       | Input width (often needs explicit setting) |
| `height`      | `number`                         | `3`     | Input height                               |
| `border`      | `boolean`                        | `true`  | Show border                                |
| `maxLength`   | `number`                         | -       | Maximum input length                       |

### Common Patterns

**Pattern 1: Simple Input**

```tsx
const name = new State('');

<TextInput value={name} placeholder="Your name" width={30} />;
```

**Pattern 2: Form with Validation**

```tsx
const email = new State('');

email.subscribe((value) => {
  if (value.includes('@')) {
    console.log('Valid email');
  }
});

<TextInput value={email} placeholder="email@example.com" />;
```

**Pattern 3: Max Length**

```tsx
const code = new State('');

<TextInput value={code} maxLength={6} placeholder="Enter code" />;
```

### Common Mistakes

❌ **WRONG** - Using string directly

```tsx
<TextInput value="static text" /> // NO! value must be State
```

✅ **CORRECT** - Using State

```tsx
const text = new State('initial');
<TextInput value={text} />;
```

❌ **WRONG** - Trying to get value incorrectly

```tsx
<Button onClick={() => console.log(inputValue)}>Submit</Button>
```

✅ **CORRECT** - Accessing .value

```tsx
<Button onClick={() => console.log(inputValue.value)}>Submit</Button>
```



## Art

### Basic Usage

```tsx
// Load sprite from file
<Art sprite="logo" />

// Align center
<Art sprite="banner" align="center" />
```

### Props

| Prop     | Type                            | Default  | Description                          |
| -------- | ------------------------------- | -------- | ------------------------------------ |
| `sprite` | `string`                        | -        | Sprite file name (from art/sprites/) |
| `width`  | `number \| 'auto'`              | `'auto'` | Component width                      |
| `height` | `number \| 'auto'`              | `'auto'` | Component height                     |
| `align`  | `'left' \| 'center' \| 'right'` | `'left'` | Horizontal alignment                 |
| `border` | `boolean`                       | `false`  | Show border                          |

### Common Patterns

**Pattern 1: Static Sprite**

```tsx
// Loads from art/sprites/logo.art
<Art sprite="logo" align="center" />
```

**Pattern 2: Animated Sprite**

```tsx
// Loads animated art (auto-plays)
<Art sprite="beating-heart" width={20} />
```



## Banner

### Basic Usage

```tsx
// Render text with font
<Banner font="standard" text="Hello" />

// Align center
<Banner font="shadows" text="Game Over" align="center" />
```

### Props

| Prop            | Type                            | Default  | Description                       |
| --------------- | ------------------------------- | -------- | --------------------------------- |
| `font`          | `string`                        | -        | Font name (from art/fonts/)       |
| `text`          | `string \| State<string>`       | -        | Text to render with font          |
| `letterSpacing` | `number`                        | `0`      | Additional spacing between chars  |
| `width`         | `number \| 'auto'`              | `'auto'` | Component width                   |
| `height`        | `number \| 'auto'`              | `'auto'` | Component height                  |
| `align`         | `'left' \| 'center' \| 'right'` | `'left'` | Horizontal alignment              |
| `border`        | `boolean`                       | `false`  | Show border                       |

### Common Patterns

**Pattern 1: Title Screen**

```tsx
<Banner font="shadows" text="asciitorium" align="center" />
```

**Pattern 2: Reactive Text**

```tsx
const score = new State(0);
<Banner font="pixel" text={score} letterSpacing={1} />
```



## Keybind

### Basic Usage

```tsx
<Keybind keyBinding="F12" action={() => console.log('F12 pressed')} />
```

### Props

| Prop          | Type                        | Default | Description                                  |
| ------------- | --------------------------- | ------- | -------------------------------------------- |
| `keyBinding`  | `string`                    | -       | Key combination (e.g., "F12", "Ctrl+s", "p") |
| `action`      | `() => void`                | -       | Function to execute                          |
| `description` | `string`                    | -       | Optional description                         |
| `disabled`    | `State<boolean> \| boolean` | `false` | Disable keybind                              |
| `priority`    | `number`                    | `0`     | Priority for conflict resolution             |

### Common Patterns

**Pattern 1: Toggle Visibility**

```tsx
const showDebug = new State(false);

<Keybind keyBinding="d" action={() => (showDebug.value = !showDebug.value)} />;

{
  showDebug.value && <Text>Debug Info</Text>;
}
```

**Pattern 2: Game Controls**

```tsx
<Keybind keyBinding="ArrowUp" action={() => gameWorld.moveForward()} />
<Keybind keyBinding="ArrowDown" action={() => gameWorld.moveBackward()} />
<Keybind keyBinding="ArrowLeft" action={() => gameWorld.turnLeft()} />
<Keybind keyBinding="ArrowRight" action={() => gameWorld.turnRight()} />
```

**Pattern 3: Conditional Keybind**

```tsx
const gameStarted = new State(false);

<Keybind
  keyBinding="Space"
  action={() => shoot()}
  disabled={gameStarted.not()}
/>;
```

**Pattern 4: Function Keys**

```tsx
<Keybind keyBinding="F1" action={() => showHelp()} description="Show help" />
<Keybind keyBinding="F12" action={() => toggleDebug()} description="Toggle debug" />
```

### Common Mistakes

❌ **WRONG** - Using event object

```tsx
<Keybind action={(e) => console.log(e.key)} /> // NO event parameter
```

✅ **CORRECT** - Action receives no parameters

```tsx
<Keybind keyBinding="p" action={() => console.log('p pressed')} />
```

❌ **WRONG** - Assuming global scope without checking focused component

```tsx
// If a TextInput has focus, letter keys go to the input, not the keybind
<Keybind keyBinding="w" action={() => moveUp()} />
```

✅ **CORRECT** - Use non-conflicting keys for global actions

```tsx
<Keybind keyBinding="ArrowUp" action={() => moveUp()} />
```



## GameWorld

### Basic Usage

```tsx
import { GameWorld, State } from 'asciitorium';

const gameWorld = new GameWorld({
  mapName: 'dungeon',
  initialPosition: { x: 5, y: 5, direction: 'north' },
});

// Wait for async load
await gameWorld.ready;
```

### Constructor Options

| Option            | Type                                             | Description                            |
| ----------------- | ------------------------------------------------ | -------------------------------------- |
| `mapName`         | `string`                                         | Map name (loads from art/maps/{name}/) |
| `initialPosition` | `{ x: number, y: number, direction: Direction }` | Starting player position               |

### Methods

| Method           | Description                               |
| ---------------- | ----------------------------------------- |
| `moveForward()`  | Move player forward (respects collision)  |
| `moveBackward()` | Move player backward (respects collision) |
| `turnLeft()`     | Turn player left (no movement)            |
| `turnRight()`    | Turn player right (no movement)           |
| `isSolid(x, y)`  | Check if tile is solid (legend-based)     |
| `getMapData()`   | Get map string array                      |
| `getPlayer()`    | Get current player state                  |
| `getLegend()`    | Get legend metadata                       |
| `isReady()`      | Check if assets are loaded                |

### Common Patterns

**Pattern 1: Basic Game Setup**

```tsx
const gameWorld = new GameWorld({
  mapName: 'castle',
  initialPosition: { x: 10, y: 10, direction: 'north' },
});

await gameWorld.ready;

<App>
  <Keybind keyBinding="ArrowUp" action={() => gameWorld.moveForward()} />
  <Keybind keyBinding="ArrowDown" action={() => gameWorld.moveBackward()} />
  <Keybind keyBinding="ArrowLeft" action={() => gameWorld.turnLeft()} />
  <Keybind keyBinding="ArrowRight" action={() => gameWorld.turnRight()} />

  <MapView mapAsset={gameWorld.mapAsset} player={gameWorld.player} />
  <FirstPersonView mapAsset={gameWorld.mapAsset} player={gameWorld.player} />
</App>;
```

**Pattern 2: Custom Movement Logic**

```tsx
const handleMove = () => {
  const player = gameWorld.getPlayer();
  const nextPos = calculateNextPosition(player);

  if (!gameWorld.isSolid(nextPos.x, nextPos.y)) {
    gameWorld.moveForward();
  } else {
    console.log('Blocked!');
  }
};

<Keybind keyBinding="w" action={handleMove} />;
```

**Pattern 3: Fog of War**

```tsx
const exploredTiles = new State(new Set<string>());

gameWorld.player.subscribe((player) => {
  const key = `${player.x},${player.y}`;
  const newSet = new Set(exploredTiles.value);
  newSet.add(key);
  exploredTiles.value = newSet;
});

<MapView
  mapAsset={gameWorld.mapAsset}
  player={gameWorld.player}
  fogOfWar={true}
  exploredTiles={exploredTiles}
/>;
```

### Common Mistakes

❌ **WRONG** - Not waiting for ready

```tsx
const gameWorld = new GameWorld({ mapName: 'dungeon', ... });
// Assets not loaded yet!
<MapView mapAsset={gameWorld.mapAsset} player={gameWorld.player} />
```

✅ **CORRECT** - Await ready

```tsx
const gameWorld = new GameWorld({ mapName: 'dungeon', ... });
await gameWorld.ready;
<MapView mapAsset={gameWorld.mapAsset} player={gameWorld.player} />
```

❌ **WRONG** - Modifying player state directly

```tsx
gameWorld.player.value.x += 1; // Bypasses collision detection
```

✅ **CORRECT** - Using movement methods

```tsx
gameWorld.moveForward(); // Handles collision
```



## MapView

### Basic Usage

```tsx
<MapView mapAsset={gameWorld.mapAsset} player={gameWorld.player} />
```

### Props

| Prop            | Type                                | Default  | Description                    |
| --------------- | ----------------------------------- | -------- | ------------------------------ |
| `mapAsset`      | `State<MapAsset \| null>`           | -        | Map asset state                |
| `player`        | `State<Player>`                     | -        | Player state                   |
| `fogOfWar`      | `boolean \| State<boolean>`         | `false`  | Enable fog of war              |
| `exploredTiles` | `Set<string> \| State<Set<string>>` | -        | Explored tiles (for fog)       |
| `fogCharacter`  | `string`                            | `' '`    | Character for unexplored tiles |
| `width`         | `number \| 'fill'`                  | `'fill'` | Component width                |
| `height`        | `number \| 'fill'`                  | `'fill'` | Component height               |
| `border`        | `boolean`                           | `true`   | Show border                    |

### Common Patterns

**Pattern 1: Simple Map Display**

```tsx
<MapView
  mapAsset={gameWorld.mapAsset}
  player={gameWorld.player}
  width={60}
  height={20}
/>
```

**Pattern 2: Map with Fog of War**

```tsx
const exploredTiles = new State(new Set<string>());

// Update explored tiles when player moves
gameWorld.player.subscribe((p) => {
  const newSet = new Set(exploredTiles.value);
  newSet.add(`${p.x},${p.y}`);
  exploredTiles.value = newSet;
});

<MapView
  mapAsset={gameWorld.mapAsset}
  player={gameWorld.player}
  fogOfWar={true}
  exploredTiles={exploredTiles}
  fogCharacter="░"
/>;
```

**Pattern 3: Minimap**

```tsx
<MapView
  mapAsset={gameWorld.mapAsset}
  player={gameWorld.player}
  width={30}
  height={15}
  border={true}
/>
```

### Common Mistakes

❌ **WRONG** - Using raw map data

```tsx
<MapView mapData={['###', '#.#', '###']} /> // Old API
```

✅ **CORRECT** - Using GameWorld's mapAsset and player

```tsx
<MapView mapAsset={gameWorld.mapAsset} player={gameWorld.player} />
```



## FirstPersonView

### Basic Usage

```tsx
<FirstPersonView
  mapAsset={gameWorld.mapAsset}
  player={gameWorld.player}
  scene="brick-wall"
/>
```

### Props

| Prop       | Type                      | Default       | Description      |
| ---------- | ------------------------- | ------------- | ---------------- |
| `mapAsset` | `State<MapAsset \| null>` | -             | Map asset state  |
| `player`   | `State<Player>`           | -             | Player state     |
| `scene`    | `string`                  | `'wireframe'` | Scene style name |
| `width`    | `number \| 'fill'`        | `'fill'`      | Component width  |
| `height`   | `number \| 'fill'`        | `'fill'`      | Component height |
| `border`   | `boolean`                 | `true`        | Show border      |

### Available Scenes

- `wireframe` - Simple line-based rendering
- `brick-wall` - Textured brick walls
- `stone-wall` - Stone texture
- `dungeon` - Dark dungeon atmosphere

### Common Patterns

**Pattern 1: Basic First-Person View**

```tsx
<FirstPersonView
  mapAsset={gameWorld.mapAsset}
  player={gameWorld.player}
  scene="brick-wall"
  width={80}
  height={40}
/>
```

**Pattern 2: Split View (Map + First Person)**

```tsx
<Column width="100%" height="100%">
  <FirstPersonView
    mapAsset={gameWorld.mapAsset}
    player={gameWorld.player}
    scene="dungeon"
    height={30}
  />
  <MapView
    mapAsset={gameWorld.mapAsset}
    player={gameWorld.player}
    height={15}
  />
</Column>
```

### Common Mistakes

❌ **WRONG** - Using legacy src prop

```tsx
<FirstPersonView src={mapData} player={player} /> // Old API
```

✅ **CORRECT** - Using mapAsset

```tsx
<FirstPersonView mapAsset={gameWorld.mapAsset} player={gameWorld.player} />
```



## PerfMonitor

### Basic Usage

```tsx
const showPerf = new State(false);

<Keybind keyBinding="p" action={() => showPerf.value = !showPerf.value} />
<PerfMonitor visible={showPerf} />
```

### Props

| Prop       | Type                        | Default          | Description       |
| ---------- | --------------------------- | ---------------- | ----------------- |
| `visible`  | `State<boolean> \| boolean` | `true`           | Show/hide monitor |
| `position` | `{ x: number, y: number }`  | `{ x: 0, y: 0 }` | Screen position   |

### Common Patterns

**Pattern 1: Toggle with Keybind**

```tsx
const showPerf = new State(false);

<Keybind keyBinding="F3" action={() => showPerf.value = !showPerf.value} />
<PerfMonitor visible={showPerf} />
```

**Pattern 2: Always Visible (Dev Mode)**

```tsx
<PerfMonitor visible={true} />
```

### Common Mistakes

❌ **WRONG** - Expecting control over position

```tsx
<PerfMonitor position={{ x: 100, y: 50 }} /> // Position prop exists but fixed to corner
```

✅ **CORRECT** - Accept default positioning

```tsx
<PerfMonitor visible={showPerf} />
```



## Component Lifecycle

### Initialization

```tsx
// Components are instantiated when JSX is executed
const app = (
  <App>
    <Text>This creates a new Text instance</Text>
  </App>
);

// App starts rendering
await app.start();
```

### State Subscriptions

```tsx
const count = new State(0);

// Manual subscription
count.subscribe((newValue) => {
  console.log('Count changed:', newValue);
});

// Component auto-subscribes when State is passed as prop
<Text>{count}</Text>; // Auto re-renders when count changes
```

### Cleanup

```tsx
// Components auto-cleanup when destroyed
// State subscriptions are automatically removed
// No manual cleanup needed in most cases
```



## Legend System (Game Maps)

### Legend File Format

Each map has a `legend.json` file that describes tile properties:

```json
{
  "#": {
    "name": "Wall",
    "kind": "material",
    "solid": true,
    "asset": "brick-wall"
  },
  ".": {
    "name": "Floor",
    "kind": "material",
    "solid": false,
    "asset": "floor"
  },
  "D": {
    "name": "Door",
    "kind": "sprite",
    "solid": true,
    "tag": "door",
    "asset": "door-closed"
  }
}
```

### Legend Properties

| Property | Type                     | Description           |
| -------- | ------------------------ | --------------------- |
| `name`   | `string`                 | Human-readable name   |
| `kind`   | `'material' \| 'sprite'` | Asset type            |
| `solid`  | `boolean`                | Blocks movement       |
| `asset`  | `string`                 | Asset file name       |
| `tag`    | `string`                 | Optional semantic tag |

### Common Patterns

**Pattern 1: Check Collision**

```tsx
const canMove = !gameWorld.isSolid(targetX, targetY);
```

**Pattern 2: Custom Interaction**

```tsx
const tile = gameWorld.getLegend()[tileChar];
if (tile?.tag === 'door') {
  openDoor();
} else if (tile?.tag === 'treasure') {
  collectTreasure();
}
```



## Directory Structure

```
your-project/
├── src/
│   ├── main.tsx          # Entry point
│   └── ...
├── art/
│   ├── maps/
│   │   └── your-map/
│   │       ├── map.art
│   │       └── legend.json
│   ├── materials/
│   │   └── wall.art
│   ├── sprites/
│   │   └── player.art
│   └── your-logo.art
├── index.html
└── package.json
```

### Art File Format

Art files use special separators:

- `§` - Metadata separator (e.g., `§width=80§height=40§`)
- `¶` - Line separator in content

Example:

```
§width=20§height=5§
╔══════════════════╗¶
║   GAME TITLE     ║¶
║                  ║¶
║  Press START     ║¶
╚══════════════════╝
```



## Type Annotations

### Player Type

```tsx
import type { Player } from 'asciitorium';

const player: Player = {
  x: 5,
  y: 10,
  direction: 'north', // 'north' | 'south' | 'east' | 'west'
};
```

### MapAsset Type

```tsx
import type { MapAsset } from 'asciitorium';

// Returned by AssetManager.loadMap()
const mapAsset: MapAsset = {
  mapData: string[];
  legend: Record<string, LegendEntry>;
};
```

### LegendEntry Type

```tsx
import type { LegendEntry } from 'asciitorium';

const entry: LegendEntry = {
  name: string;
  kind: 'material' | 'sprite';
  solid: boolean;
  asset: string;
  tag?: string;
};
```



## Complete Example: Simple Game

```tsx
import {
  App,
  GameWorld,
  MapView,
  FirstPersonView,
  Keybind,
  Text,
  Column,
  State,
} from 'asciitorium';

// Create game world
const gameWorld = new GameWorld({
  mapName: 'dungeon',
  initialPosition: { x: 5, y: 5, direction: 'north' },
});

// Wait for assets to load
await gameWorld.ready;

// Fog of war state
const exploredTiles = new State(new Set<string>());

// Update explored tiles on player move
gameWorld.player.subscribe((p) => {
  const newSet = new Set(exploredTiles.value);
  newSet.add(`${p.x},${p.y}`);
  exploredTiles.value = newSet;
});

const app = (
  <App>
    {/* Movement controls */}
    <Keybind keyBinding="ArrowUp" action={() => gameWorld.moveForward()} />
    <Keybind keyBinding="ArrowDown" action={() => gameWorld.moveBackward()} />
    <Keybind keyBinding="ArrowLeft" action={() => gameWorld.turnLeft()} />
    <Keybind keyBinding="ArrowRight" action={() => gameWorld.turnRight()} />

    {/* UI Layout */}
    <Column width="100%" height="100%" gap={0}>
      {/* First-person view */}
      <FirstPersonView
        mapAsset={gameWorld.mapAsset}
        player={gameWorld.player}
        scene="dungeon"
        height={30}
      />

      {/* Map view with fog */}
      <MapView
        mapAsset={gameWorld.mapAsset}
        player={gameWorld.player}
        fogOfWar={true}
        exploredTiles={exploredTiles}
        height={15}
      />

      {/* Status text */}
      <Text border={true}>Use arrow keys to move. Explore the dungeon!</Text>
    </Column>
  </App>
);

await app.start();
```



## Understanding "auto" vs Omitting Props

**Key Concept:** In ASCIITORIUM, omitting `width` or `height` props is the same
as setting them to `undefined` or `"auto"`.

- `width={40}` → Fixed width of 40 characters
- `width="fill"` → Fill available parent space
- `width="auto"` → Auto-size to content (same as omitting the prop)
- _Omitting width prop_ → Auto-size to content (recommended approach)

**Recommendation:** Omit props instead of using `"auto"` for clarity. The type
system allows `"auto"` but it's unnecessary.

**Component-specific auto-sizing:**

- **Text**: Auto-sizes to content length (width) and wrapped lines (height) when
  props omitted
- **Button**: Always calculates size based on content (`buttonText.length + 7`
  for width, `4` for height)
- **Art**: Auto-sizes to loaded art dimensions when props omitted
- **Column**: Auto-sizes to fit children when width omitted
- **Row**: Defaults to `width="fill"`



## Tips for LLMs

1. **Always use `new State()` for reactive values** - Never use React's useState
2. **State values are accessed via `.value`** - Read and write using `.value`
3. **Text newlines use `¶` (pilcrow)** - Not `\n`
4. **Components accept children via JSX or explicit props** - Both patterns work
5. **GameWorld must be awaited** - `await gameWorld.ready` before rendering
6. **Keybinds are invisible components** - They never render, just register
   handlers
7. **MapView and FirstPersonView are display-only** - Movement logic goes in
   GameWorld or Keybinds
8. **Legend system drives collision** - Use `isSolid()` for movement validation
9. **No CSS or className** - ASCIITORIUM uses ASCII rendering, not DOM styling
10. **Omit width/height props for auto-sizing** - Components have smart defaults
    (Text/Art/Column size to content, Button calculates from label, Row fills
    width)



_End of Reference_
