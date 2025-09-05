import { Text, Component, Row } from '../index';

export const RelativeSizingExample = () => (
  <Component height="fill" border label="Relative Sizing Example:">
    <Text width="80%" height={3} border gap={1}>
      This text component uses 80% of parent width
    </Text>
    
    <Row width="100%" height="50%" border>
      <Text width="25%" height="fill" border gap={1}>
        25% width
      </Text>
      <Text width="50%" height="fill" border gap={1}>
        50% width - this demonstrates how percentage-based sizing works with the parent container
      </Text>
      <Text width="25%" height="fill" border gap={1}>
        25% width
      </Text>
    </Row>
    
    <Text width="fill" height={5} border>
      This text uses 'fill' to take remaining space
    </Text>
    
    <Component width="75%" height={8} border label="Nested Container" gap={1}>
      <Text width="100%" height="50%">
        Nested: 100% of parent (which is 75% of grandparent)
      </Text>
      <Text width="100%" height="50%">
        Another nested component using percentages
      </Text>
    </Component>
  </Component>
);