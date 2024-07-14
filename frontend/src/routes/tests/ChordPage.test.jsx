import React from 'react';
import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import ChordPage, {loader} from '../ChordPage';
import { createMemoryRouter, RouterProvider } from 'react-router-dom';
import { describe, it, beforeEach, expect, vi } from 'vitest';
import SpellerApi from '../../../api';


vi.mock('../../../api',  () => {
    const mockChords = [
        {name: "C"},
        {name: "Cmaj7"},
        {name: "E"},
        {name: "F"},
    ];
    return {
        default: vi.fn().mockImplementation(() => {
            return {
                getAllChords: vi.fn().mockResolvedValue({chords: mockChords})                
            }
        })         
    }
});


describe('ChordPage component', () => {
    let router

  beforeEach(() => {
    localStorage.clear();
    
    const mockLoader = async () => {
        const apiInstance = new SpellerApi();
        const res = await apiInstance.getAllChords();
        console.log(res)
        return {chords: res.chords};
    }

    router = createMemoryRouter([
        {
            path: '/',
            element: <ChordPage/>,
            loader: mockLoader
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

  it("renders the autofill with the chords from database", async () => {
    console.log("running")

    localStorage.setItem('token', 'sampletoken')

    render(<RouterProvider router={router} />);

    await waitFor(() => {
        fireEvent.change(screen.getByLabelText("chord-input"), {target: {value: 'c'}})
        expect(screen.getByText("C")).toBeInTheDocument()
        expect(screen.getByText("Cmaj7")).toBeInTheDocument()
    })

  })
});