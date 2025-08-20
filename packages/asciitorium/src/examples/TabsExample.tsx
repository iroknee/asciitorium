import { Text, State, Tabs, Box } from '../index';

export const TabsExample = () => {
  // State for tabs - local to each component instance
  const tabsValue = new State('Tab 1');

  // Dynamic content state based on selected tab
  const tabContentState = new State('');
  tabsValue.subscribe((tab) => {
    switch (tab) {
      case 'Tab 1':
        tabContentState.value =
          'Content for Tab 1\nThis shows dynamic content\nbased on selected tab.';
        break;
      case 'Tab 2':
        tabContentState.value =
          'Content for Tab 2\nDifferent content here!\nTabs make navigation easy.';
        break;
      case 'Tab 3':
        tabContentState.value =
          'Content for Tab 3\nYet another section.\nUse arrow keys to switch.';
        break;
      default:
        tabContentState.value = 'Select a tab above';
    }
  });

  // Initialize content
  tabContentState.value =
    tabsValue.value === 'Tab 1'
      ? 'Content for Tab 1\nThis shows dynamic content\nbased on selected tab.'
      : tabsValue.value === 'Tab 2'
        ? 'Content for Tab 2\nDifferent content here!\nTabs make navigation easy.'
        : 'Content for Tab 3\nYet another section.\nUse arrow keys to switch.';

  return (
    <Box width={53} height={27} border={true} layout="vertical">
      <Text
        width={40}
        height={2}
        children={['Tabs Example with dynamic content']}
      />
      <Tabs
        tabs={['Tab 1', 'Tab 2', 'Tab 3']}
        selectedTab={tabsValue}
        width={35}
        gap={1}
      />
      <Box
        width={35}
        height={8}
        border={true}
        gap={1}
        children={[
          new Text({ width: 30, height: 6, children: [tabContentState] }),
        ]}
      />
    </Box>
  );
};
