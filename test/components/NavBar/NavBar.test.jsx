import React from 'react';
import { BrowserRouter } from 'react-router-dom';
import { render, cleanup } from '@testing-library/react';
import { afterEach, describe, expect, it } from 'vitest';
import { SessionContext } from '@contexts';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import NavBar from '../../../src/components/NavBar/NavBar';
import createMatchMedia from '../../helpers/createMatchMedia';

// Clear created DOM after each test
afterEach(() => {
  cleanup();
});

const queryClient = new QueryClient();

describe('login tests', () => {
  it('renders NavbarLoggedOut when user is not logged in', () => {
    const { queryByRole } = render(
      <QueryClientProvider client={queryClient}>
        <SessionContext.Provider value={{ session: { info: { isLoggedIn: false } } }}>
          <BrowserRouter>
            <NavBar />
          </BrowserRouter>
        </SessionContext.Provider>
      </QueryClientProvider>
    );
    const loginButton = queryByRole('button', { name: 'Login' });

    expect(loginButton).not.toBeNull();
  });
});

describe('resize tests', () => {
  afterEach(() => {
    cleanup();
  });

  it('renders NavbarDesktop when user is logged in on larger screen device', () => {
    window.matchMedia = createMatchMedia(1200);

    const { getByRole } = render(
      <QueryClientProvider client={queryClient}>
        <SessionContext.Provider value={{ session: { info: { isLoggedIn: true } } }}>
          <BrowserRouter>
            <NavBar />
          </BrowserRouter>
        </SessionContext.Provider>
      </QueryClientProvider>
    );

    const iconMenu = getByRole('group');

    expect(iconMenu).not.toBeNull();
  });

  it('renders NavbarMobile when user is logged in on smaller screen device', () => {
    window.matchMedia = createMatchMedia(500);

    const { getByRole } = render(
      <QueryClientProvider client={queryClient}>
        <SessionContext.Provider value={{ session: { info: { isLoggedIn: true } } }}>
          <BrowserRouter>
            <NavBar />
          </BrowserRouter>
        </SessionContext.Provider>
      </QueryClientProvider>
    );

    const hamburgerMenu = getByRole('button', { name: /mobile/ });

    expect(hamburgerMenu).not.toBeNull();
  });
});
