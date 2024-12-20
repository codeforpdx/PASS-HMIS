// React Imports
import React from 'react';
// Material UI Imports
import Box from '@mui/material/Box';
import Container from '@mui/material/Container';
import Paper from '@mui/material/Paper';
import Typography from '@mui/material/Typography';

/**
 * EmptyListNotification Component - Component
 * that displays a message to the user letting
 * them know their data list is empty, and thus
 * nothing is being rendered.
 *
 * @memberof Notification
 * @name EmptyListNotification
 * @param {object} Props - The Props for EmptyNotification Component
 * @param {string} Props.type - The type of list notification is used for
 * @returns {React.JSX.Element} - The EmptyNotification Component
 */
const EmptyListNotification = ({ type }) => {
  const str1 = `No ${type} found.`;
  const str2 = type === 'clients' ? 'Added' : 'Uploaded';
  const str3 = `${str2} ${type} will be listed here.`;

  return (
    <Container
      aria-label="No Items Found Box"
      sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}
      data-testid="empty-list"
    >
      <Box sx={{ my: '3rem' }}>
        <Paper elevation={2} sx={{ display: 'inline-block', mx: '2px', padding: '20px' }}>
          <Typography variant="h6" component="p" align="center" color="primary.text">
            {str1}
            {type !== 'messages' ? (
              <>
                <br />
                {str3}
              </>
            ) : null}
          </Typography>
        </Paper>
      </Box>
    </Container>
  );
};

export default EmptyListNotification;
