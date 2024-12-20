// React Imports
import React, { useState, useContext } from 'react';
// Material UI Imports
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import ClearIcon from '@mui/icons-material/Clear';
import DialogActions from '@mui/material/DialogActions';
import FileUploadIcon from '@mui/icons-material/FileUpload';
import FormControl from '@mui/material/FormControl';
import Backdrop from '@mui/material/Backdrop';
// import FormControlLabel from '@mui/material/FormControlLabel';
import FormHelperText from '@mui/material/FormHelperText';
// import Switch from '@mui/material/Switch';
import TextField from '@mui/material/TextField';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import useMediaQuery from '@mui/material/useMediaQuery';
import { useTheme } from '@mui/material/styles';
/* import Slide from '@mui/material/Slide'; */
// Context Imports
import { DocumentListContext } from '@contexts';
// Component Imports
import { LoadingAnimation } from '@components/Notification';
import ModalBase from './ModalBase';
import { DocumentSelection, FormSection } from '../Form';
import UploadButtonGroup from './UploadButtonGroup';
import useNotification from '../../hooks/useNotification';
import UploadDocumentConfirmationModal from './UploadDocumentConfirmationModal';

/**
 * UploadDocumentModal - Component that generates the form for uploading
 * a specific document type to a user's Solid Pod via Solid Session
 *
 * @memberof Modals
 * @name UploadDocumentModal
 * @param {object} Props - Props for UploadDocumentModal component
 * @param {boolean} Props.showModal - Boolean for showing upload documents modal
 * @param {React.Dispatch<React.SetStateAction<boolean>>} Props.setShowModal
 * - React set function for setting showModal state
 * @returns {React.JSX.Element} The UploadDocumentModal Component
 */

const UploadDocumentModal = ({ showModal, setShowModal }) => {
  const { addNotification } = useNotification();
  const [expireDate, setExpireDate] = useState(null);
  const [docDescription, setDocDescription] = useState('');
  const [docType, setDocType] = useState('');
  // const [verifyFile, setVerifyFile] = useState(false);
  const [file, setFile] = useState(null);
  const [inputKey, setInputKey] = useState(false);
  const { addDocument, replaceDocument } = useContext(DocumentListContext);
  const [processing, setProcessing] = useState(false);
  const theme = useTheme();
  const isSmallScreen = useMediaQuery(theme.breakpoints.down('sm'));
  const [showConfirmationModal, setShowConfirmationModal] = useState(false);
  const [confirmationModalType, setConfirmationModalType] = useState('add');

  const handleDocType = (event) => {
    setDocType(event.target.value);
  };

  const clearInputFields = () => {
    // setVerifyFile(false);
    setDocType('');
    setFile('');
    setInputKey(!inputKey); // Clears file by forcing re-render
    setDocDescription('');
    setDocType('');
    setExpireDate(null);
    setShowModal(false);
  };

  const compileDocData = () => ({
    name: file.name,
    type: docType,
    date: expireDate,
    description: docDescription
  });

  const cleanup = () => {
    setShowConfirmationModal(false);
    setConfirmationModalType('add');
    setProcessing(false);
    clearInputFields();
  };

  const handleDocAdd = async () => {
    const docData = compileDocData();

    try {
      await addDocument(docData, file);
      addNotification('success', `File uploaded to Solid.`);
      cleanup();
    } catch (error) {
      switch (error.message) {
        case 'File already exists':
          // The confirmation modal will prompt the user to replace the file or not
          setConfirmationModalType('replace');
          setShowConfirmationModal(true);
          break;
        default:
          addNotification('error', `File failed to upload. Reason: ${error.message}`);
      }
    }
  };

  const handleDocReplace = async () => {
    const docData = compileDocData();

    try {
      await replaceDocument(docData, file);
      addNotification('success', `File updated on Solid.`);
      cleanup();
    } catch (error) {
      addNotification('error', `File failed to upload. Reason: ${error.message}`);
    }
  };

  const handleUploadCancelled = () => {
    setProcessing(false);
  };

  // Event handler for form/document submission to Pod
  const onFormSubmit = async (e) => {
    e.preventDefault();
    setProcessing(true);
    handleDocAdd();
  };

  return (
    <ModalBase open={showModal} aria-labelledby="upload-document-dialog" onClose={clearInputFields}>
      <UploadDocumentConfirmationModal
        showModal={showConfirmationModal}
        setShowModal={setShowConfirmationModal}
        onCancel={handleUploadCancelled}
        onConfirm={confirmationModalType === 'add' ? handleDocAdd : handleDocReplace}
        uploadType={confirmationModalType}
      />
      <FormSection title="Upload Document">
        <form onSubmit={onFormSubmit} autoComplete="off" style={{ width: '100%' }}>
          {/* TODO: Fully implement this switch */}
          {/* <FormControlLabel
            control={<Switch />}
            label="Verify file on upload"
            id="verify-checkbox"
            value={verifyFile}
            checked={verifyFile}
            // onChange={() => setVerifyFile(!verifyFile)}
          /> */}
          <FormControl fullWidth>
            <FormControl margin="normal">
              <DocumentSelection
                htmlForAndIdProp="upload-doc"
                handleDocType={handleDocType}
                docType={docType}
              />
            </FormControl>
            <FormControl margin="normal">
              <LocalizationProvider dateAdapter={AdapterDayjs}>
                <DatePicker
                  name="date"
                  format="MM/DD/YYYY"
                  label="Expiration Date"
                  value={expireDate}
                  onChange={(newExpireDate) => setExpireDate(newExpireDate)}
                  type="date"
                />
              </LocalizationProvider>
            </FormControl>
            <TextField
              margin="normal"
              name="description"
              multiline
              rows={3}
              label="Enter Description"
              value={docDescription}
              onChange={(newDocDescription) => setDocDescription(newDocDescription.target.value)}
              placeholder="Add a description here"
            />
            <UploadButtonGroup file={file} setFile={setFile} />
            <FormHelperText
              sx={{
                width: '200px',
                whiteSpace: 'nowrap',
                overflow: 'hidden',
                textOverflow: 'ellipsis'
              }}
            >
              File to upload: {file ? file.name : 'No file selected'}
            </FormHelperText>

            <DialogActions sx={{ width: '100%' }}>
              <Box
                sx={{
                  display: 'flex',
                  flexDirection: isSmallScreen ? 'column' : 'row',
                  gap: isSmallScreen ? '10px' : '8px',
                  justifyContent: 'center',
                  alignItems: 'center',
                  width: '100%'
                }}
              >
                <Button
                  variant="outlined"
                  color="error"
                  startIcon={<ClearIcon />}
                  onClick={clearInputFields}
                  fullWidth
                >
                  Cancel
                </Button>
                <Button
                  variant="contained"
                  disabled={processing || !file}
                  type="submit"
                  color="primary"
                  startIcon={<FileUploadIcon />}
                  fullWidth
                >
                  Upload
                </Button>
              </Box>
            </DialogActions>
          </FormControl>
        </form>
      </FormSection>
      <Backdrop open={processing}>
        <LoadingAnimation loadingItem={file?.name} isModal />
      </Backdrop>
    </ModalBase>
  );
};

export default UploadDocumentModal;
