import { Component, CelticBorder } from '../index';
import { BaseStyle } from './constants';

export const CelticBorderExample = () => {
  return (
    <Component style={BaseStyle} layout="aligned" label="CelticBorder Example:">
        <CelticBorder align="top-left" />
        <CelticBorder align="bottom-left" />
        <CelticBorder align="top-right" />
        <CelticBorder align="bottom-right" />
    </Component>
  );
};
