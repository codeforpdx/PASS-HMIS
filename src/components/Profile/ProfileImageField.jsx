// React Imports
import React, { useContext, useState } from 'react';
// Custom Hooks Imports
import { useNotification, useSession } from '@hooks';
// Material UI Imports
import Avatar from '@mui/material/Avatar';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import HideImageIcon from '@mui/icons-material/HideImage';
import ImageIcon from '@mui/icons-material/Image';
// Contexts Imports
import { SignedInUserContext } from '@contexts';
// Component Imports
import ConfirmationModal from '../Modals/ConfirmationModal';

/**
 * ProfileImageField - Component that creates the editable inputs fields
 * for the Profile page
 *
 * @memberof Profile
 * @name ProfileImageField
 * @param {object} Props - Props used for ProfileImageField
 * @param {() => void} Props.loadProfileData - Handler function for setting local
 * state for profile card in PASS
 * @param {object} [Props.contactProfile] - Contact object with data from profile
 * or null if user profile is selected
 * @returns {React.JSX.Element} React component for ProfileImageField
 */
const ProfileImageField = ({ loadProfileData, contactProfile }) => {
  const { addNotification } = useNotification();
  const { session } = useSession();
  const { profileData, fetchProfileInfo, removeProfileImage, uploadProfileImage } =
    useContext(SignedInUserContext);
  const [profileImg, setProfileImg] = useState(localStorage.getItem('profileImage'));
  const [processing, setProcessing] = useState(false);
  const [showConfirmationModal, setShowConfirmationModal] = useState(false);
  const [hover, setHover] = useState(false);

  const handleProfileImage = async (event) => {
    if (event.target.files[0].size > 1 * 1000 * 1024) {
      addNotification('error', 'Profile images have a maximum size of 1MB.');
    } else {
      await uploadProfileImage(session, profileData, event.target.files[0]);

      const updatedProfileData = await fetchProfileInfo(session.info.webId);
      localStorage.setItem('profileImage', updatedProfileData.profileInfo.profileImage);
      setProfileImg(updatedProfileData.profileInfo.profileImage);
      addNotification('success', `Profile image added.`);
      loadProfileData();
    }
  };

  const handleRemoveProfileImg = async () => {
    setProcessing(true);
    try {
      await removeProfileImage(session, profileData);
      loadProfileData();
      localStorage.removeItem('profileImage');
      setProfileImg(null);
      addNotification('success', `Profile image deleted from the pod.`);
    } catch (e) {
      addNotification('error', `Image deletion failed. Reason: ${e.message}`);
    } finally {
      setShowConfirmationModal(false);
      setProcessing(false);
    }
  };

  const handleSelectRemoveProfileImg = async () => {
    setShowConfirmationModal(true);
  };

  const iconButtonStyling = {
    position: 'absolute',
    width: '100%',
    height: '100%',
    top: '50%',
    left: '50%',
    opacity: 0.8,
    transform: 'translate(-50%, -50%)',
    borderRadius: '50%',
    cursor: 'pointer',
    border: 'none',
    color: '#FFFFFF',
    backgroundColor: '#545454',
    '&:hover': {
      backgroundColor: '#545454'
    }
  };

  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        padding: '20px'
      }}
    >
      <Box
        position="relative"
        display="inline-block"
        onMouseEnter={() => setHover(true)}
        onMouseLeave={() => setHover(false)}
      >
        <Avatar
          src={contactProfile?.profileImage || profileImg || ''}
          alt="PASS profile"
          sx={{
            height: '100px',
            width: '100px'
          }}
        />
        {hover && (
          <>
            <Box
              sx={{
                position: 'absolute',
                top: 0,
                left: 0,
                width: '100%',
                height: '100%',
                backgroundColor: 'rgba(0, 0, 0, 0.5)',
                borderRadius: '50%'
              }}
            />
            {contactProfile || profileImg ? (
              <Button
                data-testid="deleteProfilePictureIcon"
                aria-label="delete-profile-picture"
                component="label"
                variant="contained"
                startIcon={<HideImageIcon />}
                onClick={handleSelectRemoveProfileImg}
                sx={iconButtonStyling}
              >
                Delete
              </Button>
            ) : (
              <Button
                data-testid="uploadProfilePictureIcon"
                aria-label="upload-profile-picture"
                component="label"
                variant="contained"
                startIcon={<ImageIcon />}
                sx={iconButtonStyling}
              >
                Upload
                <input
                  type="file"
                  hidden
                  accept=".gif, .png, .jpeg, .jpg, .webp"
                  onChange={handleProfileImage}
                />
              </Button>
            )}
          </>
        )}
      </Box>

      <ConfirmationModal
        showModal={showConfirmationModal}
        setShowModal={setShowConfirmationModal}
        title="Delete Image"
        text={"You're about to delete your profile image. Do you wish to continue?"}
        onConfirm={handleRemoveProfileImg}
        confirmButtonText="Delete"
        processing={processing}
      />
    </Box>
  );
};

export default ProfileImageField;
