// React Imports
import React from 'react';
// Material UI Imports
import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';

/**
 * KeyFeatures - Represents key features section component
 *
 * @memberof Home
 * @name KeyFeatures
 * @param {object} Props - The props
 * @param {string} Props.icon - Icon
 * @param {string} Props.title - Key feature title
 * @param {string} Props.description - Key feature description
 * @param {string} Props.isReallySmallScreen - Screen size based on media query
 * @returns {React.JSX.Element} The KeyFeatures section component
 */
const KeyFeatures = ({ icon, title, description, isReallySmallScreen }) => {
  const flexDirection = isReallySmallScreen ? 'column' : 'row';

  return (
    <Stack alignItems="center">
      <Box
        sx={{
          display: 'flex',
          flexDirection,
          alignItems: 'center',
          justifyContent: 'center',
          gap: '10px',
          marginBottom: '14px',
          color: 'primary.main'
        }}
      >
        {icon}
        <Typography
          variant="h6"
          component="h3"
          sx={{
            color: 'primary.main',
            textAlign: 'center'
          }}
        >
          <strong>{title}</strong>
        </Typography>
      </Box>
      <Typography
        variant="body1"
        sx={{
          textAlign: 'center',
          color: 'primary.dark',
          marginBottom: '50px'
        }}
      >
        {description}
      </Typography>
    </Stack>
  );
};

export default KeyFeatures;
