import React from 'react';
import { BrowserRouter } from 'react-router-dom';
import { cleanup, render, screen, fireEvent } from '@testing-library/react';
import { afterEach, describe, it, vi, expect } from 'vitest';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { SessionContext } from '@contexts';
import { DocumentsMobile } from '@components/Documents';

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
  'data-testid': dataTestId = 'documents-mobile',
  sessionObj
}) => (
  <QueryClientProvider client={queryClient}>
    <SessionContext.Provider value={sessionObj}>
      <BrowserRouter>
        <DocumentsMobile
          documents={documents}
          handlers={{
            onDelete: deleteDocument,
            onPreview: previewDocument,
            onShare: shareDocument
          }}
          data-testid={dataTestId}
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

describe('DocumentsMobile Component', () => {
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

  it('renders document cards', () => {
    render(<MockTableComponent documents={documents} sessionObj={sessionObj} />);

    documents.forEach((doc) => {
      const name = screen.getByText(doc.name);
      const types = screen.getAllByText(`Type: ${doc.type}`);
      expect(name).toBeInTheDocument();
      expect(types).toHaveLength(2);
    });
  });

  it('handles preview action', () => {
    const previewDocument = vi.fn();
    render(
      <MockTableComponent
        documents={documents}
        previewDocument={previewDocument}
        sessionObj={sessionObj}
      />
    );

    fireEvent.click(screen.getAllByLabelText('open-actions-menu')[0]);

    fireEvent.click(screen.getByText('Preview'));
    expect(previewDocument).toHaveBeenCalledWith(documents[0].fileUrl);
  });

  it('handles share action', () => {
    const shareDocument = vi.fn();
    render(
      <MockTableComponent
        documents={documents}
        shareDocument={shareDocument}
        sessionObj={sessionObj}
      />
    );

    fireEvent.click(screen.getAllByLabelText('open-actions-menu')[0]);

    fireEvent.click(screen.getByText('Share'));
    expect(shareDocument).toHaveBeenCalledWith('document', documents[0].name, documents[0].type);
  });

  it('handles delete action', () => {
    const deleteDocument = vi.fn();
    render(
      <MockTableComponent
        documents={documents}
        deleteDocument={deleteDocument}
        sessionObj={sessionObj}
      />
    );

    fireEvent.click(screen.getAllByLabelText('open-actions-menu')[0]);

    fireEvent.click(screen.getByText('Delete'));
    expect(deleteDocument).toHaveBeenCalledWith(documents[0]);
  });
});
