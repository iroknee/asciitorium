import { AsciiArt, Component, loadArt, State } from '../index';

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
    <Component layout="aligned" label="ASCII Art Example:" border>
      <AsciiArt content={computer.value} align="center" />
    </Component>
  );
}
