import React from 'react';
import { render } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { expect, it, describe, vi } from 'vitest';
import { BrowserRouter } from 'react-router-dom';
import { Signup } from '@pages';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { SessionContext } from '@contexts';
import { initializePod, registerPod } from '@components/Signup';
import { useNotification } from '@hooks';
import { ThemeProvider } from '@mui/material/styles';
import theme from '../../src/theme';

vi.mock('@hooks', async () => {
  const actual = await vi.importActual('@hooks');

  return {
    ...actual,
    useNotification: vi.fn()
  };
});
vi.mock('react-router-dom', async () => {
  const originalModule = await vi.importActual('react-router-dom');

  return {
    ...originalModule,
    useSearchParams: () => [new URLSearchParams({ webId: 'https://example.com/profile' })]
  };
});

vi.mock('@components/Signup', async () => {
  const orig = await vi.importActual('@components/Signup');

  return {
    ...orig,
    initializePod: vi.fn(),
    registerPod: vi.fn((email) => {
      if (email && /emailExists/.test(email)) {
        // pretending this email is already in solid
        return Promise.reject(new Error());
      }
      return Promise.resolve({ webId: '', podUrl: '', fetch: vi.fn() });
    })
  };
});

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: false
    }
  }
});

const MockSignupContexts = ({ session }) => (
  <QueryClientProvider client={queryClient}>
    <ThemeProvider theme={theme}>
      <BrowserRouter>
        <SessionContext.Provider value={session}>
          <Signup />
        </SessionContext.Provider>
      </BrowserRouter>
    </ThemeProvider>
  </QueryClientProvider>
);

describe('Signup Page', () => {
  it('renders', () => {
    const sessionObj = {
      login: vi.fn(),
      fetch: vi.fn(),
      podUrl: 'https://example.com',
      session: {
        info: {
          webId: 'https://example.com/profile/',
          isLoggedIn: false
        }
      }
    };
    useNotification.mockReturnValue({ addNotification: vi.fn() });
    const { getByRole } = render(<MockSignupContexts session={sessionObj} />);
    expect(getByRole('heading', { name: 'Sign Up' })).not.toBeNull();
  });
  it('lets users request to create pods', async () => {
    const session = {
      login: vi.fn(),
      fetch: vi.fn(),
      podUrl: 'https://example.com',
      session: {
        info: {
          webId: 'https://example.com/profile/',
          isLoggedIn: false
        }
      }
    };
    const user = userEvent.setup();
    const { getByRole, getAllByRole, getByLabelText } = render(
      <MockSignupContexts session={session} />
    );
    global.fetch = vi.fn(() => Promise.resolve({ json: vi.fn() }));
    const email = 'tim@example.com';
    const password = 'password';
    const confirmPassword = 'password';
    const emailField = getByRole('textbox', { name: 'Email' });
    const passwordField = getByLabelText('Password');
    const confirmPasswordField = getByLabelText('Confirm Password');
    await user.type(emailField, email);
    await user.type(passwordField, password);
    await user.type(confirmPasswordField, confirmPassword);
    await user.click(getAllByRole('button')[2]);

    expect(registerPod).toHaveBeenCalledOnce();
    expect(initializePod).toBeCalledTimes(1);
  });
  it('it fails if email is already registered', async () => {
    const session = {
      login: vi.fn(),
      fetch: vi.fn(),
      podUrl: 'https://example.com',
      session: {
        info: {
          webId: 'https://example.com/profile/',
          isLoggedIn: false
        }
      }
    };
    useNotification.mockReturnValue({ addNotification: vi.fn() });

    const user = userEvent.setup();
    const { getByRole, getAllByRole, getByLabelText } = render(
      <MockSignupContexts session={session} />
    );
    global.fetch = vi.fn(() => Promise.resolve({ json: vi.fn() }));
    const email = 'emailExists@example.com';
    const password = 'password';
    const confirmPassword = 'password';
    const emailField = getByRole('textbox', { name: 'Email' });
    const passwordField = getByLabelText('Password');
    const confirmPasswordField = getByLabelText('Confirm Password');

    await user.type(emailField, email);
    await user.type(passwordField, password);
    await user.type(confirmPasswordField, confirmPassword);
    await user.click(getAllByRole('button')[2]);
    expect(registerPod(emailField.value)).rejects.toThrow();
  });
  it('shows pod creation message when logged in', () => {
    const session = {
      podUrl: 'https://example.com',
      session: {
        info: {
          webId: 'https://example.com/profile/',
          isLoggedIn: true
        }
      }
    };
    const { getByRole } = render(<MockSignupContexts session={session} />);
    expect(getByRole('heading')).not.toBeNull();
  });
});
