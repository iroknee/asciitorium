import { Art, Text, Column } from '../index';
import { BaseStyle } from './constants';

export function ArtExample() {
  return (
    <Column style={BaseStyle} label="ASCII Art Example:">
      <Art gap={2} src="./art/castle.txt" align="center" />
      <Text width="75%" align="center" gap={2}>
        The Art component can load ASCII Art asynchronously with the src
        prop similar to an HTML img tag.
      </Text>
    </Column>
  );
}
