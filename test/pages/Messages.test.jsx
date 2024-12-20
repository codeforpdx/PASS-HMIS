import React from 'react';
import { cleanup, render } from '@testing-library/react';
import { afterEach, describe, it } from 'vitest';
import { Messages } from '@pages';

// Clear created DOM after each test
afterEach(() => {
  cleanup();
});

describe('Messages', () => {
  it('renders', () => {
    render(<Messages />);
  });
});
