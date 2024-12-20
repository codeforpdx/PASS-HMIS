// React Imports
import React, { useContext } from 'react';
import { Link } from 'react-router-dom';
// Material UI Imports
import AccountBoxIcon from '@mui/icons-material/AccountBox';
import Avatar from '@mui/material/Avatar';
import Badge from '@mui/material/Badge';
import Button from '@mui/material/Button';
import ContactsIcon from '@mui/icons-material/Contacts';
import Divider from '@mui/material/Divider';
import Drawer from '@mui/material/Drawer';
import EmailIcon from '@mui/icons-material/Email';
import InventoryIcon from '@mui/icons-material/Inventory';
import LogoutIcon from '@mui/icons-material/Logout';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import MenuList from '@mui/material/MenuList';
import useMediaQuery from '@mui/material/useMediaQuery';
import { useTheme } from '@mui/material/styles';
// Context Imports
import { DocumentListContext } from '@contexts';
import { useMessageList } from '@hooks';

/**
 * NavMenu - Component that generates NavMenu section for PASS
 *
 * @memberof NavBar
 * @name NavMenu
 * @param {object} Props - The props for NavMenu Component
 * @param {string} Props.menuId - The menu id
 * @param {boolean} Props.openMenu - The state for opening menu
 * @param {React.Dispatch<React.SetStateAction<boolean>>} Props.setOpenMenu
 * - The set function for openMenu
 * @param {any} Props.anchorEl - The state for anchorEl
 * @param {React.Dispatch<any>} Props.setAnchorEl - The set function for anchorEl
 * @param {React.Dispatch<React.SetStateAction<boolean>>} Props.setShowConfirmation
 * - The set function for showConfirmationModal
 * Notification Menu
 * @param {string} Props.profileImg - String for profile image
 * @returns {React.JSX.Element} The NavMenu Component
 */
const NavMenu = ({
  menuId,
  openMenu,
  setOpenMenu,
  anchorEl,
  setAnchorEl,
  setShowConfirmation,
  profileImg
}) => {
  const theme = useTheme();
  const isSmallScreen = useMediaQuery(theme.breakpoints.down('sm'));
  const { setContact } = useContext(DocumentListContext);
  const { data } = useMessageList('Inbox');
  const MenuOrDrawer = isSmallScreen ? Drawer : Menu;
  const numUnreadMessages = data?.reduce((a, m) => (!m.readStatus ? a + 1 : a), 0);

  const handleMenuClose = () => {
    setOpenMenu(false);
    setAnchorEl(null);
  };

  const iconSize = {
    height: '24px',
    width: '24px'
  };

  const iconStyling = {
    display: { md: 'none' },
    color: theme.palette.primary.main,
    width: '100%',
    minHeight: '36px'
  };

  const MenuProps = isSmallScreen
    ? {
        PaperProps: {
          sx: {
            p: '15px 15px 0 15px',
            borderRadius: isSmallScreen ? '0 15px 15px 0px' : '5px'
          }
        }
      }
    : {
        anchorEl,
        anchorOrigin: {
          vertical: 'bottom',
          horizontal: 'right'
        },
        transformOrigin: {
          vertical: 'top',
          horizontal: 'right'
        },
        MenuListProps: { disablePadding: true },
        style: {
          backgroundColor: 'rgba(0, 0, 0, 0.5)'
        },
        slotProps: {
          paper: {
            style: {
              marginTop: '10px'
            }
          }
        }
      };

  return (
    <MenuOrDrawer
      id={menuId}
      keepMounted
      open={openMenu}
      onClose={handleMenuClose}
      onClick={handleMenuClose}
      {...MenuProps}
    >
      <MenuList>
        {isSmallScreen && (
          <div>
            <Link
              to="/contacts"
              style={{ textDecoration: 'none', color: theme.palette.primary.main }}
            >
              <MenuItem
                component={Button}
                startIcon={<ContactsIcon sx={iconSize} />}
                sx={iconStyling}
              >
                Contacts
              </MenuItem>
            </Link>
            <Link
              to="/civic-profile/basic-info"
              style={{ textDecoration: 'none', color: theme.palette.primary.main }}
            >
              <MenuItem
                component={Button}
                startIcon={<AccountBoxIcon sx={iconSize} />}
                sx={iconStyling}
              >
                Civic Profile
              </MenuItem>
            </Link>
            <Link
              to="/documents"
              style={{ textDecoration: 'none', color: theme.palette.primary.main }}
            >
              <MenuItem
                component={Button}
                startIcon={<InventoryIcon sx={iconSize} />}
                sx={iconStyling}
              >
                Documents
              </MenuItem>
            </Link>
            <Divider sx={{ my: '5px' }} />
          </div>
        )}
        {/* messages */}
        <Link to="/messages" style={{ textDecoration: 'none', color: theme.palette.primary.main }}>
          <MenuItem
            component={Button}
            startIcon={
              <Badge variant={numUnreadMessages > 0 ? 'dot' : 'standard'} color="error">
                <EmailIcon sx={iconSize} />
              </Badge>
            }
            sx={iconStyling}
          >
            Messages
          </MenuItem>
        </Link>
        {/* profile */}
        <Link
          to="/profile"
          state={{ contact: null }}
          style={{ textDecoration: 'none', color: theme.palette.primary.main }}
          onClick={() => setContact(null)}
        >
          <MenuItem
            component={Button}
            sx={{
              width: '100%',
              minHeight: '36px'
            }}
            startIcon={
              <Avatar
                src={profileImg}
                alt="PASS profile"
                sx={{
                  height: '24px',
                  width: '24px',
                  objectFit: 'contain',
                  color: theme.palette.primary.contrastText,
                  backgroundColor: theme.palette.primary.main
                }}
              />
            }
          >
            Profile
          </MenuItem>
        </Link>
        <Divider sx={{ my: '5px' }} />
        {/* logout */}
        <MenuItem
          component={Button}
          startIcon={<LogoutIcon sx={iconSize} />}
          onClick={() => setShowConfirmation(true)}
          sx={{ color: theme.palette.error.main, width: '100%', minHeight: '36px' }}
        >
          Log Out
        </MenuItem>
      </MenuList>
    </MenuOrDrawer>
  );
};

export default NavMenu;
