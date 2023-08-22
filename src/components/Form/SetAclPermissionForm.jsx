// React Imports
import React, { useContext, useState } from 'react';
// Custom Hook Imports
import { useSession } from '@hooks';
// Material UI Imports
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import FormControl from '@mui/material/FormControl';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import Select from '@mui/material/Select';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
// Utility Imports
import { setDocAclPermission } from '@utils';
// Context Imports
import { SignedInUserContext } from '@contexts';
// Component Imports
import DocumentSelection from './DocumentSelection';
import FormSection from './FormSection';
import useNotification from '../../hooks/useNotification';

/**
 * SetAclPermissionForm Component - Component that generates the form for setting
 * document ACL permissions to another user's Solid Pod via Solid Session
 *
 * @memberof Forms
 * @name SetAclPermissionForm
 * @returns {React.JSX.Element} The SetAclPermissionForm Component
 */
const SetAclPermissionForm = () => {
  const { session } = useSession();
  const { addNotification } = useNotification();
  const { podUrl } = useContext(SignedInUserContext);
  const [docType, setDocType] = useState('');
  const [permissionState, setPermissionState] = useState({
    podUrlToSetPermissionsTo: '',
    permissionType: ''
  });
  const [processing, setProcessing] = useState(false);

  const handleDocType = (event) => {
    setDocType(event.target.value);
  };

  // Event handler for setting ACL permissions to file container on Solid
  const handleAclPermission = async (event) => {
    event.preventDefault();
    setProcessing(true);
    const permissions = event.target.setAclPerms.value
      ? { read: event.target.setAclPerms.value === 'Give' }
      : undefined;
    const webIdToSetPermsTo = `${permissionState.podUrlToSetPermissionsTo}profile/card#me`;

    try {
      await setDocAclPermission(session, docType, permissions, podUrl, webIdToSetPermsTo);

      addNotification(
        'success',
        `${permissions.read ? 'Gave permission to' : 'Revoked permission from'} ${
          permissionState.podUrlToSetPermissionsTo
        } for ${docType}.`
      );
    } catch (error) {
      addNotification('error', 'Failed to set permissions. Reason: File not found.');
    } finally {
      setTimeout(() => {
        setProcessing(false);
      }, 3000);
    }
  };

  return (
    <FormSection title="Permission for Document">
      <Box display="flex" justifyContent="center">
        <form onSubmit={handleAclPermission} autoComplete="off">
          <Typography
            variant="subtitle2"
            mb={2}
            sx={{
              width: '250px',
              whiteSpace: 'nowrap',
              overflow: 'hidden',
              textOverflow: 'ellipsis'
            }}
          >
            <span style={{ color: 'grey' }}>File Name: </span>
            {/* TODO: adjust here to show filename of the one that triggered this form */}
            filename.jpeg
          </Typography>

          <FormControl required fullWidth sx={{ marginBottom: '1rem' }}>
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
              <MenuItem value="Give">Give Permission</MenuItem>
              <MenuItem value="Revoke">Revoke Permission</MenuItem>
            </Select>
          </FormControl>
          <br />
          <FormControl fullWidth sx={{ marginBottom: '1rem' }}>
            <TextField
              id="set-acl-to"
              name="setAclTo"
              value={permissionState.podUrlToSetPermissionsTo}
              onChange={(e) =>
                setPermissionState({ ...permissionState, podUrlToSetPermissionsTo: e.target.value })
              }
              placeholder={permissionState.podUrlToSetPermissionsTo}
              label="Enter podURL"
              required
              error={permissionState.podUrlToSetPermissionsTo === podUrl}
              helperText={
                permissionState.podUrlToSetPermissionsTo === podUrl
                  ? 'Cannot modify your permissions to your own pod.'.toUpperCase()
                  : ''
              }
            />
          </FormControl>

          <DocumentSelection
            htmlForAndIdProp="set-acl-doctype"
            handleDocType={handleDocType}
            docType={docType}
          />

          <FormControl fullWidth sx={{ marginTop: '2rem' }}>
            <Button variant="contained" disabled={processing} type="submit" color="primary">
              {permissionState.permissionType
                ? `${permissionState.permissionType} Permission`
                : 'Set Permission'}
            </Button>
          </FormControl>
        </form>
      </Box>
    </FormSection>
  );
};

export default SetAclPermissionForm;
