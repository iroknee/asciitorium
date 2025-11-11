import { Line, Column, Row, Text } from './index.js';
import { BaseStyle } from './constants.js';

/**
 * Text Component Basics
 *
 * Guide to using the Text component with textAlign and other properties.
 */
export const TextBasics = () => {
  return (
    <Column style={BaseStyle} label="Text Component Basics">
      <Text width="90%" gap={{ bottom: 1, top: 1 }}>
        The Text component has a few extra properties than other components that
        supports text alignment, wrapping, and scrolling.
      </Text>
      <Text width="90%">Common Properties</Text>
      <Line width="90%" />

      {/* prettier-ignore */}
      <Text width="90%" gap={{ left: 6 }}>
        • textAlign — Position text within component (9-point grid) ¶
        • wrap — Enable/disable text wrapping (default: true) ¶
        • scrollable — Enable scrolling for long content (default: false) ¶
        • typewriter — Enable typewriter effect (default: false) ¶
        • typewriterSpeed — Speed of typewriter effect (chars per second) ¶
        • \¶ — use \¶ to insert a line break within text ¶
      </Text>

      <Text width="90%">
        Typewriter Effect
      </Text>
      <Line width="90%" />

      <Text width="90%" gap={{ left: 4 }}>
        Use typewriter=true to create a typewriter effect. Control the speed
        with typewriterSpeed (characters per second).
      </Text>

      <Text
        width={48}
        align="center"
        border
        typewriter
        typewriterSpeed={30}
        label="Typewriter Effect (30 chars/sec)"
      >
        This text appears with a classic typewriter effect. Each character is
        revealed one at a time, creating a dynamic typing animation that draws
        attention to your content.
      </Text>

      <Text width="90%">Text Alignment</Text>
      <Line width="90%" />

      <Text width="90%" gap={{ left: 4 }}>
        The textAlign property positions text within the Text component using a
        9-position grid: top-left, top, top-right, left, center, right,
        bottom-left, bottom, bottom-right.
      </Text>

      <Row width={15} align="center">
        <Text height={5} width={5} border textAlign="top-left">
          A
        </Text>
        <Text width={5} height={5} border textAlign="top">
          B
        </Text>
        <Text width={5} height={5} border textAlign="top-right">
          C
        </Text>
      </Row>

      <Row width={15} align="center">
        <Text height={5} width={5} border textAlign="left">
          D
        </Text>
        <Text width={5} height={5} border textAlign="center">
          E
        </Text>
        <Text width={5} height={5} border textAlign="right">
          F
        </Text>
      </Row>

      <Row width={15} align="center">
        <Text height={5} width={5} border textAlign="bottom-left">
          G
        </Text>
        <Text width={5} height={5} border textAlign="bottom">
          H
        </Text>
        <Text width={5} height={5} border textAlign="bottom-right">
          I
        </Text>
      </Row>
    </Column>
  );
};
