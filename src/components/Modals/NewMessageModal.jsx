// React Imports
import React, { useContext, useEffect, useState } from 'react';
// Inrupt Library Imports
import { useMessageList, useNotification, useSession, useContactsList } from '@hooks';
// Material UI Imports
import Autocomplete from '@mui/material/Autocomplete';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import CheckIcon from '@mui/icons-material/Check';
import ClearIcon from '@mui/icons-material/Clear';
import DialogActions from '@mui/material/DialogActions';
import TextField from '@mui/material/TextField';
import useMediaQuery from '@mui/material/useMediaQuery';
import { useTheme } from '@mui/material/styles';
// Utility Imports
import { sendMessageTTL } from '@utils';
// Context Imports
import { SignedInUserContext } from '@contexts';
// Component Imports
import ModalBase from './ModalBase';
import { FormSection } from '../Form';

/**
 * @typedef {import("../../typedefs.js").messageListObject} messageListObject
 */

/**
 * NewMessageModal - Component that allows user to write
 *  a message to another user from their inbox
 *
 * @memberof Modals
 * @name NewMessageModal
 * @param {object} Props - Props used for NewMessageModal
 * @param {boolean} Props.showModal - Boolean for showing message modal
 * @param {React.Dispatch<React.SetStateAction<boolean>>} Props.setShowModal
 * - React set function for showModal
 * @param {string} Props.toField - URL of the recipient
 * @param {messageListObject|string} Props.oldMessage - The previous message
 * object when using the modal to reply, else uses a string if empty
 * @returns {React.JSX.Element} React component for NewMessageModal
 */
const NewMessageModal = ({ showModal, setShowModal, oldMessage = '', toField = '' }) => {
  const { session } = useSession();
  const { data } = useContactsList();
  const { refetch: refreshOutbox } = useMessageList('Outbox');
  const { podUrl } = useContext(SignedInUserContext);
  const { addNotification } = useNotification();
  const [originalMessage, setOriginalMessage] = useState(oldMessage.message);

  const [message, setMessage] = useState({
    recipientPodUrl:
      oldMessage && oldMessage.senderWebId ? oldMessage.senderWebId.split('profile')[0] : '',
    title: oldMessage ? `RE:${oldMessage.title}`.replace('RE:RE:', 'RE:') : '',
    message: '',
    inReplyTo: oldMessage ? oldMessage.messageId : '',
    messageUrl: oldMessage ? oldMessage.messageUrl : ''
  });
  const theme = useTheme();
  const isSmallScreen = useMediaQuery(theme.breakpoints.down('sm'));

  const contactListOptions =
    data?.map((contact) => {
      let contactName;
      if (contact.givenName !== '' || contact.givenName !== null) {
        contactName = contact.givenName;
      }
      if (contact.familyName !== '' || contact.familyName !== null) {
        contactName += ` ${contact.familyName}`.trim();
      }
      return {
        label: `${contactName} ${contact.podUrl}`.trim(),
        id: contact.podUrl
      };
    }) ?? [];
  const recipientName = data?.filter((contact) => message.recipientPodUrl === contact.podUrl)[0];
  // Modifies message upon input
  const handleChange = (e) => {
    setMessage({
      ...message,
      [e.target.id]: e.target.value
    });
  };

  useEffect(() => {
    if (toField !== '') {
      setMessage({
        ...message,
        recipientPodUrl: toField,
        inReplyTo: '',
        messageUrl: ''
      });
    }
  }, [toField]);

  const handleReplyMessage = () => {
    setShowModal(!showModal);
  };

  // Handles submitting a new message
  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const messageWithTrimmedInputs = {
        ...message,
        recipientPodUrl: message.recipientPodUrl.trim(),
        title: message.title.trim(),
        message: message.message.trim()
      };

      await sendMessageTTL(session, messageWithTrimmedInputs, podUrl);

      setMessage({
        recipientPodUrl: '',
        title: '',
        message: ''
      });
      addNotification('success', `Message successfully sent to ${message.recipientPodUrl}`);
    } catch (err) {
      // TODO: Make sure invalid username is the only possible error
      addNotification('error', `Invalid recipient: ${message.recipientPodUrl}`);
    } finally {
      setOriginalMessage('');
      setTimeout(() => {
        setShowModal(false);
      }, 2000);
    }

    await refreshOutbox();
  };

  /* eslint-disable jsx-a11y/label-has-associated-control */
  return (
    <ModalBase
      open={showModal}
      aria-labelledby="new-message-modal"
      onClose={() => handleReplyMessage(false)}
    >
      <FormSection title={oldMessage ? 'Reply To' : 'New Message'} headingId="new-message-form">
        <form
          aria-labelledby="new-message-form"
          onSubmit={(e) => handleSubmit(e)}
          autoComplete="off"
        >
          <Autocomplete
            data-testid="newMessageTo"
            id="recipientPodUrl"
            freeSolo
            value={recipientName?.podUrl ?? message.recipientPodUrl}
            disablePortal
            autoSelect
            options={contactListOptions}
            onChange={(_event, newValue) => {
              setMessage({
                ...message,
                // If user wants to use a custom webId instead of a contact option, set the recipient value to the typed input
                recipientPodUrl: newValue.id ?? newValue
              });
            }}
            fullWidth
            disabled={Boolean(toField) || Boolean(oldMessage)}
            renderInput={(params) => (
              <TextField {...params} autoFocus margin="normal" label="To" required />
            )}
          />
          <TextField
            margin="normal"
            value={message.title}
            type="text"
            name="title"
            id="title"
            onChange={(e) => handleChange(e)}
            required
            label="Subject"
            disabled={Boolean(oldMessage)}
            inputProps={{
              maxLength: '48'
            }}
            fullWidth
          />
          {oldMessage && (
            <TextField
              margin="normal"
              value={originalMessage}
              type="text"
              name="previousMessage"
              id="previousMessage"
              label="Previous Message"
              variant="filled"
              multiline
              rows={3}
              InputProps={{
                readOnly: true
              }}
              fullWidth
            />
          )}
          <TextField
            margin="normal"
            value={message.message}
            type="text"
            name="message"
            id="message"
            onChange={(e) => handleChange(e)}
            multiline
            rows={4}
            label="Message"
            required
            // TODO: Determine how long a maximum length, if any, is suitable
            inputProps={{ maxLength: '500' }}
            fullWidth
          />
          <DialogActions sx={{ width: '100%' }}>
            <Box
              sx={{
                display: 'flex',
                flexDirection: isSmallScreen ? 'column' : 'row',
                gap: isSmallScreen ? '10px' : '8px',
                justifyContent: 'center',
                alignItems: 'center',
                width: '100%'
              }}
            >
              <Button
                variant="outlined"
                color="error"
                startIcon={<ClearIcon />}
                onClick={() => setShowModal(false)}
                fullWidth
              >
                Cancel
              </Button>
              <Button
                variant="contained"
                type="submit"
                color="primary"
                startIcon={<CheckIcon />}
                fullWidth
              >
                Submit
              </Button>
            </Box>
          </DialogActions>
        </form>
      </FormSection>
    </ModalBase>
  );
  /* eslint-disable jsx-a11y/label-has-associated-control */
};

export default NewMessageModal;
