import React from 'react';
import { BrowserRouter } from 'react-router-dom';
import { cleanup, render, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { afterEach, describe, expect, it, vi } from 'vitest';
import { ProfileComponent } from '@components/Profile';
import '@testing-library/jest-dom/extend-expect';
import createMatchMedia from '../../helpers/createMatchMedia';
import MockSignedInUserContext from '../../mocks/contexts/MockSignedInUserContext';

const renderTest = (contactProfile = null) =>
  render(
    <BrowserRouter>
      <MockSignedInUserContext>
        <ProfileComponent contactProfile={contactProfile} />
      </MockSignedInUserContext>
    </BrowserRouter>
  );

describe('ProfileComponent', () => {
  afterEach(() => {
    cleanup();
    vi.clearAllMocks();
  });

  it('renders cancel and update buttons after clicking on edit button from initial render', async () => {
    const { queryByRole } = renderTest();
    await waitFor(async () => {
      let editButton = queryByRole('button', { name: 'Edit' });
      expect(editButton).not.toBeNull();

      const user = userEvent.setup();
      await user.click(editButton);

      const cancelButton = queryByRole('button', { name: 'Cancel' });
      const updateButton = queryByRole('button', { name: 'Update' });

      expect(cancelButton).not.toBeNull();
      expect(updateButton).not.toBeNull();

      editButton = queryByRole('button', { name: 'Edit' });
      expect(editButton).toBeNull();
    });
  });

  it('renders edit buttons after clicking on cancel button', async () => {
    const { queryByRole } = renderTest();
    await waitFor(async () => {
      let editButton = queryByRole('button', { name: 'Edit' });
      let cancelButton;
      let updateButton;

      const user = userEvent.setup();
      await user.click(editButton);

      updateButton = queryByRole('button', { name: 'Update' });
      cancelButton = queryByRole('button', { name: 'Cancel' });
      await user.click(cancelButton);

      editButton = queryByRole('button', { name: 'Edit' });
      expect(editButton).not.toBeNull();

      updateButton = queryByRole('button', { name: 'Update' });
      expect(updateButton).toBeNull();

      cancelButton = queryByRole('button', { name: 'Cancel' });
      expect(cancelButton).toBeNull();
    });
  });

  it('renders no edit button for ProfileInputFields if contactProfile is not null', async () => {
    const { queryByRole } = renderTest({});
    await waitFor(() => {
      const editButton = queryByRole('button', { name: 'Edit' });

      expect(editButton).toBeNull();
    });
  });

  it('renders profile component as row default', async () => {
    const component = renderTest();
    await waitFor(() => {
      const container = component.container.firstChild;
      const cssProperty = getComputedStyle(container);

      expect(cssProperty.flexDirection).toBe('row');
    });
  });

  it('renders profile component as column mobile', async () => {
    window.matchMedia = createMatchMedia(599);

    const component = renderTest();
    await waitFor(() => {
      const container = component.container.firstChild;
      const cssProperty = getComputedStyle(container);

      expect(cssProperty.flexDirection).toBe('column');
    });
  });
});
