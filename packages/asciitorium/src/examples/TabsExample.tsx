import { Component, Tabs, Text, State } from "../index";

function contentForTab(tab: string): string {
  switch (tab) {
    case "Tab 1":
      return "Content for Tab 1\nThis shows dynamic content\nbased on selected tab.";
    case "Tab 2":
      return "Content for Tab 2\nDifferent content here!\nTabs make navigation easy.";
    case "Tab 3":
      return "Content for Tab 3\nYet another section.\nUse arrow keys to switch.";
    default:
      return "Select a tab above";
  }
}

export function TabsExample() {
  // Selected tab
  const tabsValue = new State("Tab 1");

  // Derived content as its own State so <Text> can react
  const tabContentState = new State<string>(contentForTab(tabsValue.value));

  // Update derived state whenever the tab changes
  tabsValue.subscribe((tab) => {
    tabContentState.value = contentForTab(tab);
  });

  return (
    <Component border label="Tabs Example:">
      <Tabs
        tabs={["Tab 1", "Tab 2", "Tab 3"]}
        align="center"
        selectedTab={tabsValue}
        gap={1}
      />
      <Component width={38} height={8} gap={1}>
        <Text width={30} height={6} value={tabContentState} />
      </Component>
    </Component>
  );
}
