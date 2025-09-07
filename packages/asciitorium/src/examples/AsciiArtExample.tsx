import { AsciiArt, Component, loadArt, State, Text } from '../index';

const computer = new State<string>('Loading...');

// Load art asynchronously and refresh the UI when done
loadArt('./art/computer.txt')
  .then((art) => computer.value = art)
  .catch((err) => {
    console.warn('Failed to load computer art:', err);
    computer.value = 'Failed to load art';
  })

export function AsciiArtExample() {
  return (
    <Component height="fill" layout="column" label="ASCII Art Example:" border>
      <Component height="fill" layout="aligned">
        <AsciiArt content={computer} align="center" />
      </Component>
      <Text width="75%" align="center" gap={{bottom: 1}}
      content="The AsciiArt component can load and display ASCII art from files using the loadArt() function. Art is loaded asynchronously and can be centered or aligned as needed." />

    </Component>
  );
}
