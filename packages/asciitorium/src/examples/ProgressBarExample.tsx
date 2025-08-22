import { Text, State, ProgressBar, Button, Component, HR } from '../index';

export const ProgressBarExample = () => {
  // State for progress bar - local to each component instance
  const progressValue = new State(25);

  return (
    <Component width={42} height={28} border label="ProgressBar Example:" >
      <Text align="center" gap={{top: 2}}>With Percentage</Text>
      <ProgressBar
        width={35}
        percent={progressValue}
        align="center"
        showPercentage
      />
      <Text align="center" gap={{top: 2}}>Without Percentage</Text>
      <ProgressBar
        width={35}
        percent={progressValue}
        showPercentage={false}
        align="center"
      />

      <Component layout="row" align="center" gap={{ top: 3 }}>
        <Button
          label="Increase"
          onClick={() =>
            (progressValue.value = Math.min(100, progressValue.value + 10))
          }
          gap={1}
        />
        <Button
          label="Decrease"
          onClick={() =>
            (progressValue.value = Math.max(0, progressValue.value - 10))
          }
          gap={1}
        />
      </Component>
    </Component>
  );
};
