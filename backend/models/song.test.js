"use strict";

const db = require("../db.js");
const { NotFoundError } = require("../expressError");
const Song = require("./song.js");
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


/******************************** addSong */

describe("addSong", () => {
    test("works", async () => {
        const newSong = {
            title: "Good Song",
            chords: ["C","F","C","G"]
        }
       const song = await Song.addSong(newSong, 'testadmin')
       expect(song).toEqual({id: expect.any(Number),
                            title: "Good Song",
                            username: "testadmin",
                            chords: ["C","F","C","G"]
       })
       
       const res = await db.query(`
            SELECT id
            FROM songs
            WHERE id = $1`, [song.id])
        expect(res.rows[0]).toBeTruthy()

    })

    test("returns not found if chord not found in database", async () => {
        const badSong = {
            title: "Bad Song",
            chords: ["C","E","Q"]
        }
        try {
            await Song.addSong(badSong, 'testuser')
            fail()
        } catch(e) {
            expect(e instanceof NotFoundError).toBeTruthy
        }

    })

    test("returns not found if user not found in database,", async () => {
        const newSong = {
            title: "Good Song",
            chords: ["C","F","C","G"]
        }
        try {
            await Song.addSong(newSong, "invaliduser")
            fail()
        } catch(e) {
            expect(e instanceof NotFoundError).toBeTruthy()
        }
    })
})


/******************************** getAll */

describe("getAll(username)", () => {
    test("works without filters", async () => {
        const res = await Song.getAll()
        expect(res.length).toEqual(2)
        expect(res).toEqual([{
            id: testSongIds[0],
            title: "test song",
            username: "testuser"
        },
        {
            id: testSongIds[1],
            title: "test song2",
            username: "testadmin"
        }])
    })

    test("works with filters", async() => {
        const res = await Song.getAll("testuser")
        expect(res.length).toEqual(1)
        expect(res).toEqual([{
            id: testSongIds[0],
            title: "test song",
            username: "testuser"
        }])
    })

    test("throws not found if username invalid", async () => {
        try {
            await Song.getAll("invaliduser")
            fail()
        } catch(e) {
            expect(e instanceof NotFoundError).toBeTruthy()
        }
    })
})

/******************************** get */

describe("get", () => {
    test("works", async () => {
        const res = await Song.get(testSongIds[1])
        expect(res).toEqual({
            id: testSongIds[1],
            title: "test song2",
            username: "testadmin",
            chords: ["C", "C", "F", "G"]
        })
    })

    test("throws error if song not found", async() => {
        try{
            await Song.get("invalid")
            fail()    
        } catch(e) {
            expect(e instanceof NotFoundError).toBeTruthy
        }
    })
})


/******************************** remove */

describe("remove", () => {
    test("works", async () => {
        const res = await Song.remove(testSongIds[1])
        expect(res).toEqual(undefined)
        const songs = await Song.getAll()
        expect(songs.length).toEqual(1)
        // testing that remove also deletes the song chords from song_chords table.
        const res2 = await db.query(`SELECT * FROM song_chords WHERE song_id = $1`, [testSongIds[1]])
        expect(res2.rows[0]).toBeFalsy()
    })

    test("returns not found if song not found", async() => {
        try {
            await Song.remove(50000)
            fail()
        } catch(e) {
            console.log(e)
            expect(e instanceof NotFoundError).toBeTruthy()
        }
    })
})