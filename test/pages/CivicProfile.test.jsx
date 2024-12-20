import React from 'react';
import { BrowserRouter } from 'react-router-dom';
import { render } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { CivicProfile } from '@pages';
import { CIVIC_FORM_LIST } from '@components/CivicProfileForms';
import createMatchMedia from '../helpers/createMatchMedia';

// TODO: Rewrite tests to align with changes in CivicProfile component
// e.g. "successfully navigates to Basic Information"
describe.todo('CivicProfile Page', () => {
  it('renders page container flex direction as row and nav container width as 25% by default', () => {
    const component = render(
      <BrowserRouter>
        <CivicProfile />
      </BrowserRouter>
    );
    const componentContainer = component.container.firstChild;
    const navContainer = componentContainer.firstChild;
    const componentContainerStyles = getComputedStyle(componentContainer);
    const navContainerStyles = getComputedStyle(navContainer);
    expect(componentContainerStyles.flexDirection).toBe('row');
    expect(navContainerStyles.width).toBe('25%');
  });

  it('renders page container flex direction as column and nav container width as 100% below 600px', () => {
    window.matchMedia = createMatchMedia(599);
    const component = render(
      <BrowserRouter>
        <CivicProfile />
      </BrowserRouter>
    );
    const componentContainer = component.container.firstChild;
    const navContainer = componentContainer.firstChild;
    const componentContainerStyles = getComputedStyle(componentContainer);
    const navContainerStyles = getComputedStyle(navContainer);
    expect(componentContainerStyles.flexDirection).toBe('column');
    expect(navContainerStyles.width).toBe('100%');
  });

  it('renders buttons for all forms in CIVIC_FORM_LIST', () => {
    const numLinks = CIVIC_FORM_LIST.length;
    const { getByRole, getAllByRole } = render(
      <BrowserRouter>
        <CivicProfile />
      </BrowserRouter>
    );
    expect(getByRole('navigation')).not.toBeNull();
    expect(getAllByRole('tab').length).toEqual(numLinks);
  });
});
