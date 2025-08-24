import { AsciiArt, Component, loadArt } from '../index';

let computer: string | null = null;

// Load art asynchronously
loadArt('./art/computer.txt').then(art => {
  computer = art;
}).catch(err => {
  console.warn('Failed to load computer art:', err);
  computer = 'Failed to load art';
});

export const AsciiArtExample = () => (
  <Component width={48} height={28} layout="aligned" label="ASCII Art Example:" border>
    <AsciiArt content={computer || 'Loading...'} align="center" />
  </Component>
);
