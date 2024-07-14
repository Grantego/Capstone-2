import React from 'react';
import { fireEvent, render, screen, cleanup } from '@testing-library/react';
import NavBar from '../NavBar';
import { RouterProvider, createMemoryRouter,} from 'react-router-dom';
import { describe, it, beforeEach, expect, afterEach } from 'vitest';


describe("AutoFillBar component", () => {
    let router
    
    beforeEach(() => {
        localStorage.clear()
        router = createMemoryRouter([
            {
                path: '/',
                element: <NavBar/>,
            },
        ], {
            initialEntries: ['/'],
        });

    })

    afterEach(() => {
        cleanup()
    })

    it("renders without crashing", () => {
        render(<RouterProvider router={router} />);
    })

    it("matches snapshot", function() {
        const {asFragment} = render(<RouterProvider router={router} />)
        expect(asFragment()).toMatchSnapshot();
      })

    it("doesn't display links when collapsed (logged out)", () => {
        render(<RouterProvider router={router} />);
        expect(screen.queryByLabelText("Login")).toBe(null);
    })
    
    it("shows nav links on collapse click when logged out", () => {
        render(<RouterProvider router={router} />);
        fireEvent.click(screen.getByLabelText("Toggle navigation"))
        expect(screen.getByText('Login')).toBeInTheDocument()
        expect(screen.getByText('Sign Up')).toBeInTheDocument()

        fireEvent.click(screen.getByLabelText("Toggle navigation"))
        expect(screen.queryByLabelText("Login")).toBe(null);
        expect(screen.queryByLabelText("Sign Up")).toBe(null);
    })

    it("doesn't display links when collapsed (logged in)", () => {
        localStorage.setItem("username", "testuser")
        localStorage.setItem("token", "testtoken")
        render(<RouterProvider router={router} />);
        expect(screen.queryByLabelText("Songs")).toBe(null);
    })

    it("shows nav links on collapse click when logged in", () => {
        localStorage.setItem("username", "testuser")
        localStorage.setItem("token", "testtoken")
        render(<RouterProvider router={router} />);
        fireEvent.click(screen.getByLabelText("Toggle navigation"))
        expect(screen.getByText('Songs')).toBeInTheDocument()
        expect(screen.getByText('Chords')).toBeInTheDocument()
        expect(screen.getByText('Logout')).toBeInTheDocument()

        fireEvent.click(screen.getByLabelText("Toggle navigation"))
        expect(screen.queryByLabelText("Songs")).toBe(null);
        expect(screen.queryByLabelText("Chords")).toBe(null);
        expect(screen.queryByLabelText("Logout")).toBe(null);
    })
})