import {
  Line,
  Column,
  Row,
  Text,
  State,
  Switch,
  Case,
  Default,
  Button,
} from "../index.js";
import { BaseStyle } from './constants.js';

// Simple demo components
const AdminPanel = () => (
  <Column width="fill" height="fill" border label="Admin Panel" align="center">
    <Text gap={{ top: 2 }}>Welcome, Administrator!</Text>
    <Text>You have full access to the system.</Text>
  </Column>
);

const UserPanel = () => (
  <Column width="fill" height="fill" border label="User Panel" align="center">
    <Text gap={{ top: 2 }}>Welcome, User!</Text>
    <Text>You have limited access.</Text>
  </Column>
);

const GuestPanel = () => (
  <Column width="fill" height="fill" border label="Guest Panel" align="center">
    <Text gap={{ top: 2 }}>Welcome, Guest!</Text>
    <Text>Please log in to access more features.</Text>
  </Column>
);

/**
 * Switch Basics
 *
 * Guide to using Switch component for conditional rendering.
 */
export const SwitchBasics = () => {
  // State to control which panel is shown
  const userRole = new State<string | number>('guest');

  return (
    <Column style={BaseStyle} label="Switch Basics">
      <Text width="90%" gap={{ bottom: 1, top: 2 }}>
        The Switch component provides conditional rendering based on state.
        It supports two patterns: Case/Default mode and component mode.
      </Text>

      <Text width="90%">
        Case/Default Pattern (Recommended)
      </Text>
      <Line width="90%" />

      <Text width="90%" gap={{ left: 4, bottom: 1 }}>
        Use Case and Default components for declarative conditional rendering:
      </Text>

      {/* prettier-ignore */}
      <Text width="90%" gap={{ left: 6, bottom: 1 }}>
        &lt;Switch condition={'{'}userRole{'}'}&gt; ¶
          &lt;Case when="admin"&gt;&lt;AdminPanel /&gt;&lt;/Case&gt; ¶
          &lt;Case when="user"&gt;&lt;UserPanel /&gt;&lt;/Case&gt; ¶
          &lt;Default&gt;&lt;GuestPanel /&gt;&lt;/Default&gt; ¶
        &lt;/Switch&gt;
      </Text>

      <Text width="90%" gap={{ bottom: 1 }}>
        Try switching roles:
      </Text>

      <Row width="90%" gap={{ left: 4, bottom: 1 }}>
        <Button hotkey="g" onClick={() => userRole.value = 'guest'}>
          Guest
        </Button>
        <Button hotkey="u" onClick={() => userRole.value = 'user'}>
          User
        </Button>
        <Button hotkey="a" onClick={() => userRole.value = 'admin'}>
          Admin
        </Button>
      </Row>

      <Column width="90%" height={10} gap={{ left: 4 }}>
        <Switch condition={userRole}>
          <Case when="admin"><AdminPanel /></Case>
          <Case when="user"><UserPanel /></Case>
          <Default><GuestPanel /></Default>
        </Switch>
      </Column>

      <Text width="90%" gap={{ top: 2 }}>
        Switch Component API
      </Text>
      <Line width="90%" />

      {/* prettier-ignore */}
      <Text width="90%" gap={{ left: 6 }}>
        • condition — State&lt;string | number&gt; to match against ¶
        • component — State&lt;Component&gt; for direct switching ¶
        • Case when — value to match condition against ¶
        • Default — fallback when no Case matches ¶
      </Text>

      <Text width="90%" gap={{ top: 1 }}>
        Tip: Use Case/Default for static mappings, or use component mode
        for dynamic component instances.
      </Text>
    </Column>
  );
};
