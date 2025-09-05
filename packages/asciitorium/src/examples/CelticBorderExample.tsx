import { Text, Component, Column, CelticBorder } from '../index';

export const CelticBorderExample = () => {
  return (
    <Component height="fill" layout="aligned" label="CelticBorder Example:" border>
        <CelticBorder align="top-left" />
        <CelticBorder align="bottom-left" />
        <CelticBorder align="top-right" />
        <CelticBorder align="bottom-right" />
    </Component>
  );
};
