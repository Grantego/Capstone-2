import React from 'react';
import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import SongMain, {loader} from '../SongMain';
import { createMemoryRouter, RouterProvider } from 'react-router-dom';
import { describe, it, beforeEach, expect, vi } from 'vitest';
import SpellerApi from '../../../api';

vi.mock('../../../api',  () => {
    return {
        default: vi.fn().mockImplementation(() => {
            return {
                getUserSongs: vi.fn().mockResolvedValue({songs: [
                    {
                        id: 1,
                        title: "Test Song"
                    },
                    {
                        id: 2,
                        title: "Test Song 2"
                    },
                ]})                
            }
        })         
    }
});

describe('SongMain component', () => {
    let router

  beforeEach(() => {
    localStorage.clear();
    
    const mockLoader = async () => {
        const apiInstance = new SpellerApi();
        const res = await apiInstance.getUserSongs();
        console.log(res)
        return {songs: res.songs};
    }

    router = createMemoryRouter([
        {
            path: '/',
            element: <SongMain/>,
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
        expect(screen.getByText("My Songs")).toBeInTheDocument()
        expect(screen.getByText("New")).toBeInTheDocument()
        // Song List Elements
        expect(screen.getByText("Test Song")).toBeInTheDocument()
        expect(screen.getByText("Test Song 2")).toBeInTheDocument()
        
    })

  })
});