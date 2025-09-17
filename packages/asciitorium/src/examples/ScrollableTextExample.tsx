import { Column, Text } from '../index';
import { BaseStyle } from './constants';

// Long text content to demonstrate scrolling
const longText = `This is a very long text that demonstrates the scrollable Text component functionality.

The scrollable Text component allows you to view content that exceeds the display area by using arrow keys or WASD keys to scroll up and down.

Key features:
• Arrow keys (↑↓) or W/S for scrolling
• Visual scroll indicators (↑↓) when content extends beyond viewport
• Focus management - only scrollable when focused
• Consistent UX with Select and MultiSelect components
• Backward compatible - non-scrollable Text components unchanged

This implementation extracts common scrolling logic into a shared ScrollableViewport class that is used by:
1. Select component
2. MultiSelect component
3. Text component (when scrollable: true)

The scrolling behavior is consistent across all three components, providing a unified user experience throughout the framework.

You can scroll through this text using the arrow keys or WASD when this component has focus. The scroll indicators (↑↓) will appear on the right side when there is more content above or below the current viewport.

This is the end of the demonstration text. Try scrolling up and down to see the scroll indicators in action!`;

export const ScrollableTextExample = () => (
  <Column label="Scrollable Text Example" style={BaseStyle}>
    <Text
      gap={2}
      align="center"
      width={60}
      height={15}
      border
      scrollable
      hotkey="T"
      label="Scrollable Text (press Tab to focus)"
    >
      {longText}
    </Text>

    <Text align="center">
      Focus the text above and use ↑↓ or W/S to scroll
    </Text>
  </Column>
);