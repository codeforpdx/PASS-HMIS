// React Import
import React from 'react';
// Material UI Imports
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import { useTheme } from '@mui/material/styles';
// Component Imports
import DocumentCard from './DocumentCard';

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
 * @typedef {object} Handlers
 * @property {Function} onPreview - Function to handle document previewing.
 * @property {Function} onShare - Function to handle document sharing.
 * @property {Function} onDelete - Function to handle document deletion.
 */

/**
 * DocumentsMobile - A component designed to display a list of documents
 * in a mobile-friendly layout using `DocumentCard` components.
 *
 * @memberof Documents
 * @name DocumentsMobile
 * @param {object} props - Component props
 * @param {Document[]} props.documents - An array of document objects to be displayed
 * @param {Handlers} props.handlers - An object containing handler functions for document actions (preview, share, delete)
 * @returns {React.JSX.Element} The DocumentsMobile component
 */
const DocumentsMobile = ({ documents, handlers }) => {
  const theme = useTheme();

  const tableHeaderStyling = {
    display: 'flex',
    justifyContent: 'space-between'
  };

  const tableStyling = {
    my: '15px',
    p: '16px',
    background: theme.palette.primary.main,
    color: '#fff',
    borderRadius: '8px',
    position: 'relative'
  };

  return (
    <Box data-testid="documents-mobile">
      <Box sx={tableStyling}>
        <Box sx={tableHeaderStyling}>
          <Typography
            sx={{
              justifyContent: 'flex-start'
            }}
          >
            Document
          </Typography>
          <Typography
            sx={{
              justifyContent: 'flex-end',
              // maxWidth: '54px',
              marginRight: '0'
            }}
          >
            Actions
          </Typography>
        </Box>
      </Box>

      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          rowGap: '12px'
        }}
      >
        {documents.map((document) => (
          <DocumentCard
            key={document.id}
            document={document}
            onShare={() => handlers.onShare('document', document.name, document.type)}
            onDelete={() => handlers.onDelete(document)}
            onPreview={() => handlers.onPreview(document.fileUrl)}
          />
        ))}
      </Box>
    </Box>
  );
};

export default DocumentsMobile;
