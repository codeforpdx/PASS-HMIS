// React Imports
import React, { useContext, useState } from 'react';
// Solid Imports
import { useSession } from '@inrupt/solid-ui-react';
// Material UI Imports
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import InputLabel from '@mui/material/InputLabel';
import FormControl from '@mui/material/FormControl';
import TextField from '@mui/material/TextField';
// Custom Component Imports
import { getDocuments, runNotification } from '../../utils';
import { useField, useStatusNotification } from '../../hooks';
import DocumentSelection from './DocumentSelection';
import FormSection from './FormSection';
import { SelectUserContext } from '../../contexts';

/**
 * CrossPodQueryForm Component - Component that generates the form for cross pod
 * search for a specific document from another user's Solid Pod via Solid Session
 *
 * @memberof Forms
 * @name CrossPodQueryForm
 */

const CrossPodQueryForm = () => {
  const { session } = useSession();
  const { state, dispatch } = useStatusNotification();
  const { clearValue: clearUsername, ...username } = useField('text');
  const { selectedUser, setSelectedUser } = useContext(SelectUserContext);
  const [documentType, setDocumentType] = useState('');
  const [searchUser, setSearchUser] = useState('');

  const handleChange = (event) => {
    setDocumentType(event.target.value);
  };

  // Clean up function for clearing input fields after submission
  const clearInputFields = () => {
    clearUsername();
    setSelectedUser('');
    dispatch({ type: 'CLEAR_PROCESSING' });
  };

  // Event handler for Cross Pod Querying/Searching
  const handleCrossPodQuery = async (event) => {
    event.preventDefault();
    dispatch({ type: 'SET_PROCESSING' });
    const docType = documentType;
    let podUsername = searchUser;

    if (!podUsername) {
      podUsername = selectedUser;
    }

    if (!podUsername) {
      runNotification('Search failed. Reason: Username not provided.', 5, state, dispatch);
      setTimeout(() => {
        dispatch({ type: 'CLEAR_PROCESSING' });
      }, 3000);
      return;
    }

    try {
      const documentUrl = await getDocuments(session, docType, 'cross-fetch', podUsername);

      if (state.documentUrl) {
        dispatch({ type: 'CLEAR_DOCUMENT_LOCATION' });
      }

      runNotification('Locating document...', 3, state, dispatch);

      // setTimeout is used to let getDocuments complete its fetch
      setTimeout(() => {
        dispatch({ type: 'SET_DOCUMENT_LOCATION', payload: documentUrl });
        runNotification('Document found! Document located at: ', 3, state, dispatch);
        clearInputFields();
      }, 3000);
    } catch (_error) {
      dispatch({ type: 'CLEAR_DOCUMENT_LOCATION' });
      runNotification('Search failed. Reason: Document not found.', 5, state, dispatch);
      setTimeout(() => {
        clearInputFields();
      }, 3000);
    }
  };

  const formRowStyle = {
    margin: '20px 0'
  };

  /* eslint-disable jsx-a11y/label-has-associated-control */
  return (
    <FormSection
      title="Cross Pod Search"
      state={state}
      statusType="Search status"
      defaultMessage="To be searched..."
    >
      <Box sx={{ minWidth: 120 }}>
        <div style={formRowStyle}>
          <TextField
            {...username}
            label="Search document from username"
            InputProps={{
              type: 'search'
            }}
            id="cross-search-doc"
            fullWidth
            name="crossPodQuery"
            placeholder={selectedUser}
            value={searchUser}
            onChange={(event) => {
              setSearchUser(event.target.value);
            }}
          />
          <br />
          <br />
          <FormControl fullWidth autoComplete="off">
            <InputLabel id="cross-search-doctype">
              <i>Select Document Type</i>
            </InputLabel>
            <DocumentSelection
              htmlId="cross-search-doctype"
              value={documentType}
              onChange={handleChange}
            />
          </FormControl>
          <br />
          <br />
          <Button
            variant="contained"
            fullWidth
            disabled={state.processing}
            type="submit"
            onClick={handleCrossPodQuery}
          >
            Search Pod
          </Button>
        </div>
      </Box>
    </FormSection>
  );
  /* eslint-enable jsx-a11y/label-has-associated-control */
};

export default CrossPodQueryForm;
