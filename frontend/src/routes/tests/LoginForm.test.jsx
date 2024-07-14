import React from 'react';
import { render, screen } from '@testing-library/react';
import LoginForm from '../LoginForm'
import { createMemoryRouter, RouterProvider } from 'react-router-dom';
import { describe, it, beforeEach, expect} from 'vitest';


describe('LoginForm component', () => {
    let router

  beforeEach(() => {
    localStorage.clear();

    router = createMemoryRouter([
        {
            path: '/',
            element: <LoginForm/>,
        },
    ], {
        initialEntries: ['/'],
    }); 


  });

  it("matches snapshot", () => {
    const {asFragment} = render(<RouterProvider router={router} />)
    expect(asFragment()).toMatchSnapshot();
  })

  it("renders without crashing", () => {
    render(<RouterProvider router={router} />)
  })

  it("renders correct elements", () => {
    render(<RouterProvider router={router} />)
    expect(screen.getByPlaceholderText("enter username")).toBeInTheDocument()    
    expect(screen.getByPlaceholderText("enter password")).toBeInTheDocument()    
    expect(screen.getByLabelText("Username:")).toBeInTheDocument()    
    expect(screen.getByLabelText("Password:")).toBeInTheDocument()    
    expect(screen.getAllByText("Login")).toBeInTheDocument
  })

});