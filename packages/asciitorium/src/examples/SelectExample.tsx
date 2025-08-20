import { Text, State, Select, MultiSelect, Box, HR } from '../index';

export const SelectExample = () => {
  // States for select components - local to each component instance
  const selectValue = new State('Option 1');
  const multiValue = new State(['Option 2']);

  return (
    <Box width={53} height={28} border layout="vertical">
      <Text align="top" content="  " />
      <Text align="center" gap={1} content="Select & MultiSelect Examples" />
      <HR length={51} gap={2} />
      <Box layout="horizontal" align="center" gap={2}>
        <Select
          label="Single Select"
          width={20}
          height={8}
          items={['Option 1', 'Option 2', 'Option 3', 'Red', 'Green', 'Blue']}
          selectedItem={selectValue}
          gap={1}
        />
        <MultiSelect
          label="Multi Select"
          width={20}
          height={8}
          items={['Item A', 'Item B', 'Item C', 'Item D', 'Item E']}
          selectedItems={multiValue}
          gap={1}
        />
      </Box>
      <Text
        width={40}
        align="center"
        children={[
          new State(
            `Selected: ${selectValue.value} | Multi: [${multiValue.value.join(', ')}]`
          ),
        ]}
      />
    </Box>
  );
};
