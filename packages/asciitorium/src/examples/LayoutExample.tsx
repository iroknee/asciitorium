import { Text, HR, VR, Box, CelticBorder } from '../index';

export const LayoutExample = () => (
  <Box width={53} height={27} border={true} layout="vertical">
    <Text
      width={40}
      height={2}
      children={['Layout Components - HR, VR, Box, Borders']}
    />
    <HR length={35} gap={1} />
    <Box
      width={20}
      height={5}
      border={true}
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
    <HR length={35} gap={1} />
    <Text
      width={35}
      height={2}
      children={['Layout components help organize\nand structure your UI.']}
    />
  </Box>
);
