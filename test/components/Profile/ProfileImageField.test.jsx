import React from 'react';
import { fireEvent, render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { ProfileImageField } from '../../../src/components/Profile';
import '@testing-library/jest-dom/extend-expect';

const MockProfileComponent = ({ noUserImage, mockContactProfile }) => {
  if (noUserImage) {
    localStorage.removeItem('profileImage');
  } else {
    localStorage.setItem('profileImage', 'https://example.com/user.png');
  }
  return <ProfileImageField contactProfile={mockContactProfile} />;
};

describe('ProfileImageField', () => {
  it('renders PersonIcon if contactProfile is null and user has no profile image', () => {
    const { queryByTestId } = render(
      <MockProfileComponent noUserImage mockContactProfile={null} />
    );

    const svgElement = queryByTestId('PersonIcon');
    expect(svgElement).not.toBeNull();
  });

  it('renders image if contactProfile is null but user has profile image', () => {
    const { queryByRole, queryByTestId } = render(
      <MockProfileComponent mockContactProfile={null} />
    );

    const muiAvatar = queryByRole('img');
    expect(muiAvatar).toHaveAttribute('src', 'https://example.com/user.png');

    const svgElement = queryByTestId('PersonIcon');
    expect(svgElement).toBeNull();
  });

  it('renders upload profile picture icon when user hovers over avatar with no profile image', async () => {
    render(<MockProfileComponent noUserImage mockContactProfile={null} />);

    const avatar = screen.queryByTestId('PersonIcon');
    expect(avatar).not.toBeNull();
    expect(screen.queryByTestId('uploadProfilePictureIcon')).toBeNull();

    fireEvent.mouseEnter(avatar);
    expect(screen.getByTestId('uploadProfilePictureIcon')).not.toBeNull();
  });

  it('renders deleteProfilePictureIcon when user hovers over avatar with profile image uploaded', () => {
    const mockContactProfile = { profileImage: 'https://example.com/client.png' };
    render(<MockProfileComponent mockContactProfile={mockContactProfile} />);

    const avatar = screen.getByAltText('PASS profile');
    expect(screen.queryByTestId('deleteProfilePictureIcon')).toBeNull();

    fireEvent.mouseEnter(avatar);
    expect(screen.getByTestId('deleteProfilePictureIcon')).not.toBeNull();
  });
});
