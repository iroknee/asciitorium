import { Text, State, ProgressBar, Button, Box } from '../index';

export const ProgressBarExample = () => {
  // State for progress bar - local to each component instance
  const progressValue = new State(25);

  return (
    <Box width={53} height={27} border={true} layout="vertical">
      <Text
        width={40}
        height={2}
        children={['ProgressBar Examples with controls']}
      />
      <ProgressBar
        width={35}
        percent={progressValue}
        showPercentage={true}
        gap={1}
      />
      <ProgressBar
        width={35}
        percent={progressValue}
        showPercentage={false}
        gap={2}
      />
      <Button
        label="Increase"
        width={10}
        height={3}
        onClick={() =>
          (progressValue.value = Math.min(100, progressValue.value + 10))
        }
        gap={1}
      />
      <Button
        label="Decrease"
        width={10}
        height={3}
        onClick={() =>
          (progressValue.value = Math.max(0, progressValue.value - 10))
        }
        gap={1}
      />
      <Button
        label="Reset"
        width={10}
        height={3}
        onClick={() => (progressValue.value = 25)}
        gap={1}
      />
      <Text width={30} height={2} gap={1} children={[progressValue]} />
    </Box>
  );
};
