import { Line, Column, Row, Text } from './index';
import { BaseStyle } from './constants';

/**
 * Layout Basics
 *
 * Guide to layout approaches in asciitorium.
 */
export const LayoutBasics = () => {
  return (
    <Column style={BaseStyle} gap={1} label="Layout Basics">
      <Text width="90%" align="center" gap={{ bottom: 2, top: 2 }}>
        Asciitorium provides multiple layout approaches for organizing
        components. Layouts automatically calculate child positions and sizes
        based on the layout type and available space.
      </Text>

      <Text width="90%" align="center">
        Available Layout Types
      </Text>
      <Line width="90%" align="center" />

      <Text width="90%" align="left" gap={{ left: 4 }}>
        • Row Layout — arranges children horizontally left-to-right
      </Text>

      <Text width="90%" align="left" gap={{ left: 4 }}>
        • Column Layout — arranges children vertically top-to-bottom
      </Text>

      <Text width="90%" align="center" gap={{ top: 2 }}>
        Row Layout Example:
      </Text>

      <Text width="90%" align="center" gap={{ bottom: 1 }} wrap={false}>
        {`
 <Row gap={2} border>
    <Text border>First</Text>
    <Text border>Second</Text>
    <Text border>Third</Text>
 </Row>
`}
      </Text>

      <Row align="center" gap={2} border label="Row Demo">
        <Text border>First</Text>
        <Text border>Second</Text>
        <Text border>Third</Text>
      </Row>

      <Text width="90%" align="center" gap={{ top: 2 }}>
        Column Layout Example:
      </Text>

      <Text width="90%" align="center" gap={{ bottom: 1 }} wrap={false}>
        {`
 <Column gap={1} border>
    <Text border>First</Text>
    <Text border>Second</Text>
    <Text border>Third</Text>
 </Column>
`}
      </Text>

      <Column
        width="90%"
        align="center"
        gap={1}
        border
        label="Column Demo"
      >
        <Text border>First</Text>
        <Text border>Second</Text>
        <Text border>Third</Text>
      </Column>

      <Text width="90%" align="center" gap={{ top: 2, bottom: 2 }}>
        Use the Row and Column components for automatic layout, or set the
        position property on any component for absolute positioning. Layouts
        respect gap, alignment, and sizing properties for flexible composition.
      </Text>
    </Column>
  );
};
