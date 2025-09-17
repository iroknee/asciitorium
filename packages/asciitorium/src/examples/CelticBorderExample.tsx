import { Component, CelticBorder, Text } from '../index';
import { BaseStyle } from './constants';

export const CelticBorderExample = () => {
  return (
    <Component style={BaseStyle} layout="aligned" label="CelticBorder Example">
        <CelticBorder align="top-left" />
        <CelticBorder align="bottom-left" />
        <Text align="center" width={30} >CelticBorder Component is an example of how to create decorative borders in ASCII art.</Text>
        <CelticBorder align="top-right" />
        <CelticBorder align="bottom-right" />
    </Component>
  );
};
