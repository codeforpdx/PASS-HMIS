import React from 'react';
import { render, screen } from '@testing-library/react';
import { BrowserRouter as Router } from 'react-router-dom';
import { expect, it, describe } from 'vitest';
import { PodRegistrationForm } from '@components/Signup';

describe('PodRegistrationForm', () => {
  it('renders', () => {
    render(
      <Router>
        <PodRegistrationForm />
      </Router>
    );

    const textField = screen.getByRole('textbox', { name: 'Email' });
    const inputElementPassword = screen.getByLabelText('Password');
    const inputElementConfirmPassword = screen.getByLabelText('Confirm Password');

    expect(textField).not.toBeNull();
    expect(inputElementPassword).not.toBeNull();
    expect(inputElementConfirmPassword).not.toBeNull();
  });
});
