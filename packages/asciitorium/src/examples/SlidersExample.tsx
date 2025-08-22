import { Text, State, Component } from '../index';
import {
  ProgressBarSlider,
  GaugeSlider,
  DotSlider,
  VerticalSlider,
} from '../components/Sliders';

export const SlidersExample = () => {
  const sharedValue = new State(50);
  const volumeValue = new State(75);

  return (
    <Component width={42} height={28} label="Sliders:" border>
      <Text height={2} width={32} align="center" gap={{ top: 1, bottom: 1 }}>
        All sliders share the same value for comparison
      </Text>

      <Component layout="row" gap={{ left: 1, bottom: 2 }} align="left">
        <Text width={8} height={3} align="center">
          Progress
        </Text>
        <ProgressBarSlider
          value={sharedValue}
          min={0}
          max={100}
          step={5}
          width={24}
        />
        <Text width={4} height={3} align="center">
          {sharedValue}
        </Text>
      </Component>

      <Component layout="row" gap={{ left: 1, bottom: 2 }} align="left">
        <Text width={8}>Gauge Style:</Text>
        <GaugeSlider
          value={sharedValue}
          min={0}
          max={100}
          step={5}
          width={24}
        />
        <Text width={4}>{sharedValue}</Text>
      </Component>

      <Component layout="row" gap={{ left: 1, bottom: 1 }} align="left">
        <Text width={8}>Dot Pattern:</Text>
        <DotSlider value={sharedValue} min={0} max={100} step={5} width={24} />
        <Text width={4}>{sharedValue}</Text>
      </Component>

      <Component layout="row" gap={{ left: 1, top: 2 }} align="left">
        <Text width={10}>Vertical:</Text>
        <VerticalSlider
          value={volumeValue}
          min={0}
          max={100}
          step={10}
          width={3}
          height={10}
        />
        <Text width={6}>{volumeValue}</Text>

        <Text height={10} width={18} align="top">
          Use ← → arrows or A/D keys for horizontal sliders Use ↑ ↓ arrows or
          W/S keys for vertical slider
        </Text>
      </Component>
    </Component>
  );
};
