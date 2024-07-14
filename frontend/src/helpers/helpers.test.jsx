import { filterSearch } from "./helpers";
import { describe, it, beforeEach, expect, afterEach } from 'vitest';

describe('filterSearch', () => { 
    const arr = ['C', 'E', 'Cmaj', 'A']
    it("works ignoring case", () => {
        expect(filterSearch("A", arr)).toEqual(['Cmaj', 'A'])
        expect(filterSearch("C", arr)).toEqual(['C', 'Cmaj'])
        expect(filterSearch("e", arr)).toEqual(['E'])
    })
 })

