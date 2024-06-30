import React from 'react';
import { render, screen } from '@testing-library/react';
import Root from './Root';
import { describe, it, beforeEach, expect } from 'vitest';

// Testing of the front end is currently not working. Needs debugging.

describe('Root component', () => {
  beforeEach(() => {
    // Clear all instances and calls to constructor and all methods:
    localStorage.clear();
  });

  it('displays "Chord Assistant" when user is not logged in', () => {
    render(<Root />);
    expect(screen.getByText(/chord assistant/i)).toBeInTheDocument();
  });

  it('displays "Welcome back, [username]" when user is logged in', () => {
    const username = 'testuser';
    localStorage.setItem('token', 'sampletoken');
    localStorage.setItem('username', username);
    
    render(<Root />);
    expect(screen.getByText(`Welcome back, ${username}`)).toBeInTheDocument();
  });
});