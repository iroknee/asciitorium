import { Text, Component, Row, Column, HR, VR } from '../index';
import { BaseStyle } from './constants';

export const LayoutSizingExample = () => (
  <Component style={BaseStyle} label="Layout & Sizing Examples">
      <Text width="100%" align="center" height={5} label="Header" border>
        100% width, fixed 5 height
      </Text>
      <HR />
      <Row width="fill" height="fill">
        <Text label="Sidebar" width="25%" height="fill" border>
          {`
          • 25% width,
          • fill height
          `}
        </Text>
        <VR />
        <Column width="fill" height="fill">
          <Text width="fill" height="80%" label="Main" border>
            width fill to expand, height 80% of remaining space
          </Text>
          <HR width="fill" />
          <Text width="fill" height="fill" label="Footer" border>
            fill remaining space
          </Text>
        </Column>
      </Row>
  </Component>
);
