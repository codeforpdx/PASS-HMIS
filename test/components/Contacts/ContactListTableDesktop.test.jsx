import React from 'react';
import { BrowserRouter } from 'react-router-dom';
import { cleanup, render, screen, within } from '@testing-library/react';
import { afterEach, describe, expect, it, vi } from 'vitest';
import { SessionContext } from '@contexts';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ContactListTableDesktop } from '@components/Contacts';

// Clear created DOM after each test
afterEach(() => {
  cleanup();
});

const queryClient = new QueryClient();

const MockTableComponent = ({
  contacts,
  deleteContact = vi.fn(),
  editContact = vi.fn(),
  handleSendMessage = vi.fn(),
  'data-testid': dataTestId = 'contacts-table',
  sessionObj
}) => (
  <QueryClientProvider client={queryClient}>
    <SessionContext.Provider value={sessionObj}>
      <BrowserRouter>
        <ContactListTableDesktop
          contacts={contacts}
          deleteContact={deleteContact}
          editContact={editContact}
          handleSendMessage={handleSendMessage}
          data-testid={dataTestId}
        />
      </BrowserRouter>
    </SessionContext.Provider>
  </QueryClientProvider>
);

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
  },
  {
    familyName: 'Carl',
    givenName: 'Carson',
    person: 'Carl Carson',
    webId: 'https://example.com/Carson'
  }
];

describe('contacts list table desktop tests', () => {
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
    render(<MockTableComponent contacts={contacts} session={sessionObj} />);
  });

  it('renders with all clients from client context', () => {
    render(<MockTableComponent contacts={contacts} session={sessionObj} />);

    const dataGrid = screen.getByTestId('contacts-table');

    contacts.forEach((contact) => {
      expect(within(dataGrid).getByText(contact.givenName)).not.toBeNull();
      expect(within(dataGrid).getByText(contact.familyName)).not.toBeNull();
    });
  });
});
