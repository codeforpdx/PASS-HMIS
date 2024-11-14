import React from 'react';
import { BrowserRouter } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { act } from 'react-dom/test-utils';
import { render, screen, cleanup /* waitForElementToBeRemoved */ } from '@testing-library/react';
// import userEvent from '@testing-library/user-event';
import { describe, expect, it, beforeEach, afterEach } from 'vitest';
import { Profile } from '@pages';
import MockSignedInUserContext from '../mocks/contexts/MockSignedInUserContext';

const queryClient = new QueryClient();

const renderProfile = () =>
  render(
    <QueryClientProvider client={queryClient}>
      <MockSignedInUserContext>
        <BrowserRouter>
          <Profile />
        </BrowserRouter>
      </MockSignedInUserContext>
    </QueryClientProvider>
  );

describe('Profile Page', () => {
  afterEach(() => {
    cleanup();
  });

  beforeEach(() => {
    act(() => {
      renderProfile();
    });
  });

  it('renders', async () => {
    const heading = await screen.findByRole('heading', { name: 'My Profile' }, { timeout: 2000 });
    expect(heading).toHaveAccessibleName('My Profile');
  });

  // TODO: Need to re-work unit tests to take into account the migrating components
  //       Profile to Documents
  // it('can show and hide the share documents modal', async () => {
  //   const user = userEvent.setup();

  //   const shareDocumentsButton = await screen.findByRole(
  //     'button',
  //     { name: 'Share Documents' },
  //     { timeout: 2000 }
  //   );
  //   expect(shareDocumentsButton).toHaveAccessibleName('Share Documents');

  //   // Open share document modal
  //   user.click(shareDocumentsButton);
  //   const shareHeading = await screen.findByRole('heading', { name: 'Share All Documents' });
  //   expect(shareHeading).toBeVisible();

  //   // Close share document modal
  //   user.keyboard('{escape}');
  //   await waitForElementToBeRemoved(shareHeading, { timeout: 5000 });
  // });

  // it('can show and hide the add document modal', async () => {
  //   const user = userEvent.setup();

  //   const addDocumentButton = await screen.findByRole(
  //     'button',
  //     { name: 'Add Document' },
  //     { timeout: 2000 }
  //   );
  //   expect(addDocumentButton).toHaveAccessibleName('Add Document');

  //   // Open add document modal
  //   user.click(addDocumentButton);
  //   const addHeading = await screen.findByRole('heading', { name: 'Upload Document' });

  //   // close add document modal
  //   user.keyboard('{escape}');
  //   await waitForElementToBeRemoved(addHeading, { timeout: 5000 });
  // });
});
