// React Imports
import React, { useEffect, useState } from 'react';
// Material UI Imports
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Container from '@mui/material/Container';
import FormControl from '@mui/material/FormControl';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import MenuItem from '@mui/material/MenuItem';
import Select from '@mui/material/Select';
import Typography from '@mui/material/Typography';
import useMediaQuery from '@mui/material/useMediaQuery';
import { useTheme } from '@mui/system';
// Custom Hooks Imports
import { useContactsList, useNotification } from '@hooks';
// Component Imports
import { AddContactModal, ConfirmationModal } from '@components/Modals';
import { ContactListTable } from '@components/Contacts';
import { LoadingAnimation, EmptyListNotification } from '@components/Notification';
// Util Imports
import { truncateText } from '@utils';

/**
 * Contacts - Component that generates Contacts Page for PASS
 *
 * @memberof Pages
 * @name Contacts
 * @returns {React.JSX.Component} The Contacts Page
 */
const Contacts = () => {
  localStorage.setItem('restorePath', '/contacts');
  const theme = useTheme();
  const isSmallScreen = useMediaQuery(theme.breakpoints.down('sm'));

  const [showAddContactModal, setShowAddContactModal] = useState(false);
  const [showConfirmationModal, setShowConfirmationModal] = useState(false);
  const [processing, setProcessing] = useState(false);
  const [selectedContactToDelete, setSelectedContactToDelete] = useState(null);
  const [deleteViaEdit, setDeleteViaEdit] = useState(false);
  const [sortValue, setSortValue] = useState('Sort by:');
  const [sortedData, setSortedData] = useState([]);
  const {
    data = [],
    isLoading,
    isError,
    error,
    refetch,
    add: addContact,
    delete: deleteContact
  } = useContactsList();
  const { addNotification } = useNotification();

  const sortData = (value) => {
    const sorted = [...data].sort((a, b) => {
      if (value === 'Default') {
        return data;
      }
      if (value === 'First Name') {
        return a.givenName.localeCompare(b.givenName);
      }
      if (value === 'Last Name') {
        return a.familyName.localeCompare(b.familyName);
      }
      if (value === 'Web ID') {
        return a.webId.localeCompare(b.webId);
      }
      return 0;
    });
    setSortedData(sorted);
  };

  const handleSortChange = (event) => {
    const { value } = event.target;
    setSortValue(value);
    sortData(value);
  };

  useEffect(() => {
    refetch();
  }, []);

  useEffect(() => {
    if (data.length > 0) {
      setSortedData(data);
    }
  }, [data]);

  const getContactDisplayName = (contact) => {
    if (!contact) {
      return 'Unknown Contact';
    }

    const { givenName, familyName, webId } = contact;
    const name = [givenName, familyName].filter(Boolean).join(' ');
    return name || webId;
  };
  const displayName = getContactDisplayName(selectedContactToDelete);
  const truncatedText = displayName ? truncateText(displayName) : '';

  const handleSelectDeleteContact = (contact) => {
    setSelectedContactToDelete(contact);
    setShowConfirmationModal(true);
  };

  const handleDeleteContact = async (contact) => {
    setProcessing(true);
    try {
      await deleteContact(selectedContactToDelete);
      // Edit passes the contact as a parameter, deleting from the list table does not
      if (Object.hasOwn(contact, 'webId')) {
        await deleteContact(contact);
        setDeleteViaEdit(!deleteViaEdit);
      } else {
        await deleteContact(selectedContactToDelete);
      }
      addNotification('success', `"${truncatedText}" deleted from contact list.`);
    } catch (e) {
      addNotification('error', `Contact deletion failed. Reason: ${e.message}`);
    } finally {
      setShowConfirmationModal(false);
      setProcessing(false);
    }
  };

  if (isLoading) return <LoadingAnimation loadingItem="Contacts" />;
  if (isError) return <Typography>Error loading contacts list: {error.message}</Typography>;

  return (
    <Container
      sx={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        width: '100%'
      }}
    >
      <Box>
        <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
          {isSmallScreen && (
            <FormControl sx={{ minWidth: 120 }} size="small">
              <Select
                id="contact-select-field-small"
                defaultValue="First Name"
                value={sortValue}
                onChange={handleSortChange}
                sx={{
                  borderRadius: '8px',
                  color: 'primary.main',
                  '.MuiOutlinedInput-notchedOutline': {
                    borderColor: 'primary.main'
                  },
                  '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                    borderColor: 'primary.main'
                  },
                  '&:hover .MuiOutlinedInput-notchedOutline': {
                    borderColor: 'primary.main'
                  }
                }}
                IconComponent={KeyboardArrowDownIcon}
              >
                {' '}
                <MenuItem value="Sort by:" disabled>
                  Sort by:
                </MenuItem>
                <MenuItem value="Default">Default</MenuItem>
                <MenuItem value="First Name">First Name</MenuItem>
                <MenuItem value="Last Name">Last Name</MenuItem>
                <MenuItem value="Web ID">Web ID</MenuItem>
              </Select>
            </FormControl>
          )}
          <Button
            variant="contained"
            color="primary"
            size="small"
            onClick={() => setShowAddContactModal(true)}
            sx={{ fontWeight: 500, padding: '10px 36px' }}
          >
            Add Contact
          </Button>
        </Box>
        {data.length > 0 ? (
          <ContactListTable
            contacts={isSmallScreen ? sortedData : data}
            deleteContact={(contact) => handleSelectDeleteContact(contact)}
            handleDeleteContact={handleDeleteContact}
            addContact={addContact}
          />
        ) : (
          <EmptyListNotification type="Contacts" />
        )}
      </Box>

      <AddContactModal
        showAddContactModal={showAddContactModal}
        setShowAddContactModal={setShowAddContactModal}
        addContact={addContact}
      />
      <ConfirmationModal
        showModal={showConfirmationModal}
        setShowModal={setShowConfirmationModal}
        title="Delete Contact"
        text={`Are you sure you want to delete "${truncatedText}" from your contact list?`}
        onConfirm={handleDeleteContact}
        confirmButtonText="Delete"
        processing={processing}
      />
    </Container>
  );
};

export default Contacts;
