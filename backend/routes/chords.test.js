"use strict";

const request = require("supertest");

const app = require("../app");

const {
  commonBeforeAll,
  commonBeforeEach,
  commonAfterEach,
  commonAfterAll,
  u1Token,
  adminToken,
} = require("./_testCommon");

beforeAll(commonBeforeAll);
beforeEach(commonBeforeEach);
afterEach(commonAfterEach);
afterAll(commonAfterAll);

/************************************** POST /chords */

describe("POST /chords", () => {
    const newChord = {
        name: "E",
        spelling: "E,G#,B",
        chordChart: "test.url"
    }

    test("ok for admin", async () => {
        const res = await request(app)
            .post("/chords")
            .send(newChord)
            .set("authorization", `Bearer ${adminToken}`)
        expect(res.statusCode).toEqual(201)
        expect(res.body).toEqual({
            chord: newChord
        });
    });

    test("unauth for non-admin", async () => {
        const res = await request(app)
            .post("/chords")
            .send(newChord)
            .set("authorization", `Bearer ${u1Token}`)
            expect(res.statusCode).toEqual(401)
    })

    test("bad request with missing data", async () => {
        const res = await request(app)
            .post("/chords")
            .send({
                name: "A",
                spelling: "A,C#,E"
            })
            .set("authorization", `Bearer ${adminToken}`);
        expect(res.statusCode).toEqual(400)
    })

    test("bad request with invalid data", async () => {
        const res = await request(app)
            .post("/chords")
            .send({
                name: 2,
                spelling: "A,C#,E",
                chordChart: "test.url"
            })
            .set("authorization", `Bearer ${adminToken}`);
        expect(res.statusCode).toEqual(400)
    })
})

/************************************** GET /chords */

describe("GET /chords", () => {
    test("works for user", async () => {
        const res = await request(app).get("/chords").set("authorization", `Bearer ${u1Token}`);
        expect(res.body).toEqual({
            chords: [
                {
                    name: "C",
                    spelling: "C,E,G",
                    chordChart: "testurl"
                },
                {
                    name: "F",
                    spelling: "F,A,C",
                    chordChart: "testurl"
                },
                {
                    name: "G",
                    spelling: "G,B,D",
                    chordChart: "testurl"
                }
            ]
        })
    })
    test("unauth for anon", async() => {
        const res = await request(app).get("/chords")
        expect(res.statusCode).toEqual(401)
    })
})
/************************************** GET /chords/:name */
describe("GET /chords/:name", () => {
    test("works for user", async () => {
        const res = await request(app).get('/chords/C').set("authorization", `Bearer ${u1Token}`);
        expect(res.statusCode).toEqual(200)
        expect(res.body).toEqual({
            chord: {
                name: "C",
                spelling: "C,E,G",
                chordChart: "testurl"
            }
        })
    })

    test("returns not found if invalid name", async () => {
        const res = await request(app).get("/chords/Z").set("authorization", `Bearer ${u1Token}`);
        expect(res.statusCode).toEqual(404)
    })
    test("unauth for anon", async() => {
        const res = await request(app).get("/chords/C")
        expect(res.status).toEqual(401)
    })
})

/************************************** PATCH /chords/:name */

describe("PATCH /chords/:name", () => {
    test("works for admin", async () => {
        const res = await request(app)
            .patch('/chords/C')
            .send({
                spelling: "C,E,E,G",
                chordChart: "test.url"
            })
            .set("authorization", `Bearer ${adminToken}`);
        expect(res.body).toEqual({
            chord: {
                name: "C",
                spelling: "C,E,E,G",
                chordChart: "test.url" 
            }
        })
    })

    test("unauth for non-admin", async () => {
        const res = await request(app)
            .patch('/chords/C')
            .send({
                spelling: "C,E,E,G",
                chordChart: "test.url"
            })
            .set("authorization", `Bearer ${u1Token}`);
        
        expect(res.statusCode).toEqual(401)
    })

    test("unauth for anon", async () => {
        const res = await request(app)
            .patch('/chords/C')
            .send({
                spelling: "C,E,E,G",
                chordChart: "test.url"
            })
        expect(res.statusCode).toEqual(401)        
    })

    test("returns not found if invalid name", async () => {
        const res = await request(app)
            .patch('/chords/Z')
            .send({
                spelling: "C,E,E,G",
                chordChart: "test.url"
            })
            .set("authorization", `Bearer ${adminToken}`);
        expect(res.statusCode).toEqual(404) 
    })

    test("bad request on name change attempt", async () => {
        const res = await request(app)
            .patch('/chords/C')
            .send({
                name: "C,E,E,G",
                chordChart: "test.url"
            })
            .set("authorization", `Bearer ${adminToken}`);
        expect(res.statusCode).toEqual(400) 
    })

    test("bad request on invalid data", async () => {
        const res = await request(app)
            .patch('/chords/C')
            .send({
                spelling: "C,E,E,G",
                chordChart: 1
            })
            .set("authorization", `Bearer ${adminToken}`);
        expect(res.statusCode).toEqual(400) 
    })
})

/************************************** DELETE /chords/:name */

describe("DELETE /chords/:name", () => {
    test("works for admin", async () => {
        const res = await request(app)
            .delete('/chords/C')
            .set("authorization", `Bearer ${adminToken}`);
            
        expect(res.body).toEqual({ deleted: "C" });
    })

    test("unauth for non-admin", async () => {
        const res = await request(app)
            .delete('/chords/C')
            .set("authorization", `Bearer ${u1Token}`);
        
        expect(res.statusCode).toEqual(401)
    })

    test("unauth for anon", async () => {
        const res = await request(app)
            .delete('/chords/C')

        expect(res.statusCode).toEqual(401)        
    })

    test("returns not found if invalid name", async () => {
        const res = await request(app)
            .delete('/chords/Z')
            .set("authorization", `Bearer ${adminToken}`);
        expect(res.statusCode).toEqual(404) 
    })
})