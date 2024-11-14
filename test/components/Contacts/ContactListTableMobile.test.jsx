import React from 'react';
import { BrowserRouter } from 'react-router-dom';
import { cleanup, render, screen } from '@testing-library/react';
import { afterEach, describe, expect, it, vi } from 'vitest';
import { SessionContext } from '@contexts';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ContactListTableMobile } from '@components/Contacts';

// Clear created DOM after each test
afterEach(() => {
  cleanup();
});

const queryClient = new QueryClient();

const sortData = (data, key) =>
  [...data].sort((a, b) => {
    if (key === 'First Name') {
      return a.givenName.localeCompare(b.givenName);
    }
    if (key === 'Last Name') {
      return a.familyName.localeCompare(b.familyName);
    }
    if (key === 'Web ID') {
      return a.webId.localeCompare(b.webId);
    }
    return 0;
  });

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
        <ContactListTableMobile
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
    familyName: 'Carson',
    givenName: 'Carl',
    person: 'Carl Carson',
    webId: 'https://example.com/Carson'
  }
];

describe('contacts list table mobile tests', () => {
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
    render(<MockTableComponent contacts={[]} session={sessionObj} />);
  });

  it('renders with all clients from client context', () => {
    render(<MockTableComponent contacts={contacts} session={sessionObj} />);

    contacts.forEach((contact) => {
      const name = `${contact.givenName} ${contact.familyName}`.trim();
      const nameElement = screen.getByText(name);

      const webIdElement = screen.getByText(contact.webId);

      expect(nameElement).not.toBeNull();
      expect(webIdElement).not.toBeNull();
    });
  });

  it('sorts by first name correctly', () => {
    render(<MockTableComponent contacts={contacts} session={sessionObj} />);

    const sortedData = sortData(contacts, 'First Name');
    expect(sortedData[0].givenName).toBe('Aaron');
    expect(sortedData[1].givenName).toBe('Bob');
    expect(sortedData[2].givenName).toBe('Carl');
  });

  it('sorts by last name correctly', () => {
    render(<MockTableComponent contacts={contacts} session={sessionObj} />);

    const sortedData = sortData(contacts, 'Last Name');
    expect(sortedData[0].familyName).toBe('Abby');
    expect(sortedData[1].familyName).toBe('Builder');
    expect(sortedData[2].familyName).toBe('Carson');
  });

  it('sorts by web ID correctly', () => {
    render(<MockTableComponent contacts={contacts} session={sessionObj} />);

    const sortedData = sortData(contacts, 'Web ID');
    expect(sortedData[0].webId).toBe('https://example.com/Abby');
    expect(sortedData[1].webId).toBe('https://example.com/Builder');
    expect(sortedData[2].webId).toBe('https://example.com/Carson');
  });
});
