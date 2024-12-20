/* eslint-disable */
import { afterEach } from 'vitest';
import createMatchMedia from './createMatchMedia';
import '@testing-library/jest-dom';

process.env.VITE_SOLID_IDENTITY_PROVIDER = 'https://solidcommunity.net';
process.env.VITE_SUGGESTED_OIDC_OPTIONS =
  'http://testurl_1.com/, http://testurl_2.com/, http://testurl_3.com/';
process.env.VITE_OIDC_WEBIDS =
  '{"http://testurl_1.com/": "http://testurl_1.com/user/profile/card#me", "http://testurl_2.com/": "http://testurl_2.com/user/profile/card#me", "http://testurl_3.com/": "http://testurl_3.com/user/profile/card#me"}';

afterEach(() => {
  window.matchMedia = createMatchMedia(1200);
});
/* eslint-enable */
