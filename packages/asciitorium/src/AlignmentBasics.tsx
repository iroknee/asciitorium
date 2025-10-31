import { Line, Column, Row, Text } from './index';
import { BaseStyle } from './constants';

/**
 * Component Alignment Basics
 *
 * Simple guide to the 'align' prop - cross-axis positioning only.
 */
export const AlignmentBasics = () => {
  return (
    <Column style={BaseStyle} label="Component Alignment Basics">
      <Text width="90%" align="center" gap={{ bottom: 2, top: 2 }}>
        The 'align' prop positions component children on the cross-axis using
        simple keywords.
      </Text>

      <Text width="90%" align="center">
        Simple Alignment Rules
      </Text>
      <Line width="90%" align="center" />

      <Text width="90%" align="left" gap={{ left: 4, top: 1 }}>
        • Row children: use 'top', 'center', or 'bottom' (vertical positioning)
      </Text>

      <Text width="90%" align="left" gap={{ left: 4, top: 1, bottom: 2 }}>
        • Column children: use 'left', 'center', or 'right' (horizontal
        positioning)
      </Text>

      <Text width="90%" align="center" gap={{ top: 2 }}>
        Examples
      </Text>
      <Line width="90%" align="center" gap={{ bottom: 1 }} />

      <Row width={36} align="center">
        <Column width={13} height={12} border label="Column">
          <Text align="center" border>
            A
          </Text>
          <Text align="center" border>
            B
          </Text>
          <Text align="center" border>
            C
          </Text>
        </Column>

        <Column width={23} height={12} border label="Column Aligned">
          <Text align="left" border>
            left
          </Text>
          <Text align="center" border>
            center
          </Text>
          <Text align="right" border>
            right
          </Text>
        </Column>
      </Row>

      <Row width={36} align="center">
        <Row width={13} height={12} border label="Row">
          <Text align="center" border>
            A
          </Text>
          <Text align="center" border>
            B
          </Text>
          <Text align="center" border>
            C
          </Text>
        </Row>

        <Row width={23} height={12} border label="Row Aligned">
          <Text align="top" border>
            top
          </Text>
          <Text align="center" border>
            center
          </Text>
          <Text align="bottom" border>
            bottom
          </Text>
        </Row>
      </Row>

      <Text width="90%" align="center" gap={{ top: 2 }}>
        Column Layout - Horizontal Alignment
      </Text>
      <Line width="90%" align="center" gap={{ bottom: 1 }} />

      <Text width="90%" align="center" gap={{ top: 2 }}>
        Other Options
      </Text>
      <Line width="90%" align="center" gap={{ bottom: 1 }} />

      <Text width="90%" align="left" gap={{ left: 4, top: 1 }}>
        • For spacing between children: use the 'gap' prop
      </Text>

      <Text width="90%" align="left" gap={{ left: 4, top: 1 }}>
        • For numeric offsets: use the 'position' prop (e.g., position=
        {`{{ x: 10, y: 5 }}`})
      </Text>

      <Row width="90%" border label="Using gap for spacing" gap={{ top: 2 }}>
        <Text border gap={{ right: 2 }}>
          A
        </Text>
        <Text border gap={{ right: 5 }}>
          B
        </Text>
        <Text border>C</Text>
      </Row>

      <Text
        width="90%"
        border
        label="Using position for offset"
        gap={{ top: 2 }}
      >
        <Text position={{ x: 10, y: 2 }} border>
          Positioned at (10, 2)
        </Text>
      </Text>
    </Column>
  );
};
