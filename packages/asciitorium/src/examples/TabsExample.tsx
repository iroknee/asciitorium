import { Text, State, Tabs, Component } from '../index';

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
    <Component border label="Tabs Example:">
      <Tabs
        tabs={['Tab 1', 'Tab 2', 'Tab 3']}
        align="center"
        selectedTab={tabsValue}
        gap={1}
      />
      <Component
        width={38}
        height={8}
        gap={1}
        children={[
          new Text({ width: 30, height: 6, children: [tabContentState] }),
        ]}
      />
    </Component>
  );
};
