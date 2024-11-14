// React Imports
import React, { useState } from 'react';
import { useLocation } from 'react-router-dom';
// Material UI Imports
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import FileOpenIcon from '@mui/icons-material/FileOpen';
import ShareIcon from '@mui/icons-material/Share';
import DeleteOutlineOutlinedIcon from '@mui/icons-material/DeleteOutlineOutlined';
import IconButton from '@mui/material/IconButton';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import Typography from '@mui/material/Typography';
// Utility Imports
import { truncateText, getTypeText } from '@utils';

/**
 * @typedef {object} Document
 * @property {string} id - The unique id of the document
 * @property {string} name - The given name of the document
 * @property {string} type - The given type of the document
 * @property {string} description - The given description of the document
 * @property {string} uploadDate- The upload date of the document
 * @property {string} endDate - The expiration date of the document
 * @property {string} fileUrl - The file URL of the document
 */

/**
 * DocumentCard - A component that displays a single document's information
 * and provides actions (preview, share, delete) through a context menu.
 *
 * @memberof Documents
 * @name DocumentCard
 * @param {object} props - Component props
 * @param {Document} props.document - The document object to be displayed
 * @param {Function} props.onPreview - Function to handle the "Preview" action
 * @param {Function} props.onShare - Function to handle the "Share" action
 * @param {Function} props.onDelete - Function to handle the "Delete" action
 * @returns {React.JSX.Element} The DocumentCard component
 */
const DocumentCard = ({ document, onShare, onDelete, onPreview }) => {
  const location = useLocation();
  const profileWebId = decodeURIComponent(location.pathname.split('/')[2]);

  const [anchorEl, setAnchorEl] = useState(null);
  const [openMenu, setOpenMenu] = useState(null);

  // Opens the context menu
  const handleClick = (event, clickedDocument) => {
    setAnchorEl(event.currentTarget);
    setOpenMenu(clickedDocument.id);
  };

  // Closes the context menu
  const handleClose = () => {
    setAnchorEl(null);
    setOpenMenu(null);
  };

  // Handles the click on a context menu item, executing the corresponding action
  const handleMenuItemClick = (action, clickedDocument) => () => {
    action(clickedDocument);
    handleClose();
  };

  // Icon styles
  const iconSize = {
    height: '24px',
    width: '24px'
  };

  const iconStyling = {
    width: '100%'
  };

  return (
    <Box>
      <Card
        sx={{
          my: '5px',
          position: 'relative'
        }}
      >
        <CardContent>
          <Box sx={{ maxWidth: '90%' }}>
            <Typography
              sx={{
                fontWeight: 'bold'
              }}
              variant="body1"
              component="div"
              noWrap
            >
              {document.name || '[Untitled document]'}
            </Typography>
            <Typography variant="body2" component="div" noWrap>
              {document.type ? `Type: ${getTypeText(document.type)}` : 'Type: Other'}
            </Typography>

            <Typography variant="body2" component="div" noWrap>
              {document.uploadDate
                ? `Uploaded: ${document.uploadDate.toLocaleDateString()}`
                : 'Uploaded: N/A'}
            </Typography>
            <Typography variant="body2" component="div" noWrap>
              {document.endDate
                ? `Expires: ${document.endDate.toLocaleDateString()}`
                : 'Expires: N/A'}
            </Typography>
            {document.description && (
              <Typography variant="body2" component="div" color="text.secondary" sx={{ mt: '5px' }}>
                <em>{truncateText(document.description, 140)}</em>
              </Typography>
            )}
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
              aria-controls={openMenu === document.id ? 'actions-menu' : undefined}
              aria-haspopup="true"
              aria-expanded={openMenu === document.id ? 'true' : undefined}
              aria-label="open-actions-menu"
              onClick={(event) => handleClick(event, document)}
            >
              <MoreVertIcon />
            </IconButton>
          </Box>
        </CardContent>
        <Menu
          id="actions-menu"
          anchorEl={anchorEl}
          open={openMenu === document.id}
          onClose={handleClose}
          MenuListProps={{
            'aria-labelledby': 'actions-icon-button'
          }}
        >
          <MenuItem
            component={Button}
            onClick={handleMenuItemClick(onPreview, document)}
            startIcon={<FileOpenIcon sx={iconSize} />}
            sx={iconStyling}
          >
            Preview
          </MenuItem>
          {`${profileWebId}` === 'undefined' && (
            <MenuItem
              component={Button}
              onClick={handleMenuItemClick(onShare, document)}
              startIcon={<ShareIcon sx={iconSize} />}
              sx={iconStyling}
            >
              Share
            </MenuItem>
          )}
          {`${profileWebId}` === 'undefined' && (
            <MenuItem
              component={Button}
              onClick={handleMenuItemClick(onDelete, document)}
              startIcon={<DeleteOutlineOutlinedIcon sx={iconSize} />}
              sx={iconStyling}
            >
              Delete
            </MenuItem>
          )}
        </Menu>
      </Card>
    </Box>
  );
};

export default DocumentCard;
