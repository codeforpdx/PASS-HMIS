// React Imports
import React, { useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
// Inrupt Imports
import { getWebIdDataset } from '@inrupt/solid-client';
// Material UI Imports
import ContactPageIcon from '@mui/icons-material/ContactPage';
// Custom Hooks Imports
import { useNotification } from '@hooks';
// Context Imports
import { DocumentListContext } from '@contexts';

/**
 * contactProfileIconProps is an object that stores the props for the
 * ContactProfileIcon component
 *
 * @typedef {object} contactProfileIconProps
 * @property {object} contact - Contain the object that stores contact metadata
 * @memberof typedefs
 */

/**
 * ContactProfileIcon - Component that generates the contact profile
 * icon for the Contacts List which is a special link to their profile page
 *
 * @memberof Contacts
 * @name ContactProfileIcon
 * @param {contactProfileIconProps} Props - Props for ContactProfileIcon
 * @returns {React.JSX.Element} The ContactProfileIcon Component
 */
const ContactProfileIcon = ({ contact }) => {
  const { setContact } = useContext(DocumentListContext);
  const navigate = useNavigate();
  const { addNotification } = useNotification();

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

  return (
    <Link
      to={`/contacts/${encodeURIComponent(contact.id)}`}
      state={{ contact: contact.value }}
      onClick={() => handleSelectProfile(contact.value)}
      style={{ display: 'flex', alignItems: 'center' }}
    >
      <ContactPageIcon sx={{ color: 'gray' }} titleAccess="contact profile link" />
    </Link>
  );
};

export default ContactProfileIcon;
