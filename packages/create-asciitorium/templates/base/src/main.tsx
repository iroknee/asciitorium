import {
  App,
  Art,
  Button,
  Column,
  Text,
  PerfMonitor,
  State,
  Keybind
} from 'asciitorium';

// State for counter demo
const count = new State(0);

// State for PerfMonitor visibility toggle
const showPerfMonitor = new State(false);

// toggle PerfMonitor
const togglePerfMonitor = () => {
  showPerfMonitor.value = !showPerfMonitor.value;
};

const app = (
  <App>
    <Keybind keyBinding="p" action={togglePerfMonitor} />

    <Column style={{ align: 'center', gap: 1, width: '100%' }}>
      <Art src="asciitorium" />

      <Text style={{ align: 'center' }}>
        Welcome to asciitorium!
      </Text>

      <Text style={{ align: 'center', gap: 1 }}>
        Edit src/main.tsx and save to reload.
      </Text>

      <Column style={{ align: 'center', gap: 1, width: 'auto' }}>
        <Text>Count: {count}</Text>

        <Button
          label="Increment"
          hotkey="i"
          onClick={() => count.value++}
        />
      </Column>

      <Text style={{ align: 'center', gap: 1 }}>
        Press [P] to toggle performance monitor
      </Text>

      <Text style={{ align: 'center' }}>
        Press [Tab] to navigate • [Enter] to activate
      </Text>
    </Column>

    <PerfMonitor visible={showPerfMonitor} />
  </App>
);

await app.start();
