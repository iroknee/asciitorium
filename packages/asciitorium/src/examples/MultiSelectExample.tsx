import { Text, State, MultiSelect, Component } from '../index';

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
    <Component label="MultiSelect Example:" width={48} height={28} border>
      <MultiSelect
        label="Car Parts:"
        align="center"
        width={34}
        height={10}
        items={carParts}
        selectedItems={multiValue}
        gap={{ top: 2, bottom: 2 }}
      />
      <Component align="center" layout="row">
        <Text align="top">Selected: </Text>
        <Text
          width={24}
          height={7}
          align="top"
          content={displayText}
        />
      </Component>
    </Component>
  );
};