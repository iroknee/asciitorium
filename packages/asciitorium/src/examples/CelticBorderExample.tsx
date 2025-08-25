import { Text, Row, Column, CelticBorder } from '../index';

export const CelticBorderExample = () => {
  return (
    <Row label="CelticBorder Example:" border>
      <Column align="center" width="30%" gap={{ left: 4, top: 2 }}>
        <Text gap={{ bottom: 1 }} content="top-left" />
        <CelticBorder gap={{ bottom: 1 }} edge="top-left" />
        <CelticBorder gap={{ bottom: 1 }} edge="bottom-left" />
        <Text content="bottom-left" />
      </Column>
      <Column gap={{ top: 2 }}>
        <Text gap={{ bottom: 1 }} content="top-right" />
        <CelticBorder gap={{ bottom: 1 }} edge="top-right" />
        <CelticBorder gap={{ bottom: 1 }} edge="bottom-right" />
        <Text content="bottom-right" />
      </Column>
    </Row>
  );
};
