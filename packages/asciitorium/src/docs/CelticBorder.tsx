import { Component, CelticBorder, Text } from '../index.js';
import { BaseStyle } from './constants.js';

/**
 * CelticBorder Component Reference
 *
 * Demonstrates decorative corner borders in ASCII art.
 */
export const CelticBorderDoc = () => {
  return (
    <Component style={BaseStyle} label="CelticBorder Component">
        <CelticBorder position={{ x: 0, y: 0 }} />
        <CelticBorder position={{ x: 0, y: -3 }} />
        <Text align="center" width={30} >CelticBorder Component is an example of how to create decorative borders in ASCII art.</Text>
        <CelticBorder position={{ x: -3, y: 0 }} />
        <CelticBorder position={{ x: -3, y: -3 }} />
    </Component>
  );
};
