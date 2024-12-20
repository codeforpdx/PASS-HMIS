// React Imports
import React, { useContext, useState } from 'react';
// Custom Hooks Imports
import { useContactsList, useNotification, useSession } from '@hooks';
// Material UI Imports
import Autocomplete from '@mui/material/Autocomplete';
import Button from '@mui/material/Button';
import ClearIcon from '@mui/icons-material/Clear';
import FormControl from '@mui/material/FormControl';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import Select from '@mui/material/Select';
import ShareIcon from '@mui/icons-material/Share';
import TextField from '@mui/material/TextField';
import useMediaQuery from '@mui/material/useMediaQuery';
import { useTheme } from '@mui/material/styles';
// Utility Imports
import { setDocAclPermission, setDocContainerAclPermission } from '@utils';
// Context Imports
import { SignedInUserContext } from '@contexts';
// Component Imports
import ModalBase from './ModalBase';
import { FormSection } from '../Form';

/**
 * SetPermissionsModal - Modal component that generates the form for
 * setting ACL permissions to another user's documents, or document container
 * in their Solid Pod via Solid Session.
 *
 * @memberof Modals
 * @name SetAclPermissionsModal
 * @param {object} Props - Props for SetAclPermissionsModal component
 * @param {boolean} Props.showModal - Boolean for showing setAclPermissionsModal.
 * @param {React.Dispatch<React.SetStateAction<boolean>>} Props.setShowModal
 * - React set function for setting showModal state
 * @param {object} Props.dataset - State object containing information for which
 * version of modal to display, a relevant file name (if any), and a relevant
 * document type (if any).
 * @returns {React.JSX.Element} The SetAclPermissionsModal Component
 */
const SetAclPermissionsModal = ({ showModal, setShowModal, dataset }) => {
  const { session } = useSession();
  const { addNotification } = useNotification();
  const { podUrl, webId } = useContext(SignedInUserContext);
  const [permissionState, setPermissionState] = useState({
    webIdToSetPermsTo: '',
    permissionType: ''
  });
  const [processing, setProcessing] = useState(false);
  const { data } = useContactsList();
  const theme = useTheme();
  const isSmallScreen = useMediaQuery(theme.breakpoints.down('sm'));
  const contactListOptions =
    data?.map((contact) => ({
      label: `${contact.person} ${contact.webId}`,
      id: contact.webId
    })) ?? [];
  const shareName = data?.filter(
    (contact) => permissionState.webIdToSetPermsTo === contact.webId
  )[0];

  const clearInputFields = () => {
    setPermissionState({
      webIdToSetPermsTo: '',
      permissionType: ''
    });
    setProcessing(false);
    setShowModal(false);
  };

  // Event handler for setting ACL permissions to file or container on Solid
  const handleAclPermission = async (event) => {
    event.preventDefault();
    setProcessing(true);
    const permissions = event.target.setAclPerms.value
      ? {
          read: event.target.setAclPerms.value === 'Share',
          append: event.target.setAclPerms.value === 'Share' && dataset.modalType === 'container'
        }
      : undefined;

    try {
      switch (dataset.modalType) {
        case 'container':
          await setDocContainerAclPermission(
            session,
            permissions,
            podUrl,
            permissionState.webIdToSetPermsTo
          );
          break;
        case 'document':
          await setDocAclPermission(
            session,
            dataset.docName,
            permissions,
            podUrl,
            permissionState.webIdToSetPermsTo
          );
          break;
        default:
          break;
      }

      addNotification(
        'success',
        `${permissions.read ? 'Shared' : 'Unshared'} with ${
          permissionState.webIdToSetPermsTo
        } for ${dataset.modalType === 'container' ? 'Documents Container' : dataset.docName}.`
      );
    } catch (error) {
      addNotification('error', `Failed to share. Reason: ${error.message}`);
    } finally {
      setTimeout(() => {
        clearInputFields();
      }, 3000);
    }
  };

  return (
    <ModalBase open={showModal} onClose={clearInputFields}>
      <FormSection
        title={
          dataset.modalType === 'container' ? 'Share All Documents' : `Share "${dataset.docName}"`
        }
      >
        <form onSubmit={handleAclPermission} autoComplete="off" style={{ width: '100%' }}>
          <FormControl required fullWidth sx={{ mb: '1rem' }}>
            <InputLabel id="permissionType-label">Select One</InputLabel>
            <Select
              labelId="permissionType-label"
              id="permissionType"
              label="Select One"
              value={permissionState.permissionType}
              onChange={(e) =>
                setPermissionState({ ...permissionState, permissionType: e.target.value })
              }
              name="setAclPerms"
            >
              <MenuItem value="Share">Share</MenuItem>
              <MenuItem value="Unshare">Unshare</MenuItem>
            </Select>
          </FormControl>
          <Autocomplete
            data-testid="newShareWith"
            id="set-acl-to"
            sx={{ mb: '1rem' }}
            freeSolo
            fullWidth
            required
            value={shareName?.person ?? permissionState.webIdToSetPermsTo}
            disablePortal
            autoSelect
            options={contactListOptions}
            onChange={(_, newValue) => {
              setPermissionState({
                ...permissionState,
                webIdToSetPermsTo: newValue.id ?? newValue
              });
            }}
            renderInput={(params) => (
              <TextField
                {...params}
                name="setAclTo"
                autoFocus
                label="WebID to share with"
                placeholder="WebID to share with"
                error={permissionState.webIdToSetPermsTo === webId}
                helperText={
                  permissionState.webIdToSetPermsTo === webId ? 'Cannot share to your own pod.' : ''
                }
              />
            )}
          />
          <FormControl
            fullWidth
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
              startIcon={<ClearIcon />}
              onClick={clearInputFields}
              fullWidth
            >
              Cancel
            </Button>
            <Button
              variant="contained"
              disabled={permissionState.webIdToSetPermsTo === webId || processing}
              type="submit"
              color="primary"
              startIcon={<ShareIcon />}
              fullWidth
            >
              {permissionState.permissionType ? `${permissionState.permissionType}` : 'Share'}
            </Button>
          </FormControl>
        </form>
      </FormSection>
    </ModalBase>
  );
};

export default SetAclPermissionsModal;
