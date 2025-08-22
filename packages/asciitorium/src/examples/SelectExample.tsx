import { Text, State, Select, Component, HR } from '../index';

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
    <Component width={42} height={28} label="Select Example:" border>
      <Component align="center" gap={{ top: 2, bottom: 2 }}>
        <Select
          label="Car's to Select:"
          width={34}
          height={10}
          items={carModels}
          selectedItem={selectValue}
        />
      </Component>
      <Component align="center" gap={{ left: 5 }} layout="row">
        <Text>Car Selected: </Text>
        <Text width={20}>{selectValue}</Text>
      </Component>
    </Component>
  );
};
