// React Import
import React from 'react';
import { useLocation } from 'react-router-dom';
// Material UI Imports
import DeleteOutlineOutlinedIcon from '@mui/icons-material/DeleteOutlineOutlined';
import FileOpenIcon from '@mui/icons-material/FileOpen';
import ShareIcon from '@mui/icons-material/Share';
import {
  DataGrid,
  GridActionsCellItem,
  GridToolbarContainer,
  GridToolbarDensitySelector,
  GridToolbarFilterButton
} from '@mui/x-data-grid';
// Util Imports
import { getTypeText } from '@utils';
// Theme Imports
import theme from '../../theme';

const MUIDataGridStyling = {
  '.MuiDataGrid-columnHeader': {
    background: theme.palette.primary.light,
    color: 'white'
  },
  '.MuiDataGrid-columnSeparator': {
    display: 'none'
  }
};

// Custom toolbar for the DataGrid
const CustomToolbar = () => (
  <GridToolbarContainer>
    <GridToolbarFilterButton />
    <GridToolbarDensitySelector />
  </GridToolbarContainer>
);

/**
 * @typedef {object} Document
 * @property {string} id - The unique id of the document
 * @property {string} name - The name of the document
 * @property {string} type - The type of the document
 * @property {string} description - A brief description of the document
 * @property {string} uploadDate- The date when the document was uploaded
 * @property {string} endDate - The expiration date of the document (if applicable)
 * @property {string} fileUrl - The URL where the document file is located
 */

/**
 * @typedef {object} Handlers
 * @property {Function} onPreview - Function to handle document previewing.
 * @property {Function} onShare - Function to handle document sharing.
 * @property {Function} onDelete - Function to handle document deletion.
 */

/**
 * DocumentsDesktop - A component that displays a list of documents in a tabular
 * format (DataGrid) suitable for desktop screens. It provides actions like
 * preview, share, and delete for each document.
 *
 * @memberof Documents
 * @name DocumentsDesktop
 * @param {object} props - Component props
 * @param {Document[]} props.documents - An array of document objects to be displayed
 * @param {Handlers} props.handlers - An object containing handler functions for document actions
 * @returns {React.JSX.Element} The DocumentsDesktop component
 */
const DocumentsDesktop = ({ documents, handlers }) => {
  const location = useLocation();

  const columnTitlesArray = [
    { field: 'Name', minWidth: 120, flex: 1, headerAlign: 'center', align: 'center' },
    { field: 'Type', minWidth: 120, flex: 1, headerAlign: 'center', align: 'center' },
    { field: 'Description', minWidth: 120, flex: 1, headerAlign: 'center', align: 'center' },
    { field: 'Upload Date', minWidth: 120, flex: 1, headerAlign: 'center', align: 'center' },
    { field: 'Expiration Date', minWidth: 120, flex: 1, headerAlign: 'center', align: 'center' },
    {
      field: 'Preview',
      minWidth: 100,
      flex: 1,
      headerAlign: 'center',
      align: 'center',
      sortable: false,
      filterable: false,
      renderCell: (data) => {
        const [id, fileUrl] = data.value;
        return (
          <GridActionsCellItem
            key={`Preview:${String(id)}`}
            icon={<FileOpenIcon />}
            onClick={() => handlers.onPreview(fileUrl)}
            label="Preview"
            data-testid={`preview-button-${id}`}
          />
        );
      }
    },
    {
      field: 'Share',
      minWidth: 100,
      flex: 1,
      headerAlign: 'center',
      align: 'center',
      sortable: false,
      filterable: false,
      renderCell: (data) => {
        const [id, name, type] = data.value;
        return (
          <GridActionsCellItem
            key={`Share:${String(id)}`}
            icon={<ShareIcon />}
            onClick={() => handlers.onShare('document', name, type)}
            label="Share"
            data-testid={`share-button-${id}`}
            disabled={location.pathname !== '/documents'}
          />
        );
      }
    },
    {
      field: 'Delete',
      minWidth: 100,
      flex: 1,
      headerAlign: 'center',
      align: 'center',
      sortable: false,
      filterable: false,
      renderCell: (data) => {
        const [document] = data.value;
        return (
          <GridActionsCellItem
            key={`Delete:${String(document.id)}`}
            icon={<DeleteOutlineOutlinedIcon />}
            onClick={() => handlers.onDelete(document)}
            label="Delete"
            data-testid={`delete-button-${document.id}`}
            disabled={location.pathname !== '/documents'}
          />
        );
      }
    }
  ];

  return (
    <DataGrid
      disableVirtualization
      columns={columnTitlesArray}
      rows={documents.map((document) => ({
        id: document.id,
        Name: document.name,
        Type: getTypeText(document.type),
        Description: document.description || '[Not Provided]',
        'Upload Date': document?.uploadDate.toLocaleDateString(),
        'Expiration Date': document?.endDate?.toLocaleDateString() || '[Not Provided]',
        Preview: [document.id, document.fileUrl],
        Share: [document.id, document.name, document.type],
        Delete: [document]
      }))}
      pageSizeOptions={[10]}
      initialState={{
        pagination: {
          paginationModel: { pageSize: 10, page: 0 }
        }
      }}
      slots={{
        toolbar: CustomToolbar
      }}
      sx={MUIDataGridStyling}
      disableColumnMenu
      disableRowSelectionOnClick
      data-testid="documents-desktop"
    />
  );
};

export default DocumentsDesktop;
