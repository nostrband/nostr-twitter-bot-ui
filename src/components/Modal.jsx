import * as React from 'react';
import Box from '@mui/material/Box';
import UiModal from '@mui/material/Modal';
import { styled } from '@mui/material';

export default function Modal({ children, fullWidth, open, onClose }) {
  return (
    <div>
      <UiModal
        open={open}
        onClose={() => onClose(false)}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <StyledBox fullWidth={fullWidth}>{children}</StyledBox>
      </UiModal>
    </div>
  );
}

const StyledBox = styled(Box)`
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: ${(props) => (props.fullWidth ? props.fullWidth : '325px')};
  background-color: white;
  border-radius: 8px;
  padding: 15px;
  outline: none;
`;
