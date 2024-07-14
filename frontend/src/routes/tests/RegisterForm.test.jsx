import React from 'react';
import { render, screen } from '@testing-library/react';
import RegisterForm from '../RegisterForm'
import { createMemoryRouter, RouterProvider } from 'react-router-dom';
import { describe, it, beforeEach, expect} from 'vitest';


describe('RegisterForm component', () => {
    let router

  beforeEach(() => {
    localStorage.clear();

    router = createMemoryRouter([
        {
            path: '/',
            element: <RegisterForm/>,
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
    expect(screen.getByPlaceholderText("choose username")).toBeInTheDocument()    
    expect(screen.getByPlaceholderText("enter password")).toBeInTheDocument()    
    expect(screen.getByPlaceholderText("enter email")).toBeInTheDocument()    
    expect(screen.getByLabelText("Username:")).toBeInTheDocument()    
    expect(screen.getByLabelText("Password:")).toBeInTheDocument() 
    expect(screen.getByLabelText("Email:")).toBeInTheDocument()
    expect(screen.getAllByText("Register")).toBeInTheDocument
  })

});