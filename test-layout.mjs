import { Box, Text, App } from './packages/asciitorium/dist/asciitorium.es.js';
import { jsx } from './packages/asciitorium/dist/jsx/jsx-runtime.js';

console.log('Testing layout registration...');

try {
  const app = jsx(App, { width: 40, height: 20, children: [
    jsx(Box, { layout: "horizontal", children: [
      jsx(Text, { value: "Test 1" }),
      jsx(Text, { value: "Test 2" })
    ]})
  ]});
  console.log('✅ Success: Layout registration works!');
} catch (error) {
  console.log('❌ Error:', error.message);
}