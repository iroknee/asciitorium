import { Text, State, Component, Row } from '../index.js';
import { BaseStyle } from './constants.js';
import {
  ProgressBarSlider,
  GaugeSlider,
  DotSlider,
  VerticalSlider,
} from '../components/Sliders.js';

/**
 * Sliders Component Reference
 *
 * Demonstrates various slider styles and value binding.
 */
export const SlidersDoc = () => {
  const sharedValue = new State(50);
  const volumeValue = new State(75);

  return (
    <Component style={BaseStyle} label="Sliders">
      <Text height={2} align="center" gap={{ top: 1, bottom: 1 }}>
        All sliders share the same value for comparison
      </Text>

      <Row gap={{ left: 1, bottom: 2 }} height={3} align="left">
        <Text width={14} gap={{ top: 1 }}>
          Progress:
        </Text>
        <ProgressBarSlider
          value={sharedValue}
          min={0}
          max={100}
          step={5}
          width={24}
          hotkey="p"
        />
        <Text width={3} height={3} gap={{ top: 1 }}>
          {sharedValue}
        </Text>
      </Row>

      <Row height={3} gap={{ left: 1, bottom: 1 }}>
        <Text width={14}>Gauge Style:</Text>
        <GaugeSlider
          value={sharedValue}
          min={0}
          max={100}
          step={5}
          width={24}
          hotkey="g"
        />
        <Text width={3}>{sharedValue}</Text>
      </Row>

      <Row height={1} gap={{ left: 1, bottom: 1 }} align="left">
        <Text width={14}>Dot Pattern:</Text>
        <DotSlider value={sharedValue} min={0} max={100} step={5} width={24} hotkey='d' />
        <Text width={3} align="right">{sharedValue}</Text>
      </Row>

      <Row height="fill" gap={{ left: 1, top: 2 }} align="left">
        <Text width={14}>Vertical:</Text>
        <VerticalSlider
          value={volumeValue}
          min={0}
          max={100}
          step={10}
          width={3}
          height="fill"
          hotkey="v"
        />
        <Text width={6}>{volumeValue}</Text>

        <Text height={10} width={18} align="top">
          Use ← → arrows or A/D keys for horizontal sliders Use ↑ ↓ arrows or
          W/S keys for vertical slider
        </Text>
      </Row>
    </Component>
  );
};
