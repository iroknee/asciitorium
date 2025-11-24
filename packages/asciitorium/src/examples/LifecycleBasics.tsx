import { Art, Line, Column, Text } from "../index.js";
import { BaseStyle } from './constants.js';

/**
 * Lifecycle Basics
 *
 * Guide to component lifecycle management and cleanup patterns in asciitorium.
 */
export const LifecycleBasics = () => {
  const spawnFirework = (container: Column) => {
    // Random x position, fixed y position
    const x = Math.floor(Math.random() * 60) + 10;
    const y = 1;

    const firework = new Art({
      sprite: 'firework',
      position: { x, y },
    });

    container.addChild(firework);

    // Remove firework after animation completes (~800ms for 8 frames at 100ms each)
    const timeoutId = setTimeout(() => {
      container.removeChild(firework);
      firework.destroy();
    }, 800);

    // Clean up the timeout if container is destroyed before timeout fires
    container.registerCleanup(() => clearTimeout(timeoutId));
  };

  const demoContainer = (
    <Column width="90%" height={12} border label="Fireworks Demo" gap={{ left: 4, bottom: 2 }}>
     
    </Column>
  );

  // Spawn a firework every 2 seconds
  const intervalId = setInterval(() => {
    spawnFirework(demoContainer);
  }, 2000);

  const container = (
    <Column style={BaseStyle} label="Lifecycle Basics">
      <Text width="90%" gap={{ bottom: 1, top: 1 }}>
        Components have a lifecycle. When removed from the UI, they must clean
        up resources like timers, intervals, and event listeners to prevent
        memory leaks and phantom renders.
        Without proper cleanup, timers and intervals continue running even after
        a component is destroyed. This causes:
      </Text>

      {/* prettier-ignore */}
      <Text width="90%" gap={{ left: 6, bottom: 1 }}>
        • Memory leaks — resources never released ¶
        • Phantom renders — requestRender() called by dead components ¶
        • Unexpected behavior — callbacks executing on unmounted state ¶
      </Text>

      <Text width="90%">
        Use: registerCleanup()
      </Text>
      <Line width="90%" />

      <Text width="90%" gap={{ left: 4, bottom: 1 }}>
        Use registerCleanup() to register cleanup functions that run when the
        component is destroyed. This is the recommended way to clean up timers,
        intervals, and other resources.
      </Text>

      <Text width="90%" gap={{ left: 4, bottom: 2 }} border>
        {`const intervalId = setInterval(() => { ... }, 1000);

const container = <Column>...</Column>;

// Register cleanup - automatically called on destroy
container.registerCleanup(() => clearInterval(intervalId));

return container;`}
      </Text>

      <Text width="90%">
        Live Example: Firework Spawner
      </Text>
      <Line width="90%" />

      <Text width="90%" gap={{ left: 4, bottom: 1 }}>
        This example spawns fireworks every 2 seconds using setInterval. The
        interval is cleaned up automatically when you navigate away from this
        page using registerCleanup().
      </Text>

      {demoContainer}
    </Column>
  );

  // Register cleanup for the interval - called automatically when component is destroyed
  container.registerCleanup(() => clearInterval(intervalId));

  return container;
};
