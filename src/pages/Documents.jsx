import React, { useContext, useEffect, useState } from 'react';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import { useLocation } from 'react-router-dom';
import { useTheme } from '@emotion/react';
import { Container, useMediaQuery } from '@mui/material';
import { ConfirmationModal, SetAclPermissionsModal, UploadDocumentModal } from '@components/Modals';
import { useNotification, useSession } from '@hooks';
import { DocumentListContext } from '@contexts';
import { truncateText } from '@utils';
import { DocumentTable } from '@components/Documents';

/**
 * Documents - Component that generates Documents Page for PASS
 *
 * @memberof Pages
 * @name Documents
 * @returns {React.JSX.Component} The Documents Page
 */
const Documents = () => {
  // Route related states
  const location = useLocation();
  if (location.pathname.split('/')[1] === 'contacts') {
    localStorage.setItem('restorePath', '/contacts');
  } else {
    localStorage.setItem('restorePath', '/profile');
  }
  const { setContact } = useContext(DocumentListContext);
  const theme = useTheme();
  const isSmallScreen = useMediaQuery(theme.breakpoints.down('sm'));

  // Documents related states
  const { session } = useSession();
  const [showConfirmationModal, setShowConfirmationModal] = useState(false);
  const [processing, setProcessing] = useState(false);
  const { addNotification } = useNotification();
  const { removeDocument } = useContext(DocumentListContext);
  const [selectedDocToDelete, setSelectedDocToDelete] = useState(null);
  const [showAddDocModal, setShowAddDocModal] = useState(false);
  const [showAclPermissionModal, setShowAclPermissionModal] = useState(false);
  const [dataset, setDataset] = useState({
    modalType: '',
    docName: '',
    docType: ''
  });

  useEffect(() => {
    setContact({
      familyName: '',
      givenName: '',
      podUrl: session.info.webId?.split('profile')[0],
      thingId: session.info.webId,
      webId: session.info.webId
    });
  }, [session]);

  const handleSelectDeleteDoc = (document) => {
    setSelectedDocToDelete(document);
    setShowConfirmationModal(true);
  };

  // Function for deleting documents
  const handleDeleteDoc = async () => {
    setProcessing(true);
    try {
      await removeDocument(selectedDocToDelete.name);
      addNotification('success', `${selectedDocToDelete?.name} deleted from the pod.`);
    } catch (e) {
      addNotification('error', `Document deletion failed. Reason: ${e.message}`);
    } finally {
      setShowConfirmationModal(false);
      setProcessing(false);
    }
  };

  const handleAclPermissionsModal = (modalType, docName = '', docType = '') => {
    setDataset({
      modalType,
      docName,
      docType
    });
    setShowAclPermissionModal(true);
  };

  const truncatedText = selectedDocToDelete?.name ? truncateText(selectedDocToDelete.name) : '';

  return (
    <Container
      sx={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        width: '100%'
      }}
    >
      <Box
        sx={{
          display: 'flex',
          gap: 2,
          flexDirection: 'row',
          paddingLeft: '0px'
        }}
      >
        <Button
          variant="outlined"
          color="primary"
          size="small"
          onClick={() => handleAclPermissionsModal('container')}
          sx={{
            width: isSmallScreen ? '165px' : '200px',
            borderColor: 'primary.main',
            padding: '6px 12px'
          }}
        >
          Share Documents
        </Button>
        <Button
          variant="contained"
          color="primary"
          size="small"
          onClick={() => setShowAddDocModal(true)}
          sx={{ width: isSmallScreen ? '140px' : '180px', padding: '6px 12px' }}
        >
          Add Document
        </Button>
        <UploadDocumentModal showModal={showAddDocModal} setShowModal={setShowAddDocModal} />
        <SetAclPermissionsModal
          showModal={showAclPermissionModal}
          setShowModal={setShowAclPermissionModal}
          dataset={dataset}
        />
        <ConfirmationModal
          showModal={showConfirmationModal}
          setShowModal={setShowConfirmationModal}
          title="Delete Document"
          text={`You're about to delete "${truncatedText}" from the pod. Do you wish to continue?`}
          onConfirm={handleDeleteDoc}
          confirmButtonText="Delete"
          processing={processing}
        />
      </Box>
      <DocumentTable
        handleAclPermissionsModal={handleAclPermissionsModal}
        handleSelectDeleteDoc={(document) => handleSelectDeleteDoc(document)}
      />
    </Container>
  );
};

export default Documents;
