import { Art, Text, Column } from '../index';
import { BaseStyle } from './constants';

export function ArtExample() {
  return (
    <Column style={BaseStyle} label="ASCII Art Example">
      <Art gap={2} src="castle" align="center" />
      <Text width="75%" align="center" gap={2}>
        The Art component loads ASCII Art sprites using the AssetManager.
        Simply provide the sprite name and it loads from art/sprites/.
        Supports animation frames and hot reload during development.
      </Text>
    </Column>
  );
}
