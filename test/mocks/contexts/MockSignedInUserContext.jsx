import React from 'react';
import { vi } from 'vitest';
import { SignedInUserContext } from '@contexts';
import * as profileHelper from '../../../src/model-helpers/Profile';

const profileInfo = {
  profileName: null,
  nickname: null,
  profileImg: null
};

const mockSignedInUserContextMemo = {
  updateProfileInfo: vi.fn(),
  setProfileData: vi.fn(),
  profileData: profileInfo,
  fetchProfileInfo: vi.spyOn(profileHelper, 'fetchProfileInfo').mockResolvedValue({
    profileData: profileInfo
  })
};

/**
 * @param {object} props - The properties of the component
 * @param {React.JSX.Element} [props.children] - The child elements to be rendered inside the main content area
 * @returns {React.JSX.Element} SignedInUserContext - an element which allows querying profile info
 */
const MockSignedInUserContext = ({ children }) => (
  <SignedInUserContext.Provider value={mockSignedInUserContextMemo}>
    {children}
  </SignedInUserContext.Provider>
);

export default MockSignedInUserContext;
