"use strict";

const db = require("../db.js");
const { BadRequestError, NotFoundError } = require("../expressError");
const Chord = require("./chord.js");
const {
  commonBeforeAll,
  commonBeforeEach,
  commonAfterEach,
  commonAfterAll,
  testSongIds,
} = require("./_testCommon");

beforeAll(commonBeforeAll);
beforeEach(commonBeforeEach);
afterEach(commonAfterEach);
afterAll(commonAfterAll);


/************************************** create */

describe("create", () => {
    const newChord = {
        name: "D",
        spelling: "D,F#,A",
        chordChart: "test.com"
    }

    test("works", async () => {
        let chord = await Chord.create(newChord)
        expect(chord).toEqual(newChord)

        const res = await db.query(
            `SELECT name, spelling, chord_chart AS "chordChart"
             FROM chords
             WHERE name='D'`
        )

        expect(res.rows).toEqual([
            {
                name: "D",
                spelling: "D,F#,A",
                chordChart: "test.com"
            }
        ])
    })

    test("bad request error with duplicate", async () => {
        try {
            await Chord.create(newChord);
            await Chord.create(newChord);
            fail()
        } catch(e) {
            expect(e instanceof BadRequestError).toBeTruthy();
        }
    })
})

/************************************** getAll */

describe("getAll", () => {
    test("works", async () => {
        let chords = await Chord.getAll();
        expect(chords).toEqual([
            {
                name: "C",
                spelling: "C,E,G",
                chordChart: "test.com"
            },
            {
                name: "F",
                spelling: "F,A,C",
                chordChart: "test2.com"
            },
            {
                name: "G",
                spelling: "G,B,D",
                chordChart: "test3.com"
            },
        ])
    })
})

/************************************** get */

describe("get", () => {
    test("works", async () => {
        let chord = await Chord.get("C")
        expect(chord).toEqual({
            name: "C",
            spelling: "C,E,G",
            chordChart: "test.com"
        })
    })

    test("not found if no such chord", async () => {
        try {
            await Chord.get("bad input")
            fail()
        } catch(e) {
            expect(e instanceof NotFoundError).toBeTruthy();
        }
    })
})

/************************************** update */

describe("update", () => {
    const updateData = {
        spelling: "C,Eb,G",
        chordChart: "testurl.com"
    };

    test("works", async () => {
        let chord = await Chord.update("C", updateData);
        expect(chord).toEqual({
            name: "C",
            ...updateData
        })

        const res = await db.query(`
            SELECT name, spelling, chord_chart as "chordChart"
            FROM chords
            WHERE name= 'C'`)
        
        expect(res.rows[0]).toEqual({
            name: "C",
            spelling: "C,Eb,G",
            chordChart: "testurl.com"
        })
    })

    test("not found if no such chord", async () => {
        try {
            await Chord.update("nope", updateData)
            fail()
        } catch(e) {
            expect (e instanceof NotFoundError).toBeTruthy()
        }
    })

    test("bad request with no data", async() => {
        try {
            let blankData = {}
            await Chord.update("C", blankData)
            fail()
        } catch(e) {
            expect (e instanceof BadRequestError).toBeTruthy()
        }
    })
})

/************************************** remove */

describe("remove", function() {
    test("works", async () => {
        await Chord.remove("C")
        const res = await db.query(
            "SELECT name FROM chords WHERE name = 'C'"
        );
        expect(res.rows.length).toEqual(0)
    })

    
    test("not found if no such chord", async () => {
        try {
            await Chord.remove("nope")
            fail()
        } catch(e) {
            expect (e instanceof NotFoundError).toBeTruthy()
        }
    })
})