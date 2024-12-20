import React from 'react';
import { BrowserRouter } from 'react-router-dom';
import { cleanup, render, screen } from '@testing-library/react';
import { afterEach, describe, expect, it, vi } from 'vitest';
import { SessionContext } from '@contexts';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ContactListTable } from '@components/Contacts';
import createMatchMedia from '../../helpers/createMatchMedia';

// Clear created DOM after each test
afterEach(() => {
  cleanup();
});

const queryClient = new QueryClient();

const MockTableComponent = ({ contacts, isSmallScreen, isLoggedIn = true }) => {
  window.matchMedia = createMatchMedia(isSmallScreen ? 500 : 1200);

  return render(
    <QueryClientProvider client={queryClient}>
      <SessionContext.Provider value={{ session: { info: { isLoggedIn } } }}>
        <BrowserRouter>
          <ContactListTable
            contacts={contacts}
            deleteContact={vi.fn()}
            handleDeleteContact={vi.fn()}
            addContact={vi.fn()}
          />
        </BrowserRouter>
      </SessionContext.Provider>
    </QueryClientProvider>
  );
};

const contacts = [
  {
    familyName: 'Abby',
    givenName: 'Aaron',
    person: 'Aaron Abby',
    webId: 'https://example.com/Abby'
  },
  {
    familyName: 'Builder',
    givenName: 'Bob',
    person: 'Bob Builder',
    webId: 'https://example.com/Builder'
  }
];

describe('contacts table tests', () => {
  it('renders all clients from client context', () => {
    MockTableComponent({ contacts });

    const allRows = screen.getAllByRole('row');

    expect(allRows.length).toBe(3);

    expect(screen.getByRole('cell', { name: 'Aaron' })).not.toBeNull();
    expect(screen.getByRole('cell', { name: 'Abby' })).not.toBeNull();
    expect(screen.getByRole('cell', { name: 'Bob' })).not.toBeNull();
    expect(screen.getByRole('cell', { name: 'Builder' })).not.toBeNull();
  });

  it('sorts clients by familyName', () => {
    const originalArray = [
      {
        familyName: 'Zeigler',
        givenName: 'Aaron',
        person: 'Aaron Zeigler',
        webId: 'https://example.com/Zeigler'
      },
      {
        familyName: 'Builder',
        givenName: 'Bob',
        person: 'Bob Builder',
        webId: 'https://example.com/Builder'
      }
    ];

    MockTableComponent({ contacts: originalArray });

    const client1 = screen.getByRole('cell', { name: 'Zeigler' });
    const client2 = screen.getByRole('cell', { name: 'Builder' });

    expect(client1.compareDocumentPosition(client2)).toBe(Node.DOCUMENT_POSITION_PRECEDING);
  });

  it('renders ContactsListTableDesktop when user is logged in on larger screen device', () => {
    MockTableComponent({ contacts, isSmallScreen: false });

    expect(screen.getByTestId('ContactListTableDesktop')).not.toBeNull();
  });

  it('renders ContactsListTableMobile when user is logged in on smaller screen device', () => {
    MockTableComponent({ contacts, isSmallScreen: true });

    expect(screen.getByTestId('ContactListTableMobile')).not.toBeNull();
  });
});
