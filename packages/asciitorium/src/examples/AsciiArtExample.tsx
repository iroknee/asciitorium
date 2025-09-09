import { AsciiArt, Text, Column } from '../index';
import { BaseStyle } from './constants';

export function AsciiArtExample() {
  return (
    <Column style={BaseStyle} label="ASCII Art Example:">
      <AsciiArt gap={2} src="./art/castle.txt" align="center" />
      <Text width="75%" align="center" gap={2}>
        The AsciiArt component can load ASCII art asynchronously with the src
        prop like an HTML img tag.
      </Text>
    </Column>
  );
}
