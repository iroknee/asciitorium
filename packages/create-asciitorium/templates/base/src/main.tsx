import {
  App,
  Art,
  Button,
  Column,
  Text,
  PerfMonitor,
  State,
  Keybind,
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
      <Art font="pencil" text="Welcome to" align="center" />
      <Art src="asciitorium" align="center" />

      <Text style={{ align: 'center', gap: 1 }}>
        Edit src/main.tsx and save to reload.
      </Text>

      <Art src="beating-heart" width={20} align="center" />

      <Text style={{ align: 'center', gap: 1 }}>
        Press [P] to toggle performance monitor
      </Text>
    </Column>

    <PerfMonitor visible={showPerfMonitor} />
  </App>
);

await app.start();
