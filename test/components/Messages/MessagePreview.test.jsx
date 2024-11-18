import React from 'react';
import { render, cleanup } from '@testing-library/react';
import { describe, expect, it, afterEach } from 'vitest';
import { MessagePreview } from '@components/Messages';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import createMatchMedia from '../../helpers/createMatchMedia';

const queryClient = new QueryClient();

const mockMessageInfo = { sender: 'test', recipient: 'testrecipient', title: 'test title', uploadDate: new Date('1-1-2000') };
const MockMessagePreview = () => (
  <QueryClientProvider client={queryClient}>
    <MessagePreview message={mockMessageInfo} folderType='Inbox' />
  </QueryClientProvider>
);

describe('Grid sizes', () => {
  afterEach(() => {
    cleanup();
  });

  it('renders grid values 5, 5, 2 default', () => {
    const { getByText } = render(<MockMessagePreview />);
    const senderCell = getByText('Sender:').parentElement;
    const subjectCell = getByText('Subject:').parentElement;
    const dateCell = getByText('Date:').parentElement;

    expect(senderCell.classList.contains('MuiGrid-grid-xs-5')).toBe(true);
    expect(subjectCell.classList.contains('MuiGrid-grid-xs-5')).toBe(true);
    expect(dateCell.classList.contains('MuiGrid-grid-xs-2')).toBe(true);
  });

  it('renders grid values 8, 8, 4 medium', () => {
    window.matchMedia = createMatchMedia(899);
    const { getByText } = render(<MockMessagePreview />);
    const senderCell = getByText('Sender:').parentElement;
    const subjectCell = getByText('Subject:').parentElement;
    const dateCell = getByText('Date:').parentElement;

    expect(senderCell.classList.contains('MuiGrid-grid-xs-8')).toBe(true);
    expect(subjectCell.classList.contains('MuiGrid-grid-xs-8')).toBe(true);
    expect(dateCell.classList.contains('MuiGrid-grid-xs-4')).toBe(true);
  });

  it('renders grid values 12, 12, 12 small', () => {
    window.matchMedia = createMatchMedia(599);
    const { getByText } = render(<MockMessagePreview />);
    const senderCell = getByText('Sender:').parentElement;
    const subjectCell = getByText('Subject:').parentElement;
    const dateCell = getByText('Date:').parentElement;

    expect(senderCell.classList.contains('MuiGrid-grid-xs-12')).toBe(true);
    expect(subjectCell.classList.contains('MuiGrid-grid-xs-12')).toBe(true);
    expect(dateCell.classList.contains('MuiGrid-grid-xs-12')).toBe(true);
  });
});
