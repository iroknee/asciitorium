import { Line, Column, Row, Text } from './index';
import { BaseStyle } from './constants';

/**
 * Component Alignment Basics
 *
 * Simple guide to the 'align' prop - cross-axis positioning only.
 */
export const AlignmentBasics = () => {
  return (
    <Column style={BaseStyle} label="Alignment Basics">
      <Text width="90%" align="center" gap={{ bottom: 2, top: 2 }}>
        The 'align' prop positions component children on the cross-axis using
        simple keywords.
      </Text>

      <Text width="90%" align="center">
        Simple Alignment Rules
      </Text>
      <Line width="90%" align="center" />

      <Text width="90%" align="left" gap={{ left: 4, top: 1 }}>
        • Row children: use 'top', 'center', or 'bottom'
      </Text>

      <Text width="90%" align="left" gap={{ left: 4, bottom: 2 }}>
        • Column children: use 'left', 'center', or 'right'
      </Text>

      <Text width="90%" align="center">
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

        <Column width={23} height={12} border label="Column Alignment">
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

        <Row width={23} height={12} border label="Row Alignment">
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
      <Text width="90%" align="center" gap={{ left: 4, top: 1 }}>
        • For spacing between children: use the 'gap' prop
      </Text>
    </Column>
  );
};
