// React Imports
import React, { useContext, useMemo } from 'react';
// Dependency Imports
import { v4 as uuidv4 } from 'uuid';
// Constants Imports
import DOC_TYPES from '@constants/doc_types';
// Material UI Imports
import Box from '@mui/material/Box';
import { useMediaQuery } from '@mui/material';
// Context Imports
import { DocumentListContext } from '@contexts';
import { useSession } from '@hooks';
// Utility Imports
import { getBlobFromSolid } from '@utils';
// Theme Imports
import theme from '../../theme';
// Component Imports
import { EmptyListNotification, LoadingAnimation } from '../Notification';
import DocumentsMobile from './DocumentsMobile';
import DocumentsDesktop from './DocumentsDesktop';

/**
 * DocumentTable - A component responsible for rendering a list of documents
 * fetched from a Solid pod. It adapts its rendering based on the screen size
 * (mobile or desktop) using the `DocumentsMobile` and `DocumentsDesktop`
 * components.
 *
 * @memberof Documents
 * @name DocumentTable
 * @param {object} props - Component props
 * @param {(modalType: string, docName: string, docType: string) => void} props.handleAclPermissionsModal - Function to open the ACL permissions modal
 * @param {(document: object) => void} props.handleSelectDeleteDoc - Function to handle document deletion
 * @returns {React.JSX.Element} - The DocumentTable component
 */
const DocumentTable = ({ handleAclPermissionsModal, handleSelectDeleteDoc }) => {
  const { session } = useSession();
  const { documentListObject, loadingDocuments } = useContext(DocumentListContext);

  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const isSmallScreenHeight = useMediaQuery('(max-height: 600px)');

  /**
   * Handles the local display of a document by opening it in a new window.
   *
   * @async
   * @function
   * @param {string} urlToOpen - The URL of the document to be opened.
   * @throws {Error} Throws an error if there is an issue fetching the document blob.
   * @returns {Promise<void>} A promise that resolves after the document is opened.
   */
  const handleShowDocumentLocal = async (urlToOpen) => {
    /**
     * Fetches a Blob from a Solid pod based on the provided session and URL.
     *
     * @async
     * @function
     * @param {object} session - The Solid session object.
     * @param {string} url - The URL of the document on the Solid pod.
     * @returns {Promise<Blob>} A promise that resolves with the Blob of the document.
     * @throws {Error} Throws an error if there is an issue fetching the document blob.
     */
    const urlFileBlob = await getBlobFromSolid(session, urlToOpen);

    // Open a new window to display the document using the blob URL
    window.open(urlFileBlob);
  };

  // Maps raw document types to user-friendly display names using `DOC_TYPES`
  const mappingType = (type) => DOC_TYPES[type] || type;

  // Processes the document list, adding unique IDs and mapping types
  const documents = useMemo(
    () =>
      documentListObject?.docList.map((document) => ({
        id: uuidv4(),
        type: mappingType(document.type),
        ...document
      })),
    [documentListObject?.docList]
  );

  const handlers = {
    onShare: handleAclPermissionsModal,
    onDelete: handleSelectDeleteDoc,
    onPreview: handleShowDocumentLocal
  };

  if (!documents?.length)
    return <EmptyListNotification type="documents" data-testid="empty-list" />;
  if (loadingDocuments)
    return <LoadingAnimation loadingItem="documents" data-testid="loading-animation" />;

  return (
    <Box
      sx={{
        margin: '20px 0',
        width: '95vw',
        height: '100%'
      }}
      data-testid="document-table"
    >
      {isMobile || isSmallScreenHeight ? (
        <DocumentsMobile documents={documents} handlers={handlers} data-testid="documents-mobile" />
      ) : (
        <DocumentsDesktop
          documents={documents}
          handlers={handlers}
          data-testid="documents-desktop"
        />
      )}
    </Box>
  );
};

export default DocumentTable;
