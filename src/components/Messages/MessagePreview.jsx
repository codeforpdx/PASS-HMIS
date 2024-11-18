// React Imports
import React, { useState } from 'react';
// Material UI Imports
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Container from '@mui/material/Container';
import Divider from '@mui/material/Divider';
import Grid from '@mui/material/Grid';
import ListItemButton from '@mui/material/ListItemButton';
import Paper from '@mui/material/Paper';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import useMediaQuery from '@mui/material/useMediaQuery';
import { useTheme } from '@mui/material/styles';
// Custom Hooks Imports
import { useMessageList } from '@hooks';
// Component Imports
import { NewMessageModal } from '../Modals';

/**
 * @typedef {import("../../typedefs.js").messageListObject} messageListObject
 */

/**
 * MessagePreview - Component that displays message previews from
 * user's Inbox container
 *
 * @memberof Messages
 * @name MessagePreview
 * @param {object} Props - Component props for MessagePreview
 * @param {messageListObject} Props.message - The message object
 * @param {string} Props.folderType - Type of message box
 * @returns {React.JSX.Element} React component for MessagePreview
 */
const MessagePreview = ({ message, folderType }) => {
  const [showContents, setShowContents] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const { add: updateReadStatus } = useMessageList('Inbox');

  const handleMarkRead = async () => {
    setShowContents(!showContents);
    if (folderType === 'Inbox' && !message.readStatus) {
      try {
        await updateReadStatus(message);
      } catch {
        throw new Error('Failed to update read status');
      }
    }
  };

  const handleMarkUnread = async () => {
    try {
      await updateReadStatus(message);
    } catch {
      throw new Error('Failed to update read status');
    }
  };

  const handleReplyMessage = () => {
    setShowModal(!showModal);
  };

  const theme = useTheme();
  const isSmallScreen = useMediaQuery(theme.breakpoints.down('sm'));
  const isMediumScreen = useMediaQuery(theme.breakpoints.down('md'));

  const renderMediumGridLeft = () => {
    if (isMediumScreen) return 8;
    return 5;
  };

  const renderMediumGridRight = () => {
    if (isMediumScreen) return 4;
    return 2;
  };

  const isInbox = folderType === 'Inbox';

  const messageInfo = [
    {
      title: isInbox ? 'Sender: ' : 'Recipient: ',
      text: isInbox ? message?.sender : message?.recipient,
      xs_value: isSmallScreen ? 12 : renderMediumGridLeft()
    },
    {
      title: 'Subject: ',
      text: message?.title,
      xs_value: isSmallScreen ? 12 : renderMediumGridLeft()
    },
    {
      title: 'Date: ',
      text: message?.uploadDate?.toLocaleDateString(),
      xs_value: isSmallScreen ? 12 : renderMediumGridRight()
    }
  ];

  return (
    <>
      <Container sx={{ wordWrap: 'break-word' }}>
        <Paper>
          <Box sx={{ flexGrow: 1 }}>
            <ListItemButton
              onClick={handleMarkRead}
              alignItems="flex-start"
              aria-label={`open message preview ${message.messageId}`}
            >
              <Grid container columnSpacing={1} sx={{ padding: isSmallScreen ? '0' : '10px' }}>
                {messageInfo.map((info, index) => (
                  <Grid
                    item
                    xs={info.xs_value}
                    sx={{ opacity: message.readStatus ? '0.5' : '1' }}
                    key={info.title + String(index)}
                  >
                    <Typography>
                      {info.title} <strong>{info.text}</strong>
                    </Typography>
                  </Grid>
                ))}

                {showContents && (
                  <Grid item xs={12}>
                    <Divider />
                    {message.message.split('\n').map((line, index) => (
                      <Typography sx={{ padding: '10px 5px' }} key={line + String(index)}>
                        {line}
                      </Typography>
                    ))}
                    {showContents && folderType === 'Inbox' && (
                      <Stack direction="row" spacing={2}>
                        <Button variant="contained" onClick={handleReplyMessage}>
                          Reply
                        </Button>
                        <Button variant="outlined" onClick={handleMarkUnread}>
                          Mark as Unread
                        </Button>
                      </Stack>
                    )}
                  </Grid>
                )}
              </Grid>
            </ListItemButton>
          </Box>
        </Paper>
      </Container>
      <NewMessageModal showModal={showModal} setShowModal={setShowModal} oldMessage={message} />
    </>
  );
};

export default MessagePreview;
