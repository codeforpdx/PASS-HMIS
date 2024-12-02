// React Imports
import React from 'react';
// Material UI Imports
import Box from '@mui/material/Box';
import LinearProgress from '@mui/material/LinearProgress';
import Paper from '@mui/material/Paper';
import Typography from '@mui/material/Typography';

/**
 * LoadingAnimation - Component that displays a div containing title of what is being
 * loaded and an animated loading progress bar. Must pass loadingItem attribute
 * as a string of the "title" of what is being loaded. By default LinearProgress
 * will be used as the default animation, if used as a provider (i.e. wrapping
 * children animation components), the wrapped component will be used instead for
 * animation
 *
 * @memberof Notification
 * @name LoadingAnimation
 * @param {object} Props - Component props for LoadingAnimation
 * @param {string} Props.loadingItem - The name of what you plan on loading
 * @param {boolean} Props.isModal - If component is used in modal
 * @param Props.isModal
 * @param {React.JSX.Element} [Props.children] - If used as a provider, wrapped
 * component will be used as the animation
 * @returns {React.ReactElement} Div of what is currently loading
 */
const LoadingAnimation = ({ loadingItem, children, isModal }) => (
  <Box
    sx={{
      my: '3rem',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      textAlign: 'center',
      padding: '20px'
    }}
  >
    <Paper
      elevation={2}
      sx={{
        display: 'inline-block',
        mx: '2px',
        padding: '20px',
        backgroundColor: isModal ? 'background.tint' : 'background.main'
      }}
    >
      <Typography variant="h5" component="h2" mb={2} align="center">
        Loading {loadingItem}...
      </Typography>
      {children || <LinearProgress />}
    </Paper>
  </Box>
);

export default LoadingAnimation;
