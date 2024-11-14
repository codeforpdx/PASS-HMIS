import React from 'react';
import { expect, it, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { NewMessageModal } from '@components/Modals';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
// For testing
import { sendMessageTTL } from '@utils';
import createMatchMedia from '../../helpers/createMatchMedia';

const queryClient = new QueryClient();

const MockNewMessageModal = () => (
  <QueryClientProvider client={queryClient}>
    <NewMessageModal showModal />
  </QueryClientProvider>
);

it('renders button group flex-direction as row default', () => {
  const { getByRole } = render(<MockNewMessageModal />);
  const cancelButton = getByRole('button', { name: 'Cancel' });
  const buttonContainer = cancelButton.parentElement;
  const cssProperty = getComputedStyle(buttonContainer);

  expect(cssProperty.flexDirection).toBe('row');
});

it('renders button group flex-direction as column mobile', () => {
  window.matchMedia = createMatchMedia(599);
  const { getByRole } = render(<MockNewMessageModal />);
  const cancelButton = getByRole('button', { name: 'Cancel' });
  const buttonContainer = cancelButton.parentElement;
  const cssProperty = getComputedStyle(buttonContainer);

  expect(cssProperty.flexDirection).toBe('column');
});

it('will submit data only after deleting leading and trailing spaces from each field', async () => {
  const user = userEvent.setup(() => new Promise());

  // Mocks required so it won't crash from undefined imports
  vi.mock('@hooks/useNotification', async (importOriginal) => {
    const mod = await importOriginal();
    return {
      ...mod,
      default: vi.fn(() => ({ addNotification: vi.fn().mockResolvedValue() }))
    };
  });

  vi.mock('@hooks/useContactsList', async (importOriginal) => {
    const mod = await importOriginal();
    return {
      ...mod,
      default: vi.fn(() => ({ data: [] }))
    };
  });

  vi.mock('@utils', async (importOriginal) => {
    const mod = await importOriginal();
    return {
      ...mod,
      getMessageTTL: vi.fn().mockResolvedValue([]),
      sendMessageTTL: vi.fn().mockResolvedValue()
    };
  });

  vi.spyOn(Storage.prototype, 'setItem');
  const setItemSpy = vi.fn();
  Storage.prototype.setItem = setItemSpy;
  vi.spyOn(Storage.prototype, 'getItem');
  const getItemSpy = vi.fn(() => 'http://www.oidcIssuer.com');
  Storage.prototype.getItem = getItemSpy;

  const inputData = {
    to: 'to  ',
    subject: '  subject',
    message: '  message  '
  };

  render(<MockNewMessageModal />);

  const autocomplete = screen.getByTestId('newMessageTo');
  const toInput = autocomplete.querySelector('input');
  const subjectInput = screen.getByRole('textbox', { name: 'Subject' });
  const messageInput = screen.getByRole('textbox', { name: 'Message' });
  const submitButton = screen.getByRole('button', { name: 'Submit' });

  await user.type(toInput, inputData.to);
  await user.type(subjectInput, inputData.subject);
  await user.type(messageInput, inputData.message);

  expect(toInput.value).toBe(inputData.to);
  expect(subjectInput.value).toBe(inputData.subject);
  expect(messageInput.value).toBe(inputData.message);

  await user.click(submitButton);

  expect(sendMessageTTL).toHaveBeenCalled();
  const messageObject = sendMessageTTL.mock.calls[0][1];
  // Should be the input data without leading or trailing whitespace
  expect(messageObject.recipientPodUrl).toBe(inputData.to.trim());
  expect(messageObject.title).toBe(inputData.subject.trim());
  expect(messageObject.message).toBe(inputData.message.trim());
});

it('selecting contact from autocomplete', async () => {
  vi.mock('@hooks/useContactsList', async (importOriginal) => {
    const mod = await importOriginal();
    return {
      ...mod,
      default: vi.fn(() => ({
        data: [
          {
            familyName: 'test',
            givenName: 'mock',
            podUrl: 'http://example/mocktest',
            thingId: 'http://example/mocktest/profile/card#me',
            webId: 'http://example/mocktest/profile/card#me'
          }
        ]
      }))
    };
  });

  render(<MockNewMessageModal />);
  // Get the input field of autocomplete
  const autocomplete = screen.getByTestId('newMessageTo');
  const toInput = autocomplete.querySelector('input');

  // Change the value of input
  await userEvent.type(toInput, 'test');
  // Keydown to highlight autocomplete dropdown option
  await userEvent.keyboard('[ArrowDown]');
  // Enter to select dropdown option
  await userEvent.keyboard('[Enter]');
  // verify value of input field
  expect(toInput.value).toBe('http://example/mocktest');
});
