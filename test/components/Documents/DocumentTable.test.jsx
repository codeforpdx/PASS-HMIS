import React from 'react';
import { BrowserRouter } from 'react-router-dom';
import { cleanup, render, screen } from '@testing-library/react';
import { afterEach, describe, it, vi, expect } from 'vitest';
import { DocumentListContext } from '@contexts';
import { DocumentTable } from '@components/Documents';
import createMatchMedia from '../../helpers/createMatchMedia';

// Clear created DOM after each test
afterEach(() => {
  cleanup();
});

const MockTableComponent = ({
  documentListObject,
  loadingDocuments,
  isMobile,
  isLoggedIn = true
}) => {
  window.matchMedia = createMatchMedia(isMobile ? 500 : 1200);

  return render(
    <DocumentListContext.Provider value={{ documentListObject, loadingDocuments }}>
      <BrowserRouter>
        <DocumentTable
          handleAclPermissionsModal={vi.fn()}
          handleSelectDeleteDoc={vi.fn()}
          session={{ info: { isLoggedIn } }}
        />
      </BrowserRouter>
    </DocumentListContext.Provider>
  );
};

const documentListObject = {
  docList: [
    {
      id: '1',
      name: 'test.pdf',
      type: 'Other',
      description: 'test description',
      uploadDate: new Date(),
      endDate: new Date(),
      fileUrl: 'http://localhost:3000/pod/PASS/Documents/test.pdf'
    },
    {
      id: '2',
      name: 'test2.pdf',
      type: 'Passport',
      description: 'test description 2',
      uploadDate: new Date(),
      endDate: null,
      fileUrl: 'http://localhost:3000/pod/PASS/Documents/test2.pdf'
    }
  ]
};

describe('DocumentTable Component', () => {
  it('renders crashing', () => {
    MockTableComponent({ documentListObject, loadingDocuments: false });
    expect(screen.getByText('test.pdf')).toBeInTheDocument();
  });

  it('displays loading animation when documents are loading', () => {
    MockTableComponent({ documentListObject, loadingDocuments: true });
    expect(screen.getByTestId('loading-animation')).toBeInTheDocument();
  });

  it('renders DocumentsDesktop for larger screens', () => {
    MockTableComponent({ documentListObject, loadingDocuments: false, isMobile: false });
    expect(screen.getByTestId('documents-desktop')).toBeInTheDocument();
  });

  it('renders DocumentsMobile for smaller screens', () => {
    MockTableComponent({ documentListObject, loadingDocuments: false, isMobile: true });
    expect(screen.getByTestId('documents-mobile')).toBeInTheDocument();
  });

  it('displays empty list notification when no documents are present', () => {
    MockTableComponent({ documentListObject: { docList: [] }, loadingDocuments: false });
    expect(screen.getByTestId('empty-list')).toBeInTheDocument();
  });

  it('renders all documents from documentListContext', () => {
    MockTableComponent({ documentListObject, loadingDocuments: false });

    const allRows = screen.getAllByRole('row');
    expect(allRows.length).toBe(documentListObject.docList.length + 1);

    documentListObject.docList.forEach((document) => {
      expect(screen.getByRole('cell', { name: document.name })).not.toBeNull();
      expect(screen.getByRole('cell', { name: document.description })).not.toBeNull();
    });
  });
});
