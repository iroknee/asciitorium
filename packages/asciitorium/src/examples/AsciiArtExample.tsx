import { AsciiArt, Component, loadArt, State, Text, Row } from '../index';

const computer = new State<string>('Loading...');

export function AsciiArtExample() {
  return (
    <Component height="fill" layout="column" label="ASCII Art Example:" border>
      <AsciiArt gap={2} src="./art/castle.txt" align="center" />
      <Text width="75%" align="center" gap={2}>
        The AsciiArt component can load ASCII art asynchronously with the src prop like an HTML img tag.
      </Text>
    </Component>
  );
}
