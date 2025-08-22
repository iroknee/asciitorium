import { AsciiArt, Box, loadArt } from '../index';

const computer = await loadArt('./art/computer.txt');

export const AsciiArtExample = () => (
  <Box width={42} height={28} layout="relaxed" label="ASCII Art Example:" border>
    <AsciiArt content={computer} align="center" />
  </Box>
);
