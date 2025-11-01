import { Line, Column, Row, Text } from './index';
import { BaseStyle } from './constants';

/**
 * Text Component Basics
 *
 * Guide to using the Text component with textAlign and other properties.
 */
export const TextBasics = () => {
  return (
    <Column style={BaseStyle} label="Text Component Basics">
      <Text width="90%" align="center" gap={{ bottom: 2, top: 2 }}>
        The Text component displays text content with support for alignment,
        wrapping, scrolling, and more.
      </Text>
      <Text width="90%" align="center">
        Common Properties
      </Text>
      <Line width="90%" align="center" />

      <Text width="90%" align="left" gap={{ left: 4 }}>
        • textAlign — Position text within component (9-point grid)
      </Text>
      <Text width="90%" align="left" gap={{ left: 4 }}>
        • wrap — Enable/disable text wrapping (default: true)
      </Text>
      <Text width="90%" align="left" gap={{ left: 4, bottom: 2 }}>
        • scrollable — Enable scrolling for long content (default: false)
      </Text>

      <Text width="90%" align="center">
        Text Alignment
      </Text>
      <Line width="90%" align="center" />

      <Text width="90%" align="left" gap={{ left: 4, bottom: 1 }}>
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

      <Text width="90%" align="center" gap={{ top: 2 }}>
        Text Wrapping
      </Text>
      <Line width="90%" align="center" />

      <Text width="90%" align="left" gap={{ left: 4, bottom: 1 }}>
        Text automatically wraps to fit within the component width. Use
        wrap=false to disable wrapping.
      </Text>

      <Column width="90%" align="center">
        <Text width={40} border align="center" label="wrap=true (default)">
          This is a long line of text that will automatically wrap to fit within
          the component width.
        </Text>

        <Text
          width={40}
          border
          label="wrap=false"
          wrap={false}
          align="center"
          gap={{ top: 1 }}
        >
          This is a long line of text that will be truncated instead of wrapped.
        </Text>
      </Column>

      <Text width="90%" align="center" gap={{ top: 2 }}>
        Scrollable Text
      </Text>
      <Line width="90%" align="center"/>

      <Text width="90%" align="left" gap={{ left: 4, bottom: 1 }}>
        Use scrollable=true to enable scrolling for long content. Use arrow keys
        to scroll when focused.
      </Text>

      <Text
        width={48}
        height={8}
        hotkey="t"
        align="center"
        border
        scrollable
        label="Scrollable Text (use ↑↓ to scroll)"
      >
        {`Line 1: This is scrollable text

Line 2: You can use arrow keys

Line 3: to scroll through content

Line 4: that exceeds the height

Line 5: of the text component

Line 6: Keep scrolling...

Line 7: Almost there...

Line 8: You made it!

Line 9: But there's more...

Line 10: This is the end`}
      </Text>
    </Column>
  );
};
