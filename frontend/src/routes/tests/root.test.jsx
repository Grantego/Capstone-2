import React from 'react';
import { render, screen } from '@testing-library/react';
import Root from '../root';
import { BrowserRouter } from 'react-router-dom';
import { describe, it, beforeEach, expect } from 'vitest';

describe('Root component', () => {
  beforeEach(() => {
    // Clear all instances and calls to constructor and all methods:
    localStorage.clear();
  });

  it("matches snapshot", function() {
    const {asFragment} = render(<BrowserRouter><Root/></BrowserRouter>)
    expect(asFragment()).toMatchSnapshot();
  })

  it("renders without crashing", () => {
    render(<BrowserRouter><Root/></BrowserRouter>)
  })

  it('displays "Chord Assistant" when user is not logged in', () => {
    render(<BrowserRouter><Root/></BrowserRouter>);
    expect(screen.getByText(/chord assistant/i)).toBeInTheDocument();
  });

  it('displays navbar', () => {
    render(<BrowserRouter><Root/></BrowserRouter>)
    expect(screen.getByText("Chord Helper")).toBeInTheDocument()
  })

  it('displays "Welcome back, [username]" when user is logged in', () => {
    const username = 'testuser';
    localStorage.setItem('token', 'sampletoken');
    localStorage.setItem('username', username);
    
    render(<BrowserRouter><Root /></BrowserRouter>);
    expect(screen.getByText(`Welcome back, ${username}`)).toBeInTheDocument();
  });
});