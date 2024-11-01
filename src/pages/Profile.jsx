// React Imports
import React, { useContext, useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
// Custom Hooks Imports
import { useNotification, useSession } from '@hooks';
// Material UI Imports
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import CircularProgress from '@mui/material/CircularProgress';
import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';
import useMediaQuery from '@mui/material/useMediaQuery';
import { useTheme } from '@mui/material/styles';
// Context Imports
import { DocumentListContext } from '@contexts';
// Component Imports
import { ConfirmationModal, UploadDocumentModal, SetAclPermissionsModal } from '@components/Modals';
import { DocumentTable } from '@components/Documents';
import { ProfileComponent } from '@components/Profile';
import { LoadingAnimation } from '@components/Notification';
// Util Imports
import { truncateText } from '@utils';
// Model Helpers
import { fetchProfileInfo } from '../model-helpers';

/**
 * Profile Page - Page that displays the user's profile card information and
 * allow users to edit/update them on PASS
 *
 * @memberof Pages
 * @name Profile
 * @returns {React.JSX.Element} The Profile Page
 */
const Profile = () => {
  // Route related states
  const location = useLocation();
  if (location.pathname.split('/')[1] === 'contacts') {
    localStorage.setItem('restorePath', '/contacts');
  } else {
    localStorage.setItem('restorePath', '/profile');
  }
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

  // Profile related states
  const contact = location.state?.contact;
  const [contactProfile, setContactProfile] = useState(null);
  const webIdUrl = contact?.webId ?? session.info.webId;
  const [loadingProfile, setLoadingProfile] = useState(true);

  // Handler for the SetAclPermissions Modal that
  // sets the appropriate version of the modal to load,
  // and the file name for the relevant document, (if any)
  // before opening the modal.
  const handleAclPermissionsModal = (modalType, docName = '', docType = '') => {
    setDataset({
      modalType,
      docName,
      docType
    });
    setShowAclPermissionModal(true);
  };

  useEffect(() => {
    const fetchContactProfile = async () => {
      const profileData = await fetchProfileInfo(webIdUrl);
      setContactProfile({
        ...contact,
        ...profileData.profileInfo
      });
    };

    if (contact) {
      fetchContactProfile();
    } else {
      setContactProfile(null);
    }
  }, [contact]);

  useEffect(() => {
    setTimeout(() => {
      setLoadingProfile(false);
    }, 1000);
  }, []);

  const truncatedText = selectedDocToDelete?.name ? truncateText(selectedDocToDelete.name) : '';

  if (loadingProfile) {
    return (
      <LoadingAnimation loadingItem="Profile">
        <CircularProgress />
      </LoadingAnimation>
    );
  }

  return (
    <Container
      sx={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        width: '100%',
        height: isSmallScreen ? 'auto' : '60dvh',
        margin: '20px auto',
        justifyContent: 'center'
      }}
    >
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          gap: '20px',
          boxSizing: 'border-box',
          width: isSmallScreen ? '100%' : 'auto'
        }}
      >
        <Typography variant="h1" sx={{ fontWeight: 'bold', fontSize: '18px' }}>
          {contact ? 'Shared Profile' : 'My Profile'}
        </Typography>
        {/* TODO: Determine whether this Box is needed */}
        {/* <Box
          sx={{
            display: 'flex',
            gap: '5px',
            alignItems: 'center',
            flexDirection: isSmallScreen ? 'column' : 'row'
          }}
        /> */}

        <Box
          sx={{
            display: 'flex',
            gap: 2,
            flexDirection: 'row',
            paddingLeft: '0px'
          }}
        >
          {contact && (
            <Button
              variant="contained"
              color="primary"
              size="small"
              onClick={() => setShowAddDocModal(true)}
              sx={{ width: isSmallScreen ? '140px' : '180px', padding: '6px 12px' }}
            >
              Add Document
            </Button>
          )}
        </Box>
        <ProfileComponent contactProfile={contactProfile} webId={webIdUrl} />
        {contact && (
          <>
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
          </>
        )}
      </Box>
      {contact && (
        <DocumentTable
          handleAclPermissionsModal={handleAclPermissionsModal}
          handleSelectDeleteDoc={(document) => handleSelectDeleteDoc(document)}
        />
      )}
    </Container>
  );
};

export default Profile;
