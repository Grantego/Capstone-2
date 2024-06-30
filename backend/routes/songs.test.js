"use strict";

const request = require("supertest");

const app = require("../app");


const {
  commonBeforeAll,
  commonBeforeEach,
  commonAfterEach,
  commonAfterAll,
  testSongIds,
  u1Token,
  adminToken,
} = require("./_testCommon");

beforeAll(commonBeforeAll);
beforeEach(commonBeforeEach);
afterEach(commonAfterEach);
afterAll(commonAfterAll);

/************************************** POST /songs/:username */

describe("POST /songs/:username", () => {
    test("works for admin", async () => {
        const res = await request(app)
            .post('/songs/testuser')
            .send({
                title: "New Song",
                chords: ["C","F","C","G"]
            })
            .set("authorization", `Bearer ${adminToken}`);
        expect(res.statusCode).toEqual(200);
        expect(res.body).toEqual({
            song: {
                id: expect.any(Number),
                title: "New Song",
                username: "testuser",
                chords: ["C","F","C","G"]
            }
        })
    })
    
    test("works for correct user", async() => {
        const res = await request(app)
            .post('/songs/testuser')
            .send({
                title: "New Song",
                chords: ["C","F","C","G"]
            })
            .set("authorization", `Bearer ${u1Token}`);
        expect(res.statusCode).toEqual(200);
        expect(res.body).toEqual({
            song: {
                id: expect.any(Number),
                title: "New Song",
                username: "testuser",
                chords: ["C","F","C","G"]
            }
        })
    })

    test("unauth for wrong user", async() => {
        const res = await request(app)
            .post('/songs/admin')
            .send({
                title: "New Song",
                chords: ["C","F","C","G"]
            })
            .set("authorization", `Bearer ${u1Token}`);
        expect(res.statusCode).toEqual(401);
    })

    test("unauth for anon", async() => {
        const res = await request(app)
            .post('/songs/admin')
            .send({
                title: "New Song",
                chords: ["C","F","C","G"]
            })
            .set("authorization", `Bearer ${u1Token}`);
        expect(res.statusCode).toEqual(401);
    })
})

/************************************** GET /songs */

describe("GET /songs", () => {
    test("words for user", async () => {
        const res = await request(app).get('/songs')
            .set("authorization", `Bearer ${u1Token}`);
        expect(res.body).toEqual({
            songs: [
                {
                    id: expect.any(Number),
                    title: "Test Song",
                    username: "testadmin"
                },
                {
                    id: expect.any(Number),
                    title: "Test Song 2",
                    username: "testuser"
                },
            ]
        })
    })

    test("works with username filter", async () => {
        const res = await request(app)
            .get('/songs')
            .query({username: "testuser"})
            .set("authorization", `Bearer ${u1Token}`);
        expect(res.body).toEqual({
            songs: [
                {
                    id: testSongIds[1],
                    title: "Test Song 2",
                    username: "testuser"
                }
            ]
        })
    })

    test("bad request on invalid filter key", async () => {
        const res = await request(app)
            .get('/songs')
            .query({wrong: "testuser"})   
            .set("authorization", `Bearer ${u1Token}`);
        expect(res.statusCode).toEqual(400)    
    })

    test("unauth for anon", async () => {
        const res = await request(app).get('/songs')
        expect(res.statusCode).toEqual(401)
    })
})

/************************************** GET /songs/:id */

describe("GET /songs/:id", () => {
    test("works for user", async() => {
        const res = await request(app).get(`/songs/${testSongIds[1]}`)
        .set("authorization", `Bearer ${u1Token}`);
        expect(res.body).toEqual({
            song: {
                id: testSongIds[1],
                title: "Test Song 2",
                username: "testuser",
                chords: ["G", "F", "C"]
            }
        })
    });

    test("returns not found if no such song", async () => {
        const res = await request(app).get(`/songs/0`)
            .set("authorization", `Bearer ${u1Token}`);
        expect(res.statusCode).toEqual(404)
    })

    test
    
})


/************************************** DELETE /songs/:id */
describe("DELETE /songs/:id", () => {
    test("works for admin", async() => {
        const res = await request(app)
            .delete(`/songs/${testSongIds[1]}`)
            .set("authorization", `Bearer ${adminToken}`);
            
        expect(res.body).toEqual({deleted : testSongIds[1]})
    })

    test("works for others", async() => {
        const res = await request(app)
            .delete(`/songs/${testSongIds[0]}`)
            .set("authorization", `Bearer ${u1Token}`);
        
        expect(res.body).toEqual({deleted : testSongIds[0]})
    })

    test("unauth for anon", async() => {
        const res = await request(app)
            .delete(`/songs/${testSongIds[0]}`)

        expect(res.statusCode).toEqual(401)
    })

    test("returns not found if no such song", async () => {
        const res = await request(app).delete(`/songs/0`)
            .set("authorization", `Bearer ${adminToken}`);
        expect(res.statusCode).toEqual(404)
    })    
})