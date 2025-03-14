// React Imports
import React from 'react';
// Material UI Imports
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import ClearIcon from '@mui/icons-material/Clear';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import useMediaQuery from '@mui/material/useMediaQuery';
import { useTheme } from '@mui/material/styles';
// Component Imports
import ConfirmationButton from './ConfirmationButton';
import LogoutButton from './LogoutButton';

/**
 * ConfirmationModal - Component that allows users to cancel or
 * confirm their previously chosen action
 *
 * @memberof Modals
 * @name ConfirmationModal
 * @param {object} Props - Props used for ConfirmationModal
 * @param {boolean} Props.showModal - Toggle showing modal
 * @param {React.Dispatch<React.SetStateAction<boolean>>} Props.setShowModal
 * - Used to close the modal
 * @param {string} Props.title - Text rendered in dialog title & confirmationButton
 * @param {string} Props.text - Text rendered in dialog content text
 * @param {string} Props.confirmButtonText - Text rendered in the confirmation button
 * @param {string} Props.cancelButtonText - Text rendered in the cancel button
 * @param {Function} Props.onConfirm - Callback that runs onClick of confirm button
 * @param {Function} Props.onCancel - Callback that runs onClick of cancel button and after modal is closed (optional)
 * @param {boolean} Props.processing - State used to disable button
 * @param {boolean} [Props.isLogout] - Boolean to wrap button with inrupt logout
 * functionality
 * @returns {React.JSX.Element} The confirmation modal
 */
const ConfirmationModal = ({
  showModal,
  setShowModal,
  title = 'Are you sure?',
  text = 'Are you sure you want to do this?',
  confirmButtonText = 'Confirm',
  cancelButtonText = 'Cancel',
  onConfirm = () => {},
  onCancel = () => {},
  processing,
  isLogout = false
}) => {
  const theme = useTheme();
  const isSmallScreen = useMediaQuery(theme.breakpoints.down('sm'));

  const confirmButton = () =>
    isLogout ? (
      <LogoutButton onLogout={() => localStorage.clear()}>
        <ConfirmationButton
          title={confirmButtonText}
          confirmFunction={onConfirm}
          processing={processing}
        />
      </LogoutButton>
    ) : (
      <ConfirmationButton
        title={confirmButtonText}
        confirmFunction={onConfirm}
        processing={processing}
      />
    );

  const handleClose = () => {
    setShowModal(false);
    onCancel();
  };

  return (
    <Dialog
      open={showModal}
      aria-labelledby="dialog-title"
      aria-describedby="dialog-description"
      onClose={handleClose}
      PaperProps={{ sx: { borderRadius: '25px' } }}
    >
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center'
        }}
      >
        <DialogTitle id="dialog-title" sx={{ fontWeight: 'bold' }}>
          {title}
        </DialogTitle>

        <DialogContent id="dialog-description">
          <DialogContentText>{text}</DialogContentText>
        </DialogContent>

        <DialogActions sx={{ width: '100%' }}>
          <Box
            sx={{
              display: 'flex',
              flexDirection: isSmallScreen ? 'column' : 'row',
              gap: isSmallScreen ? '10px' : '8px',
              width: '100%'
            }}
          >
            <Button
              variant="outlined"
              color="error"
              endIcon={<ClearIcon />}
              onClick={handleClose}
              fullWidth
            >
              {cancelButtonText}
            </Button>
            {confirmButton()}
          </Box>
        </DialogActions>
      </Box>
    </Dialog>
  );
};

export default ConfirmationModal;
