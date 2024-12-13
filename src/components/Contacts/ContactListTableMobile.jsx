// React Imports
import React, { useContext, useState } from 'react';
import { useNavigate } from 'react-router-dom';
// Inrupt Imports
import { getWebIdDataset } from '@inrupt/solid-client';
// Material UI Imports
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import ContentCopyIcon from '@mui/icons-material/ContentCopy';
import DeleteOutlineOutlinedIcon from '@mui/icons-material/DeleteOutlineOutlined';
import EditIconOutlined from '@mui/icons-material/EditOutlined';
import IconButton from '@mui/material/IconButton';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import SendIcon from '@mui/icons-material/Send';
import Typography from '@mui/material/Typography';
import { useTheme } from '@mui/material/styles';
// Custom Hooks Imports
import useNotification from '@hooks/useNotification';
// Util Imports
import { saveToClipboard } from '@utils';
// Context Imports
import { DocumentListContext } from '@contexts';
// Component Imports
import ContactProfileIcon from './ContactProfileIcon';

/**
 * @typedef {object} Contact
 * @property {string} webId - The Web ID of the contact
 * @property {string} givenName - The given name of the contact
 * @property {string} familyName - The family name of the contact
 */

/**
 * ContactListTableMobile - Component for displaying contacts in a DataGrid
 *
 * @memberof Contacts
 * @name ContactListTableMobile
 * @param {object} Props - The props for ContactListTableMobile
 * @param {Contact[]} Props.contacts - The list of contacts to display
 * @param {Function} Props.deleteContact - Function to delete a contact
 * @param {Function} Props.editContact - Function to edit a contact
 * @param {Function} Props.handleSendMessage - Function to handle sending a message
 * @param {string} Props.'data-testid' - Test ID
 * @returns {React.JSX.Element} The ContactListTableMobile component
 */
const ContactListTableMobile = ({
  contacts,
  deleteContact,
  editContact,
  handleSendMessage,
  'data-testid': dataTestId
}) => {
  const { setContact } = useContext(DocumentListContext);
  const { addNotification } = useNotification();
  const [anchorEl, setAnchorEl] = useState(null);
  const [openMenu, setOpenMenu] = useState(null);
  const navigate = useNavigate();
  const theme = useTheme();

  const handleClick = (event, contact) => {
    setAnchorEl(event.currentTarget);
    setOpenMenu(contact.webId);
  };
  const handleClose = () => {
    setAnchorEl(null);
    setOpenMenu(null);
  };

  const handleMenuItemClick = (action, contact) => () => {
    action(contact);
    handleClose();
  };

  // Event handler for profile page routing
  const handleSelectProfile = async (contactInfo) => {
    try {
      await getWebIdDataset(contactInfo.webId);
      setContact(contactInfo);
    } catch {
      setContact(null);
      navigate('/contacts');
      addNotification('error', 'WebId does not exist');
    }
  };

  const handleProfileClick = (contact) => {
    handleSelectProfile(contact);
    // TODO: Consider abstracting this into a reusable function
    navigate(`/contacts/${encodeURIComponent(contact.webId)}`, {
      state: { contact }
    });
  };

  const iconSize = {
    height: '24px',
    width: '24px'
  };

  const iconStyling = {
    width: '100%'
  };

  return (
    <Box data-testid={dataTestId}>
      <Box
        sx={{
          my: '15px',
          p: '15px',
          background: theme.palette.primary.main,
          color: '#fff',
          borderRadius: '8px',
          position: 'relative'
        }}
      >
        <Box>
          <Typography>Name</Typography>
          <Box
            sx={{
              position: 'absolute',
              top: '50%',
              right: 15,
              transform: 'translateY(-50%)'
            }}
          >
            <Typography>Actions</Typography>
          </Box>
        </Box>
      </Box>
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          rowGap: '12px'
        }}
      >
        {contacts?.map((contact) => (
          <Box key={contact.webId}>
            <Card
              sx={{
                my: '5px',
                position: 'relative'
              }}
            >
              <CardContent>
                <Box sx={{ maxWidth: '90%' }}>
                  <Typography variant="body1" component="div" noWrap sx={{ fontWeight: 'bold' }}>
                    {contact.givenName || contact.familyName
                      ? `${contact.givenName || ''}\u00A0${contact.familyName || ''}`
                      : '[No name given]'}
                  </Typography>
                  <Typography variant="body2" component="div" noWrap color="text.secondary">
                    {contact.webId}
                  </Typography>
                </Box>
                <Box
                  sx={{
                    position: 'absolute',
                    top: '50%',
                    right: 5,
                    transform: 'translateY(-50%)'
                  }}
                >
                  <IconButton
                    id="actions-icon-button"
                    aria-labelledby="actions-icon-button"
                    aria-controls={openMenu === contact.webId ? 'actions-menu' : undefined}
                    aria-haspopup="true"
                    aria-expanded={openMenu === contact.webId ? 'true' : undefined}
                    onClick={(event) => handleClick(event, contact)}
                  >
                    <MoreVertIcon />
                  </IconButton>
                </Box>
              </CardContent>
              <Menu
                id="actions-menu"
                anchorEl={anchorEl}
                open={openMenu === contact.webId}
                onClose={handleClose}
                MenuListProps={{
                  'aria-labelledby': 'actions-icon-button'
                }}
              >
                <MenuItem
                  component={Button}
                  onClick={handleMenuItemClick(
                    () =>
                      saveToClipboard(contact.webId, 'webId copied to clipboard', addNotification),
                    contact
                  )}
                  startIcon={<ContentCopyIcon sx={iconSize} />}
                  sx={iconStyling}
                >
                  Copy WebId
                </MenuItem>
                <MenuItem
                  component={Button}
                  onClick={handleMenuItemClick(handleProfileClick, contact)}
                  startIcon={<ContactProfileIcon contact={contact} sx={iconSize} />}
                  sx={iconStyling}
                >
                  Profile
                </MenuItem>
                <MenuItem
                  component={Button}
                  onClick={handleMenuItemClick(handleSendMessage, contact)}
                  startIcon={
                    <SendIcon
                      sx={{
                        ...iconSize,
                        color: '#808080',
                        cursor: 'pointer'
                      }}
                    />
                  }
                  sx={iconStyling}
                >
                  Message
                </MenuItem>
                <MenuItem
                  component={Button}
                  onClick={handleMenuItemClick(editContact, contact)}
                  startIcon={<EditIconOutlined sx={iconSize} />}
                  sx={iconStyling}
                >
                  Edit
                </MenuItem>
                <MenuItem
                  component={Button}
                  onClick={handleMenuItemClick(deleteContact, contact)}
                  startIcon={<DeleteOutlineOutlinedIcon sx={iconSize} />}
                  sx={iconStyling}
                >
                  Delete
                </MenuItem>
              </Menu>
            </Card>
          </Box>
        ))}
      </Box>
    </Box>
  );
};

export default ContactListTableMobile;
