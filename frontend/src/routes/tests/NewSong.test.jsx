import React from 'react';
import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import NewSong from '../NewSong';
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

describe('NewSong component', () => {
    let router

  beforeEach(() => {
    localStorage.clear();
    
    const mockLoader = async () => {
        const apiInstance = new SpellerApi();
        const res = await apiInstance.getAllChords();
        return {chords: res.chords};
    }

    router = createMemoryRouter([
        {
            path: '/',
            element: <NewSong/>,
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

  it("renders all elements correctly", async () => {
    localStorage.setItem('username', 'testuser')
    localStorage.setItem('token', 'sampletoken')

    render(<RouterProvider router={router} />);

    await waitFor(() => {
        // Header elements
        expect(screen.getByPlaceholderText("Title")).toBeInTheDocument()
        expect(screen.getByPlaceholderText("chord name ex: C, Cm, Cmaj7")).toBeInTheDocument()
    })

  })

  it("correctly adds chords to the screen", async () => {
    localStorage.setItem('username', 'testuser')
    localStorage.setItem('token', 'sampletoken')

    render(<RouterProvider router={router} />);

    await waitFor(() => {
        // Header elements
        fireEvent.click(screen.getByPlaceholderText('Title'), {target: {value: 'New Song'}})

        fireEvent.click(screen.getByPlaceholderText('chord name ex: C, Cm, Cmaj7'), {target: {value: 'C'}})
        fireEvent.click(screen.getByText("add chord"))

        fireEvent.click(screen.getByPlaceholderText('chord name ex: C, Cm, Cmaj7'), {target: {value: 'F'}})
        fireEvent.click(screen.getByText("add chord"))

        expect(screen.getByText('C')).toBeInTheDocument()
        expect(screen.getByText('F')).toBeInTheDocument()
    })

  })
});