import { Line, Column, Row, Text } from './index.js';
import { BaseStyle } from './constants.js';

/**
 * Component Alignment Basics
 *
 * Guide to alignment system using 'align'.
 */
export const AlignmentBasics = () => {
  return (
    <Column style={BaseStyle} label="Align & Gap Basics">
      <Text width="90%" gap={{ bottom: 2, top: 1 }}>
        Asciitorium uses the 'align' property to group and position
        all children together within their parent container. It uses
        gap to add spacing around individual children.
      </Text>

      <Text width="90%">
        Align Property
      </Text>
      <Line width="90%" />

      {/* prettier-ignore */}
      <Text width="90%" gap={{ left: 6, bottom: 1 }}>
        • Parent 'align' - Groups ALL children and positions them together ¶
        • 9 values: top-left, top, top-right, center-left, center, ¶
          center-right, bottom-left, bottom, bottom-right ¶
      </Text>

      <Text width="90%">
        Align Examples
      </Text>
      <Line width="90%" />

      <Text width="90%" gap={{ left: 6, bottom: 1 }}>
        All children are grouped and positioned together:
      </Text>

      <Row width="90%" align="center" gap={{ bottom: 2 }}>
        <Row width={18} height={9} border label="row, center" align="center">
          <Text border>A</Text>
          <Text border>B</Text>
          <Text border>C</Text>
        </Row>

        <Column
          width={18}
          height={9}
          border
          label="column, center"
          align="center"
        >
          <Text border>A</Text>
          <Text border>B</Text>
          <Text border>C</Text>
        </Column>

        <Row
          width={18}
          height={9}
          border
          label="bottom-left"
          align="bottom-left"
        >
          <Text border>A</Text>
          <Text border>B</Text>
          <Text border>C</Text>
        </Row>
      </Row>

      <Text width="90%">
        Gap Property
      </Text>
      <Line width="90%" />

      {/* prettier-ignore */}
      <Text width="90%" gap={{ left: 6, bottom: 1 }}>
        • Child 'gap' - Adds spacing around individual children ¶
        • Format: gap=&#123;&#123; top: 1, bottom: 2, left: 3, right: 4 &#125;&#125; ¶
        • Can use any combination of top, bottom, left, right ¶
        • Works independently from parent alignment ¶
      </Text>

      <Text width="90%" gap={{ left: 6, bottom: 1 }}>
        Gap examples with different spacing:
      </Text>

      <Row width="90%" align="center" gap={{ bottom: 2 }}>

        <Row width={28} height={5} border label="gap: 2">
          <Text border gap={{ right: 2 }}>A</Text>
          <Text border gap={{ right: 2 }}>B</Text>
          <Text border>C</Text>
        </Row>

        <Row width={28} height={5} border label="mixed gaps">
          <Text border gap={{ left: 2 }}>A</Text>
          <Text border gap={{ bottom: 1, left: 4 }}>B</Text>
          <Text border>C</Text>
        </Row>
      </Row>

      <Text width="90%" gap={{ left: 4 }}>
        Tip: Use align for group positioning, gap for individual spacing
      </Text>
    </Column>
  );
};
