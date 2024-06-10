// React Imports
import React, { useState } from 'react';
// Material UI Imports
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import ContentCopyIcon from '@mui/icons-material/ContentCopy';
import DeleteOutlineOutlinedIcon from '@mui/icons-material/DeleteOutlineOutlined';
import Grid from '@mui/material/Grid';
import IconButton from '@mui/material/IconButton';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import SendIcon from '@mui/icons-material/Send';
import Typography from '@mui/material/Typography';
import useMediaQuery from '@mui/material/useMediaQuery';
import { useTheme } from '@mui/material/styles';
import {
  DataGrid,
  GridToolbarContainer,
  GridActionsCellItem,
  GridToolbarFilterButton,
  GridToolbarDensitySelector
} from '@mui/x-data-grid';
// Custom Hooks Imports
import useNotification from '@hooks/useNotification';
// Util Imports
import { saveToClipboard } from '@utils';
// Component Imports
import ContactProfileIcon from './ContactProfileIcon';
import { NewMessageModal } from '../Modals';
// import ContactListTableDesktop from './ContactListTableDesktop'
// import ContactListTableMobile from './ContactListTableMobile'

const CustomToolbar = () => (
  <GridToolbarContainer>
    <GridToolbarFilterButton />
    <GridToolbarDensitySelector />
  </GridToolbarContainer>
);

/**
 * @typedef {import("../../typedefs.js").userListObject} userListObject
 */

/**
 * ContactListTable - Component that generates the list of contacts
 * from data within ContactList
 *
 * @memberof Contacts
 * @name ContactListTable
 * @param {object} Props - Props for ContactListTable
 * @param {userListObject[]} Props.contacts - This list of contacts to display
 * @param {Function} Props.deleteContact - Method to delete contact
 * @returns {React.JSX.Element} The ContactListTable Component
 */
const ContactListTable = ({ contacts, deleteContact }) => {
  const [showMessageModal, setShowMessageModal] = useState(false);
  const [messageToField, setMessageToField] = useState('');
  const { addNotification } = useNotification();
  const [anchorEl, setAnchorEl] = useState(null);
  const [openMenu, setOpenMenu] = useState(null);
  const theme = useTheme();
  const isSmallScreen = useMediaQuery(theme.breakpoints.down('sm'));

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

  const handleSendMessage = (contactId) => {
    setShowMessageModal(!showMessageModal);
    setMessageToField(isSmallScreen ? contactId.podUrl : contactId.value.podUrl);
  };

  const handleProfileClick = (contactData) => {
    <ContactProfileIcon contact={contactData} />;
  };

  const columnTitlesArray = [
    {
      field: 'First Name',
      minWidth: 120,
      flex: 1,
      headerAlign: 'center',
      align: 'center'
    },
    {
      field: 'Last Name',
      minWidth: 120,
      flex: 1,
      headerAlign: 'center',
      align: 'center'
    },
    {
      field: 'webId',
      headerName: 'Web ID',
      minWidth: 150,
      flex: 1,
      headerAlign: 'center',
      align: 'center'
    },
    {
      field: 'Profile',
      renderCell: (contactData) => (
        <ContactProfileIcon contact={contactData} />
        // <SendIcon onClick={() => handleProfileClick(contactData)} />
      ),
      sortable: false,
      filterable: false,
      width: 80,
      headerAlign: 'center',
      align: 'center'
    },
    {
      field: 'Message',
      renderCell: (contactId) => (
        <SendIcon
          sx={{ color: '#808080', cursor: 'pointer' }}
          onClick={() => handleSendMessage(contactId)}
        />
      ),
      sortable: false,
      filterable: false,
      width: 80,
      headerAlign: 'center',
      align: 'center'
    },
    {
      field: 'actions',
      type: 'actions',
      headerName: 'Delete',
      width: 80,
      getActions: (contactData) => [
        <GridActionsCellItem
          icon={<DeleteOutlineOutlinedIcon />}
          onClick={() => deleteContact(contactData.row.Delete)}
          label="Delete"
        />
      ]
    }
  ];

  const iconSize = {
    height: '24px',
    width: '24px'
  };

  const iconStyling = {
    width: '100%'
  };

  return (
    <Box
      sx={{
        margin: '20px 0',
        width: '95vw',
        height: '500px'
      }}
    >
      {isSmallScreen ? (
        <Box>
          <Box
            sx={{
              my: '15px',
              p: '15px',
              background: theme.palette.primary.light,
              color: '#fff',
              borderRadius: '8px',
              position: 'relative'
            }}
          >
            <Grid container>
              <Grid item xs={4}>
                <Typography component="div">First Name</Typography>
              </Grid>
              <Grid item xs={6}>
                <Typography component="div">Last Name</Typography>
              </Grid>
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
            </Grid>
          </Box>
          {contacts?.map((contact) => (
            <Box key={contact.webId}>
              <Card
                sx={{
                  my: '5px',
                  position: 'relative'
                }}
              >
                <CardContent>
                  <Grid container alignItems="center">
                    <Grid item xs={4}>
                      <Typography component="div" noWrap>
                        {contact.givenName || ''}
                      </Typography>
                    </Grid>
                    <Grid item xs={6}>
                      <Typography component="div" noWrap>
                        {contact.familyName || ''}
                      </Typography>
                    </Grid>
                    <Grid item xs={10}>
                      <Typography variant="body2" component="div" noWrap color="text.secondary">
                        {contact.webId}
                      </Typography>
                    </Grid>
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
                        aria-controls={openMenu === contact.webId ? 'actions-menu' : undefined}
                        aria-haspopup="true"
                        aria-expanded={openMenu === contact.webId ? 'true' : undefined}
                        onClick={(event) => handleClick(event, contact)}
                      >
                        <MoreVertIcon />
                      </IconButton>
                    </Box>
                  </Grid>
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
                        saveToClipboard(
                          contact.webId,
                          'webId copied to clipboard',
                          addNotification
                        ),
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
      ) : (
        <DataGrid
          columns={columnTitlesArray}
          rows={contacts?.map((contact) => ({
            id: contact.webId,
            'First Name': contact.givenName || '',
            'Last Name': contact.familyName || '',
            webId: contact.webId,
            Profile: contact,
            Message: contact,
            Delete: contact
          }))}
          slots={{
            toolbar: CustomToolbar
          }}
          sx={{
            '.MuiDataGrid-columnHeader': {
              background: theme.palette.primary.light,
              color: '#fff'
            },
            '.MuiDataGrid-columnSeparator': {
              display: 'none'
            }
          }}
          pageSizeOptions={[10]}
          initialState={{
            pagination: {
              paginationModel: { pageSize: 10, page: 0 }
            },
            sorting: {
              sortModel: [{ field: 'webId', sort: 'asc' }]
            }
          }}
          disableColumnMenu
          disableRowSelectionOnClick
        />
      )}
      <NewMessageModal
        showModal={showMessageModal}
        setShowModal={setShowMessageModal}
        toField={messageToField}
      />
    </Box>
  );
};

export default ContactListTable;
