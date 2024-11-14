import React from 'react';
import { BrowserRouter } from 'react-router-dom';
import { cleanup, render, screen, within, fireEvent } from '@testing-library/react';
import { afterEach, describe, expect, it, vi } from 'vitest';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { SessionContext } from '@contexts';
import { DocumentsDesktop } from '@components/Documents';
import { getTypeText } from '@utils';

// Clear created DOM after each test
afterEach(() => {
  cleanup();
});

const queryClient = new QueryClient();

const MockTableComponent = ({
  documents,
  deleteDocument = vi.fn(),
  previewDocument = vi.fn(),
  shareDocument = vi.fn(),
  'data-testid': dataTestId = 'documents-desktop',
  sessionObj
}) => (
  <QueryClientProvider client={queryClient}>
    <SessionContext.Provider value={sessionObj}>
      <BrowserRouter>
        <DocumentsDesktop
          documents={documents}
          handlers={{
            onDelete: deleteDocument,
            onPreview: previewDocument,
            onShare: shareDocument
          }}
          data-testid={dataTestId}
          disableVirtualization
        />
      </BrowserRouter>
    </SessionContext.Provider>
  </QueryClientProvider>
);

const documents = [
  {
    id: '1',
    name: 'Document 1',
    type: 'Other',
    description: 'Description 1',
    uploadDate: new Date('2023-08-01'),
    endDate: new Date('2024-08-01'),
    fileUrl: 'https://example.com/doc1'
  },
  {
    id: '2',
    name: 'Document 2',
    type: 'Other',
    description: 'Description 2',
    uploadDate: new Date('2023-07-01'),
    endDate: new Date('2024-07-01'),
    fileUrl: 'https://example.com/doc2'
  }
];

describe('DocumentsDesktop Component', () => {
  const sessionObj = {
    login: vi.fn(),
    fetch: vi.fn(),
    podUrl: 'https://example.com',
    session: {
      fetch: vi.fn(),
      info: {
        webId: 'https://example.com/profile/',
        isLoggedIn: true
      }
    }
  };

  it('renders', () => {
    render(<MockTableComponent documents={documents} sessionObj={sessionObj} />);
  });

  it('renders documents in the grid with all expected values', () => {
    render(<MockTableComponent documents={documents} sessionObj={sessionObj} />);

    const dataGrid = screen.getByTestId('documents-desktop');

    documents.forEach((document) => {
      expect(within(dataGrid).getByText(document.name)).not.toBeNull();

      const typeElements = within(dataGrid).getAllByText(getTypeText(document.type));
      expect(typeElements.length).toBeGreaterThan(0);

      expect(within(dataGrid).getByText(document.description)).not.toBeNull();

      expect(within(dataGrid).getByText(document.uploadDate.toLocaleDateString())).not.toBeNull();

      const endDateText = document.endDate
        ? document.endDate.toLocaleDateString()
        : '[Not Provided]';
      expect(within(dataGrid).getByText(endDateText)).not.toBeNull();
    });
  });

  it('handles preview button click', () => {
    const previewDocument = vi.fn();
    render(
      <MockTableComponent
        documents={documents}
        previewDocument={previewDocument}
        sessionObj={sessionObj}
      />
    );

    fireEvent.click(screen.getByTestId(`preview-button-${documents[0].id}`));

    expect(previewDocument).toHaveBeenCalledWith(documents[0].fileUrl);
  });

  // TODO: both unit tests needs to be re-worked to take into account disabled
  //       condition inside GridActionsCellItem
  // it('handles share button click', () => {
  //   const shareDocument = vi.fn();
  //   render(
  //     <MockTableComponent
  //       documents={documents}
  //       shareDocument={shareDocument}
  //       sessionObj={sessionObj}
  //     />
  //   );

  //   fireEvent.click(screen.getByTestId(`share-button-${documents[0].id}`));
  //   expect(shareDocument).toHaveBeenCalledWith('document', documents[0].name, documents[0].type);
  // });

  // it('handles delete button click', () => {
  //   const deleteDocument = vi.fn();
  //   render(
  //     <MockTableComponent
  //       documents={documents}
  //       deleteDocument={deleteDocument}
  //       sessionObj={sessionObj}
  //     />
  //   );

  //   fireEvent.click(screen.getByTestId(`delete-button-${documents[0].id}`));
  //   expect(deleteDocument).toHaveBeenCalledWith(documents[0]);
  // });
});
