import { Text, Component, Row, Column, State } from '../index';

const dynamicContent = new State('Dynamic content changes!');
setInterval(() => {
  const messages = ['Dynamic content changes!', 'State updates work!', 'Real-time text!'];
  dynamicContent.value = messages[Math.floor(Math.random() * messages.length)];
}, 2000);

export const TextExample = () => (
  <Component border label="Text Component Features:">
    <Row gap={2}>
      <Column gap={1}>
        <Text border label="Basic Text">Simple text without wrapping</Text>
        
        <Text border label="Multi-line" width={20} height={4}>
          {'Line 1\nLine 2\nLine 3\nLine 4'}
        </Text>
        
        <Text border label="Auto-wrap" width={20} height={5}>
          This long text will automatically wrap to fit within the specified width and height constraints.
        </Text>
        
        <Text border label="Dynamic State" width={25}>
          {dynamicContent}
        </Text>
      </Column>
      
      <Column gap={1}>
        <Text border label="Left Align" width={20} align="left">
          Left aligned
        </Text>
        
        <Text border label="Center Align" width={20} align="center">
          Centered
        </Text>
        
        <Text border label="Right Align" width={20} align="right">
          Right aligned
        </Text>
        
        <Text border label="Word Breaking" width={15} height={3}>
          Supercalifragilisticexpialidocious
        </Text>
      </Column>
    </Row>
    
    <Text border label="Large Text Block" width={60} height={6}>
      This demonstrates a larger text area with automatic word wrapping. The Text component intelligently handles line breaks, respects explicit newlines, and breaks long words when necessary. It supports both static strings and dynamic State objects for real-time updates.
    </Text>
  </Component>
);
