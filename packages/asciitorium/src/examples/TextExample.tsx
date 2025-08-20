import { Text, AsciiArt, Box } from '../index';

export const TextExample = () => (
  <Box width={53} height={27} border={true} layout="vertical">
    <Text width={40} height={2} children={['Text & AsciiArt Examples']} />
    <Text
      width={35}
      height={3}
      border={true}
      gap={1}
      children={['This is bordered text with\nmultiple lines and formatting.']}
    />
    <Text
      width={25}
      height={4}
      border={true}
      gap={1}
      children={[
        'This is a long text that should wrap automatically when width and height are specified and the content exceeds the available space.',
      ]}
    />
    <AsciiArt
      width={25}
      height={6}
      gap={1}
      children={['  ╭─────╮\n  │ Hi! │\n  ╰─────╯\n   ASCII\n    Art']}
    />
    <Text
      width={35}
      height={2}
      gap={1}
      children={[
        'Text components now support automatic\nword wrapping for long content!',
      ]}
    />
  </Box>
);
