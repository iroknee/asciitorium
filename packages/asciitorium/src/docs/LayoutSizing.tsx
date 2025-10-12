import { Text, Component, Row, Column, Line } from '../index';
import { BaseStyle } from './constants';

/**
 * Layout & Sizing Reference
 *
 * Demonstrates various layout patterns and sizing options.
 */
export const LayoutSizingDoc = () => (
  <Component style={BaseStyle} label="Layout & Sizing">
      <Text width="100%" align="center" height={5} label="Header" border>
        100% width, fixed 5 height
      </Text>
      <Line direction="horizontal" />
      <Row width="fill" height="fill">
        <Text label="Sidebar" width="25%" height="fill" border>
          {`
          • 25% width,
          • fill height
          `}
        </Text>
        <Line direction="vertical" />
        <Column width="fill" height="fill">
          <Text width="fill" height="80%" label="Main" border>
            width fill to expand, height 80% of remaining space
          </Text>
          <Line direction="horizontal" width="fill" />
          <Text width="fill" height="fill" label="Footer" border>
            fill remaining space
          </Text>
        </Column>
      </Row>
  </Component>
);
