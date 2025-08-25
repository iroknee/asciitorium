import { Text, AsciiArt, Component } from '../index';

export const TextExample = () => (
  <Component border label="Text Example:">
    <Text
      width={36}
      height={8}
      border
      gap={1}
    >
      {'This is bordered text with:\n\n - multiple lines,\n - food for thought, and\n - some formatting.'}
    </Text>
    <Text
      width={36}
      height={7}
      border
      gap={1}
    >
      This is a long text that should wrap automatically when width and height are specified and the content exceeds the available space.
    </Text>

    <Text>Simple Text.</Text>
  </Component>
);
