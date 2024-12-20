// React Imports
import React from 'react';
import { Link } from 'react-router-dom';
// Material UI Imports
import { Box, Button, Typography } from '@mui/material';
// Custom Hooks Imports
import { useContactsList } from '@hooks';

/**
 * ShowNewPod - Component for displaying information about a newly registered Solid Pod.
 *
 * @memberof Signup
 * @namespace ShowNewPod
 * @param {object} props - Component props
 * @param {string} props.oidcIssuer - The URL of the Pod provider
 * @param {string} props.podUrl - The URL of the newly created pod
 * @param {string} props.webId - The user's new web ID
 * @returns {React.JSX} The rendered React component
 */
const ShowNewPod = ({ oidcIssuer, podUrl, webId }) => {
  const { data, isSuccess } = useContactsList();

  return (
    <Box>
      <Typography variant="h5">
        {podUrl ? (
          <strong>You have successfully registered for a pod.</strong>
        ) : (
          <strong>You have logged in with your existing pod.</strong>
        )}
      </Typography>
      <Box>
        {podUrl && (
          <Box>
            <Typography variant="body1">
              You can access your pod through <Link to={oidcIssuer}>your Pod Provider</Link>.
            </Typography>
            <Typography variant="body1">
              We set up this pod to operate <Link to={podUrl}>with PASS</Link>.
            </Typography>
          </Box>
        )}
        {webId && (
          <Typography variant="body1">
            Your Pod Provider has created <Link href={webId}>this webId</Link> for you.
          </Typography>
        )}
        <Typography variant="body1">
          {isSuccess && data.length > 0
            ? `You have registered with ${data[0].person}.`
            : 'You have not registered with a case manager.'}
        </Typography>
        <Button>
          <Link to={window.location.origin}>Click here to return to the Homepage</Link>
        </Button>
      </Box>
    </Box>
  );
};

export default ShowNewPod;
