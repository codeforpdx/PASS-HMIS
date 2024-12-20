// React Imports
import React from 'react';
// Material UI Imports
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
// Util Imports
import { truncateText } from '@utils';

/**
 * FormSection - Component that wraps section with title and MUI Box
 * component
 *
 * @memberof Forms
 * @name FormSection
 * @param {object} Props - A React prop that consists of
 * that consist of title and children (see {@link formSectionProps})
 * @param {string} Props.headingId - The `id` attribute of the element containing the `title`
 * @param {string} Props.title - Title of form section
 * @param {React.ReactElement} Props.children - The child elements to be rendered inside the main content area
 * @returns {React.JSX.Element} The FormSection component
 */
const FormSection = ({ title, headingId, children }) => {
  const truncatedText = title ? truncateText(title) : '';

  return (
    <Box
      sx={{
        p: '20px'
      }}
    >
      <Typography
        variant="h2"
        align="center"
        mb={1}
        sx={{
          fontSize: '20px',
          fontWeight: 'bold',
          maxWidth: '100%'
        }}
        id={headingId}
      >
        {truncatedText}
      </Typography>
      {children}
    </Box>
  );
};

export default FormSection;
