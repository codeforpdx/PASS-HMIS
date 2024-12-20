import React from 'react';
import { cleanup, render, screen, fireEvent } from '@testing-library/react';
import { afterEach, describe, it, vi, expect } from 'vitest';
import { DocumentCard } from '@components/Documents';
import { SessionContext } from '@contexts';
import { BrowserRouter } from 'react-router-dom';

// Clear created DOM after each test
afterEach(() => {
  cleanup();
});

const MockCardComponent = ({
  document,
  previewDocument = vi.fn(),
  shareDocument = vi.fn(),
  deleteDocument = vi.fn(),
  isLoggedIn = true
}) => {
  const sessionObj = {
    session: { info: { isLoggedIn } }
  };

  return render(
    <SessionContext.Provider value={sessionObj}>
      <BrowserRouter>
        <DocumentCard
          document={document}
          onPreview={() => previewDocument(document.fileUrl)}
          onShare={() => shareDocument('document', document.name, document.type)}
          onDelete={() => deleteDocument(document)}
        />
      </BrowserRouter>
    </SessionContext.Provider>
  );
};

const document = {
  id: '1',
  name: 'Document 1',
  type: 'Other',
  description: 'This is a test document',
  uploadDate: new Date('2023-08-01'),
  endDate: new Date('2024-08-01'),
  fileUrl: 'https://example.com/doc1'
};

describe('DocumentCard Component', () => {
  it('renders', () => {
    MockCardComponent({ document });
    expect(screen.getByText('Document 1')).toBeInTheDocument();
  });

  it('displays document details correctly', () => {
    MockCardComponent({ document });
    expect(screen.getByText('Type: Other')).toBeInTheDocument();
    expect(screen.getByText('Uploaded: 8/1/2023')).toBeInTheDocument();
    expect(screen.getByText('Expires: 8/1/2024')).toBeInTheDocument();
    expect(screen.getByText('This is a test document')).toBeInTheDocument();
  });

  it('handles preview action correctly', () => {
    const previewDocument = vi.fn();
    MockCardComponent({ document, previewDocument });

    fireEvent.click(screen.getByRole('button', { name: 'open-actions-menu' }));

    fireEvent.click(screen.getByText('Preview'));
    expect(previewDocument).toHaveBeenCalledWith(document.fileUrl);
  });

  it('handles share action correctly', () => {
    const shareDocument = vi.fn();
    MockCardComponent({ document, shareDocument });

    fireEvent.click(screen.getByRole('button', { name: 'open-actions-menu' }));

    fireEvent.click(screen.getByText('Share'));
    expect(shareDocument).toHaveBeenCalledWith('document', document.name, document.type);
  });

  it('handles delete action correctly', () => {
    const deleteDocument = vi.fn();
    MockCardComponent({ document, deleteDocument });

    fireEvent.click(screen.getByRole('button', { name: 'open-actions-menu' }));

    fireEvent.click(screen.getByText('Delete'));
    expect(deleteDocument).toHaveBeenCalledWith(document);
  });
});
