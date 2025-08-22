import { Text, HR, VR, Component, CelticBorder } from '../index';

export const LayoutExample = () => (
  <Component width={42} height={27} border layout="column">
    <Text
      width={40}
      height={2}
    >
      Layout Components - HR, VR, Box, Borders
    </Text>
    <HR gap={1} />
    <Component
      width={20}
      height={5}
      border
      gap={1}
      children={[
        new Text({
          width: 16,
          height: 3,
          children: ['Box with border\nand content'],
        }),
      ]}
    />
    <CelticBorder
      width={20}
      height={5}
      gap={1}
      children={[
        new Text({
          width: 16,
          height: 3,
          children: ['Celtic border\ndecoration'],
        }),
      ]}
    />
    <HR gap={1} />
    <Text
      width={35}
      height={2}
    >
      Layout components help organize\nand structure your UI.
    </Text>
  </Component>
);
