import React from 'react';
import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import SongDetail from '../SongDetail';
import { createMemoryRouter, RouterProvider } from 'react-router-dom';
import { describe, it, beforeEach, expect, vi } from 'vitest';
import SpellerApi from '../../../api';


vi.mock('../../../api',  () => {
    const mockChord = {name: "C", spelling: "C, E, G", chordChart: "testchart"}
    const mockSong = {
        id: 1,
        title: "Test Song",
        username: "testuser",
        chords: ['C','C','C','C']
    }
    return {
        default: vi.fn().mockImplementation(() => {
            return {
                getChord: vi.fn().mockResolvedValue({chord: mockChord}),
                getSongDetails: vi.fn().mockResolvedValue({song: mockSong})
            }
        })         
    }
});

describe('SongDetail component', () => {
    let router

  beforeEach(() => {
    localStorage.clear();
    
    const mockLoader = async () => {
        const apiInstance = new SpellerApi();
        const res = await apiInstance.getSongDetails();
        res.song.chords = await Promise.all(res.song.chords.map(async c => {
            const {chord} = await apiInstance.getChord(c)
            return chord
        }))
        return res
    }

    router = createMemoryRouter([
        {
            path: '/',
            element: <SongDetail/>,
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
        expect(screen.getByText("Test Song")).toBeInTheDocument()
        expect(screen.getByText("By testuser")).toBeInTheDocument()
        expect(screen.getByText("Delete")).toBeInTheDocument()
        const elements = screen.queryAllByText("C")
        expect(elements).toHaveLength(4);
    })

  })

});