import { Switch, Case, Default, Art, Column, Text } from './dist/index.js';
import { State } from './dist/index.js';

const GuestPanel = () => {
  console.log('GuestPanel factory called');
  const art = new Art({ font: 'pencil', text: 'Guest Mode' });
  console.log('Art component created:', art);
  return new Column({ 
    width: 100, 
    height: 10, 
    border: true, 
    label: 'Guest', 
    children: [art, new Text({ children: 'Welcome!' })] 
  });
};

const userRole = new State('');

const guestPanel = GuestPanel();
console.log('GuestPanel instance:', guestPanel);
console.log('GuestPanel children:', guestPanel.getChildren());

const defaultComp = new Default({ children: [guestPanel] });
console.log('Default component:', defaultComp);
console.log('Default children:', defaultComp.getChildren());

const switchComp = new Switch({ 
  condition: userRole,
  width: 100,
  height: 15,
  children: [defaultComp]
});

console.log('Switch component:', switchComp);
console.log('Switch children:', switchComp.getChildren());
