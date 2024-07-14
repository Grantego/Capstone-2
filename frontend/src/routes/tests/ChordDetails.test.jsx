import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import ChordDetails, {loader} from '../ChordDetails';
import { createMemoryRouter, RouterProvider } from 'react-router-dom';
import { describe, it, beforeEach, expect, vi } from 'vitest';
import SpellerApi from '../../../api';

vi.mock('../../../api',  () => {
    return {
        default: vi.fn().mockImplementation(() => {
            return {
                getChord: vi.fn().mockResolvedValue({chord: {name: "C", spelling: "C, E, G", chordChart: "testchart"}})                
            }
        })         
    }
});

describe('ChordDetails component', () => {
    let router

  beforeEach(() => {
    localStorage.clear();
    
    const mockLoader = async () => {
        const apiInstance = new SpellerApi();
        const res = await apiInstance.getChord();
        console.log(res)
        return {chord: res.chord};
    }

    router = createMemoryRouter([
        {
            path: '/',
            element: <ChordDetails/>,
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

    localStorage.setItem('token', 'sampletoken')

    render(<RouterProvider router={router} />);

    await waitFor(() => {
        expect(screen.getByAltText("C Chord Chart")).toBeInTheDocument()
        expect(screen.getByText("Spelling: C, E, G")).toBeInTheDocument()
        expect(screen.getByText("C")).toBeInTheDocument()
        
    })

  })
});