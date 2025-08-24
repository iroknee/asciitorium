import { Text, Component, CelticBorder } from '../index';

export const CelticBorderExample = () => {
  return (
    <Component
      width={48}
      height={28}
      layout="row"
      label="CelticBorder Example:"
      border
    >
      <Component layout="column" align="center" gap={{ top: 1, left: 10 }}>
        <Text gap={{ bottom: 1 }} align="center" content="top-left" />
        <CelticBorder align="center" gap={{ bottom: 1 }} edge="top-left" />
        <CelticBorder align="center" gap={{ bottom: 1 }} edge="bottom-left" />
        <Text align="center" content="bottom-left" />
      </Component>
      <Component layout="column" align="center" gap={{ top: 1 }}>
        <Text gap={{ bottom: 1 }} align="center" content="top-right" />
        <CelticBorder
          align="center"
          gap={{ left: 2, bottom: 1 }}
          edge="top-right"
        />
        <CelticBorder
          align="center"
          gap={{ left: 2, bottom: 1 }}
          edge="bottom-right"
        />
        <Text align="center" gap={{ left: 4 }} content="bottom-right" />
      </Component>
    </Component>
  );
};
