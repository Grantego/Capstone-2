import React from 'react';
import { fireEvent, render, screen, cleanup } from '@testing-library/react';
import AutoFillBar from '../AutoFillBar';
import { RouterProvider, createMemoryRouter, Routes, Route } from 'react-router-dom';
import { describe, it, beforeEach, expect, afterEach } from 'vitest';


describe("AutoFillBar component", () => {
    const chords = ["E","Emaj7", "D", "F"]
    let router
    
    beforeEach(() => {
        router = createMemoryRouter([
            {
                path: '/',
                element: <AutoFillBar chords={chords}/>,
            },
            {
                path: '/chords/:chord',
                element: <div>Chord Page</div>,
            }
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

    it("displays no chords if input is empty", () => {
        render(<RouterProvider router={router} />);
        expect(screen.queryByLabelText("Emaj7")).toBe(null);
    })

    it("filters out invalid chords, shows valid chords", () => {
        render(<RouterProvider router={router} />);
        fireEvent.change(screen.getByLabelText("chord-input"), {target: {value: 'e'}})
        expect(screen.getByText("E")).toBeInTheDocument()
        expect(screen.getByText("Emaj7")).toBeInTheDocument()
        expect(screen.queryByText("D")).toBe(null)
        expect(screen.queryByText("F")).toBe(null)
    })

    it("clicking search button goes to chords page", () => {
        render(<RouterProvider router={router} />);
        fireEvent.change(screen.getByLabelText("chord-input"), {target: {value: 'e'}})
        fireEvent.click(screen.getByText("E"));

        expect(screen.getByText("Chord Page")).toBeInTheDocument();
    })
})