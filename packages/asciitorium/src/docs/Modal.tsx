import { Component, State, Button, Text, Fragment, ComponentStyle } from '../index';
import { BaseStyle } from './constants';

/**
 * Modal Component Reference
 *
 * Demonstrates overlay modals with visibility state and z-positioning.
 */
export const ModalDoc = () => {
  const showModal = new State(false);
  const modalMessage = new State('Modal is now visible!');
  const modalStyle: ComponentStyle = { width: 40, position: { x: 8, y: 8 }, border: true, align: "center", background: '.' };

  // Create a computed State for the modal status display
  const modalStatus = new State('Modal visible: NO');

  // Update modalStatus whenever showModal changes
  showModal.subscribe(value => {
    modalStatus.value = `Modal visible: ${value ? 'YES' : 'NO'}`;
  });

  // Simple modal component with high z-index
  const Modal = () => (
    <Component visible={showModal} style={modalStyle}>
      <Text align="center" gap={{ bottom: 1 }}>Modal Window</Text>
      <Text align="center" gap={{ bottom: 1 }}>{modalMessage}</Text>
      <Text align="center">Click [C]lose or [T]oggle to close</Text>
      <Button
        align="center"
        hotkey="c"
        gap={{ top: 2 }}
        onClick={() => (showModal.value = false)}
      >
        Close (C)
      </Button>
    </Component>
  );

  return (
    <Component style={BaseStyle} label="Modal Component">
      <Text align="center" gap={{ top: 2 }}>Modal Visibility Test</Text>

      <Text align="center" gap={{ top: 1 }}>
        Test the visibility feature with State-driven show/hide
      </Text>

      <Button
        align="center"
        hotkey="t"
        gap={{ top: 6, bottom: 7 }}
        onClick={() => {
          if (!showModal.value) {
            // Opening the modal - set timestamped message
            modalMessage.value = `Modal opened at ${new Date().toLocaleTimeString()}`;
          }
          showModal.value = !showModal.value;
        }}
      >
        Toggle Modal (T)
      </Button>

      <Text align="center">
        {modalStatus}
      </Text>

      <Text align="center" gap={{ top: 1 }}>
        Hotkeys: T=Toggle, C=Close
      </Text>

      {/* Modal window */}
      <Modal />
    </Component>
  );
};
