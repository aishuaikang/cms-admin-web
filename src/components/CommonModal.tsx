import { forwardRef } from 'react';
import { Box, Modal, ModalProps, ScrollArea } from '@mantine/core';

const CommonModal = forwardRef<HTMLDivElement, ModalProps>(
  ({ children, ...props }, ref) => {
    return (
      <Modal
        ref={ref}
        {...props}
        centered
        scrollAreaComponent={ScrollArea.Autosize}
        removeScrollProps={{ allowPinchZoom: true }}
        overlayProps={{
          backgroundOpacity: 0.55,
          blur: 3,
        }}
        transitionProps={{ transition: 'scale' }}
      >
        <Box className="relative">{children}</Box>
      </Modal>
    );
  }
);

export default CommonModal;
