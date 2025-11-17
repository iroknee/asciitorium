# Timer Components Design Proposal

**Related:** Lifecycle cleanup implementation (Component.registerCleanup)

## Overview

Proposes adding invisible timer/interval components that handle their own lifecycle and cleanup automatically. This provides a declarative, component-based approach to managing timers that aligns with the framework's architecture.

## Motivation

Currently, developers must manually manage timer cleanup using `registerCleanup()`:

```typescript
const intervalId = setInterval(() => {...}, 1000);
container.registerCleanup(() => clearInterval(intervalId));
```

While functional, this approach:

- Requires boilerplate for every timer
- Isn't discoverable in the component tree
- Doesn't leverage the component lifecycle system
- Feels imperative rather than declarative

## Proposed Solution

Introduce invisible components for common timer patterns:

### 1. Interval Component

```typescript
<Column>
  <Interval
    callback={() => spawnFirework()}
    delay={2000}
  />

  <Text>Other content</Text>
</Column>
```

### 2. Timeout Component

```typescript
<Column>
  <Timeout
    callback={() => cleanup()}
    delay={5000}
  />

  <Text>Delayed action in 5 seconds</Text>
</Column>
```

### 3. Optional: EventListener Component

```typescript
<Column>
  <EventListener
    target={window}
    event="resize"
    callback={(e) => handleResize(e)}
  />

  <Text>Responsive content</Text>
</Column>
```

## Implementation

### Basic Structure

All timer components extend `Component` and are invisible (0x0 size, never render):

```typescript
export interface IntervalProps {
  callback: () => void;
  delay: number;
  enabled?: State<boolean>; // Reactive pause/resume
}

export class Interval extends Component {
  private intervalId?: number;
  private callback: () => void;
  private delay: number;

  constructor(props: IntervalProps) {
    super({ visible: new State(false) }); // Invisible

    this.callback = props.callback;
    this.delay = props.delay;

    // Start interval if enabled (default true)
    if (!props.enabled || props.enabled.value) {
      this.start();
    }

    // Bind to enabled state for reactive pause/resume
    if (props.enabled) {
      this.bind(props.enabled, (enabled) => {
        if (enabled) {
          this.start();
        } else {
          this.stop();
        }
      });
    }
  }

  private start() {
    if (!this.intervalId) {
      this.intervalId = setInterval(this.callback, this.delay);
    }
  }

  private stop() {
    if (this.intervalId) {
      clearInterval(this.intervalId);
      this.intervalId = undefined;
    }
  }

  override destroy() {
    this.stop();
    super.destroy();
  }

  override draw() {
    return []; // Never renders anything
  }
}
```

### Advanced Features

#### Reactive Enable/Disable

```typescript
const enabled = new State(true);

<Interval
  callback={() => tick()}
  delay={1000}
  enabled={enabled}  // Pause/resume based on state
/>

// Later: enabled.value = false; // Pauses interval
```

#### One-shot vs Repeating

```typescript
<Timeout
  callback={() => onTimeout()}
  delay={5000}
  repeat={false}  // Default: one-shot
/>
```

#### Error Handling

```typescript
<Interval
  callback={() => mayFail()}
  delay={1000}
  onError={(err) => console.error('Callback failed:', err)}
/>
```

## Pros and Cons

### Pros

1. **Declarative & Component-based** - Fits the framework's mental model perfectly
2. **Automatic lifecycle management** - Components already have destroy() built-in
3. **JSX-friendly** - Natural syntax, visible in component tree
4. **Composable** - Can be combined with other components
5. **No API changes to Component base class** - Zero breaking changes
6. **Discoverable** - Shows up in autocomplete, imports, examples
7. **Inspectable** - Can see timers in component hierarchy/tree
8. **Reactive** - Can bind to State for enable/disable
9. **Consistent** - Uses same lifecycle as everything else
10. **Testable** - Easy to mock/test in isolation

### Cons

1. **Verbose for simple cases** - More characters than `setInterval()`
2. **Callback limitations** - Harder to access local scope (need to pass refs or use closures)
3. **Not idiomatic JavaScript** - Developers expect `setInterval()`, not `<Interval/>`
4. **Performance** - Creates actual component instances (though minimal overhead)
5. **Confusing at first** - "Why is a timer a component?"
6. **Callback updates** - If callback needs to change, component needs updating
7. **Return value** - Can't easily get the timer ID (though usually not needed)

## Use Cases

### Game Loop

```typescript
<Column>
  <AnimationFrame callback={(ts) => updateGame(ts)} />
  <MapView gameWorld={world} />
  <FirstPersonView gameWorld={world} />
</Column>
```

### Periodic Data Refresh

```typescript
const enabled = new State(true);

<Column>
  <Interval
    callback={() => fetchData()}
    delay={5000}
    enabled={enabled}  // Pause when user navigates away
  />
  <DataDisplay data={dataState} />
</Column>
```

### Delayed UI Updates

```typescript
<Column>
  <Timeout
    callback={() => showMessage.value = false}
    delay={3000}
  />
  {showMessage.value && <Text>Message will disappear in 3s</Text>}
</Column>
```

### Window Event Handling

```typescript
<App>
  <EventListener
    target={window}
    event="resize"
    callback={() => handleResize()}
  />
  <Column>...</Column>
</App>
```

## Comparison with Alternatives

| Approach             | Ease of Use | Safety         | Discoverability | Framework Fit | Verbosity |
| -------------------- | ----------- | -------------- | --------------- | ------------- | --------- |
| Manual cleanup       | ⚠️ Hard     | ❌ Error-prone | ❌ Hidden       | ⚠️ Okay       | ⚠️ Medium |
| registerCleanup()    | ✅ Easy     | ✅ Safe        | ⚠️ Medium       | ✅ Good       | ✅ Low    |
| Scoped timer methods | ✅ Easy     | ✅ Safe        | ✅ Good         | ✅ Good       | ✅ Low    |
| **Timer Components** | ⚠️ Medium   | ✅ Very Safe   | ✅ Excellent    | ✅ Excellent  | ❌ High   |

## Migration Strategy

If implemented, timer components would be **additive** and **optional**:

1. **Keep registerCleanup()** - For imperative code and edge cases
2. **Add timer components** - For declarative JSX usage
3. **Update examples** - Show both approaches
4. **Document trade-offs** - Help users choose the right tool

Example migration:

```typescript
// Before (using registerCleanup)
const intervalId = setInterval(() => tick(), 1000);
container.registerCleanup(() => clearInterval(intervalId));

// After (using component)
<Column>
  <Interval callback={() => tick()} delay={1000} />
</Column>
```

## Implementation Checklist

If approved for implementation:

- [ ] Implement `Interval` component
- [ ] Implement `Timeout` component
- [ ] Implement `AnimationFrame` component
- [ ] (Optional) Implement `EventListener` component
- [ ] Add comprehensive tests
- [ ] Update documentation
- [ ] Create examples showing usage
- [ ] Export from main index.ts
- [ ] Add TypeScript declarations
- [ ] Performance benchmarks (overhead vs native)

## Open Questions

1. **Should callbacks be updateable?** Allow changing the callback without recreating the component?
2. **Should we support requestIdleCallback?** Another useful browser API
3. **Should EventListener support capture/passive options?** Full API parity with addEventListener
4. **How to handle errors in callbacks?** Try/catch wrapper with optional error handler?
5. **Should components expose pause/resume methods?** Or rely purely on enabled state?

## Alternatives Considered

### 1. Scoped Timer Methods on Component

```typescript
component.setInterval(() => {...}, 1000);
component.setTimeout(() => {...}, 5000);
```

**Pros:** Familiar API, automatic cleanup
**Cons:** Adds methods to every component, not declarative

### 2. Lifecycle Hooks

```typescript
component.onMount(() => {
  const id = setInterval(...);
  return () => clearInterval(id); // cleanup
});
```

**Pros:** React-like, familiar pattern
**Cons:** Bigger architectural change, requires rethinking component model

### 3. Timer Service/Registry

```typescript
TimerRegistry.interval(() => {...}, 1000, component);
```

**Pros:** Centralized management
**Cons:** Not discoverable, global state, feels like a workaround

## Recommendation

**Implement alongside registerCleanup(), not instead of it.**

Timer components excel in:

- JSX-heavy, declarative UIs
- Visual component trees (debugging/inspection)
- Reactive enable/disable based on state
- Complex compositions

registerCleanup() excels in:

- Imperative factory functions
- Simple one-off timers
- Code with heavy local scope access
- Performance-critical paths

Both approaches have value and serve different use cases.

## References

- [React useEffect cleanup pattern](https://react.dev/reference/react/useEffect#cleanup)
- [Svelte onDestroy](https://svelte.dev/docs/svelte#ondestroy)
- [Vue onBeforeUnmount](https://vuejs.org/api/composition-api-lifecycle.html#onbeforeunmount)
- [Solid onCleanup](https://www.solidjs.com/docs/latest/api#oncleanup)

---

**Status Note:** This is a design proposal and has not been implemented. The `registerCleanup()` API has been implemented as a simpler, more flexible alternative. Timer components remain a potential future enhancement if demand warrants the additional verbosity and learning curve.
