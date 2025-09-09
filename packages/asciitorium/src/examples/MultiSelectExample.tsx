import { Text, State, MultiSelect, Component, Row } from '../index';
import { BaseStyle } from './constants';

export const MultiSelectExample = () => {
  const multiValue = new State(['Suspension', 'Brakes']);
  const displayText = new State(multiValue.value.join(', '));

  multiValue.subscribe((newValue) => {
    displayText.value = newValue.join(', ');
  });

  const carParts = [
    'Engine',
    'Transmission',
    'Brakes',
    'Suspension',
    'Exhaust',
    'Radiator',
    'Battery',
    'Alternator',
    'Starter',
    'Fuel Pump',
    'Air Filter',
    'Oil Filter',
    'Spark Plugs',
    'Tires',
    'Wheels',
  ];

  return (
    <Component style={BaseStyle} label="MultiSelect Example:">
      <MultiSelect
        label="Car Parts:"
        align="center"
        width={34}
        height={10}
        items={carParts}
        selectedItems={multiValue}
        gap={{ top: 2, bottom: 2 }}
      />
      <Row align="center">
        <Text align="top">Selected: </Text>
        <Text
          width={24}
          height={7}
          align="top"
          content={displayText}
        />
      </Row>
    </Component>
  );
};