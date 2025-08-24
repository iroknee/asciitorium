import { Text, Component, Row, Column, CelticBorder } from '../index';

export const CelticBorderExample = () => {
  return (
    <Row
      width={48}
      height={28}
      label="CelticBorder Example:"
      border
    >
      <Column align="center" gap={{ top: 1, left: 10 }}>
        <Text gap={{ bottom: 1 }} align="center" content="top-left" />
        <CelticBorder align="center" gap={{ bottom: 1 }} edge="top-left" />
        <CelticBorder align="center" gap={{ bottom: 1 }} edge="bottom-left" />
        <Text align="center" content="bottom-left" />
      </Column>
      <Column align="center" gap={{ top: 1 }}>
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
      </Column>
    </Row>
  );
};
