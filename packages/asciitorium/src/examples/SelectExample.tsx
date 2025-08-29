import { Text, State, Select, Component, Column, Row } from '../index';

export const SelectExample = () => {
  const selectValue = new State('Tesla Model S');

  const carModels = [
    'Tesla Model S',
    'BMW M3',
    'Audi A4',
    'Mercedes C-Class',
    'Honda Civic',
    'Toyota Camry',
    'Ford Mustang',
    'Chevrolet Corvette',
    'Porsche 911',
    'Ferrari 488',
    'Lamborghini Huracan',
    'McLaren 720S',
    'Nissan GTR',
    'Subaru WRX',
  ];

  return (
    <Column label="Select Example:" border>
      <Select
        gap={1}
        align="center"
        label="Car's to Select:"
        width="60%"
        height="50%"
        items={carModels}
        selectedItem={selectValue}
      />
      <Row align="center" width="40%">
        <Text>Car Selected: </Text>
        <Text width={20}>{selectValue}</Text>
      </Row>
    </Column>
  );
};
