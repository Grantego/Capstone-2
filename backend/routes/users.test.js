"use strict";

const request = require("supertest");

const db = require("../db.js");
const app = require("../app");
const User = require("../models/user");

const {
  commonBeforeAll,
  commonBeforeEach,
  commonAfterEach,
  commonAfterAll,
  u1Token,
  adminToken,
  testSongIds,
} = require("./_testCommon");

beforeAll(commonBeforeAll);
beforeEach(commonBeforeEach);
afterEach(commonAfterEach);
afterAll(commonAfterAll);

/************************************** POST /users */

describe("POST /users", function () {
  test("works for admins: create non-admin", async function () {
    const res = await request(app)
        .post("/users")
        .send({
          username: "u-new",
          password: "password-new",
          email: "new@email.com",
          isAdmin: false,
        })
        .set("authorization", `Bearer ${adminToken}`);
    expect(res.statusCode).toEqual(201);
    expect(res.body).toEqual({
      user: {
        username: "u-new",
        email: "new@email.com",
        isAdmin: false,
      }, token: expect.any(String),
    });
  });

  test("works for admins: create admin", async function () {
    const res = await request(app)
        .post("/users")
        .send({
          username: "u-new",
          password: "password-new",
          email: "new@email.com",
          isAdmin: true,
        })
        .set("authorization", `Bearer ${adminToken}`);
    expect(res.statusCode).toEqual(201);
    expect(res.body).toEqual({
      user: {
        username: "u-new",
        email: "new@email.com",
        isAdmin: true,
      }, token: expect.any(String),
    });
  });

  test("unauth for users", async function () {
    const res = await request(app)
        .post("/users")
        .send({
          username: "u-new",
          password: "password-new",
          email: "new@email.com",
          isAdmin: true,
        })
        .set("authorization", `Bearer ${u1Token}`);
    expect(res.statusCode).toEqual(401);
  });

  test("unauth for anon", async function () {
    const res = await request(app)
        .post("/users")
        .send({
          username: "u-new",
          password: "password-new",
          email: "new@email.com",
          isAdmin: true,
        });
    expect(res.statusCode).toEqual(401);
  });

  test("bad request if missing data", async function () {
    const res = await request(app)
        .post("/users")
        .send({
          username: "u-new",
        })
        .set("authorization", `Bearer ${adminToken}`);
    expect(res.statusCode).toEqual(400);
  });

  test("bad request if invalid data", async function () {
    const res = await request(app)
        .post("/users")
        .send({
          username: "u-new",
          password: "password-new",
          email: {},
          isAdmin: true,
        })
        .set("authorization", `Bearer ${adminToken}`);
    expect(res.statusCode).toEqual(400);
  });
});

/************************************** GET /users */

describe("GET /users", function () {
  test("works for admins", async function () {
    const res = await request(app)
        .get("/users")
        .set("authorization", `Bearer ${adminToken}`);
    expect(res.body).toEqual({
      users: [
        {
          username: "testadmin",
          email: "test@test.com",
          isAdmin: true,
        },
        {
          username: "testuser",
          email: "test2@test.com",
          isAdmin: false,
        }
      ],
    });
  });

  test("unauth for non-admin users", async function () {
    const res = await request(app)
        .get("/users")
        .set("authorization", `Bearer ${u1Token}`);
    expect(res.statusCode).toEqual(401);
  });

  test("unauth for anon", async function () {
    const res = await request(app)
        .get("/users");
    expect(res.statusCode).toEqual(401);
  });

  test("fails: test next() handler", async function () {
    // there's no normal failure event which will cause this route to fail ---
    // thus making it hard to test that the error-handler works with it. This
    // should cause an error, all right :)
    await db.query("DROP TABLE users CASCADE");
    const res = await request(app)
        .get("/users")
        .set("authorization", `Bearer ${adminToken}`);
    expect(res.statusCode).toEqual(500);
  });
});

/************************************** GET /users/:username */

describe("GET /users/:username", function () {
  test("works for admin", async function () {
    const res = await request(app)
        .get(`/users/testuser`)
        .set("authorization", `Bearer ${adminToken}`);
    expect(res.body).toEqual({
      user: {
        username: "testuser",
        email: "test2@test.com",
        isAdmin: false,
        songs: [{
            id: testSongIds[1],
            title: "Test Song 2"
        }],
      },
    });
  });

  test("works for same user", async function () {
    const res = await request(app)
        .get(`/users/testuser`)
        .set("authorization", `Bearer ${u1Token}`);
    expect(res.body).toEqual({
      user: {
        username: "testuser",
        email: "test2@test.com",
        isAdmin: false,
        songs: [{
            id: testSongIds[1],
            title: "Test Song 2"
        }],
      },
    });
  });

  test("unauth for other users", async function () {
    const res = await request(app)
        .get(`/users/testadmin`)
        .set("authorization", `Bearer ${u1Token}`);
    expect(res.statusCode).toEqual(401);
  });

  test("unauth for anon", async function () {
    const res = await request(app)
        .get(`/users/testuser`);
    expect(res.statusCode).toEqual(401);
  });

  test("not found if user not found", async function () {
    const res = await request(app)
        .get(`/users/nope`)
        .set("authorization", `Bearer ${adminToken}`);
    expect(res.statusCode).toEqual(404);
  });
});

/************************************** PATCH /users/:username */

describe("PATCH /users/:username", () => {
  test("works for admins", async function () {
    const res = await request(app)
        .patch(`/users/testuser`)
        .send({
          email: "new@email.com",
        })
        .set("authorization", `Bearer ${adminToken}`);
    expect(res.body).toEqual({
      user: {
        username: "testuser",
        email: "new@email.com",
        isAdmin: false,
      },
    });
  });

  test("works for same user", async function () {
    const res = await request(app)
        .patch(`/users/testuser`)
        .send({
          email: "new@email.com",
        })
        .set("authorization", `Bearer ${u1Token}`);
    expect(res.body).toEqual({
      user: {
        username: "testuser",
        email: "new@email.com",
        isAdmin: false,
      },
    });
  });

  test("unauth if not same user", async function () {
    const res = await request(app)
        .patch(`/users/testadmin`)
        .send({
          email: "new@email.com",
        })
        .set("authorization", `Bearer ${u1Token}`);
    expect(res.statusCode).toEqual(401);
  });

  test("unauth for anon", async function () {
    const res = await request(app)
        .patch(`/users/testuser`)
        .send({
          email: "new@email.com",
        });
    expect(res.statusCode).toEqual(401);
  });

  test("not found if no such user", async function () {
    const res = await request(app)
        .patch(`/users/nope`)
        .send({
          email: "new@email.com",
        })
        .set("authorization", `Bearer ${adminToken}`);
    expect(res.statusCode).toEqual(404);
  });

  test("bad request if invalid data", async function () {
    const res = await request(app)
        .patch(`/users/testuser`)
        .send({
          email: 42,
        })
        .set("authorization", `Bearer ${adminToken}`);
    expect(res.statusCode).toEqual(400);
  });

  test("works: can set new password", async function () {
    const res = await request(app)
        .patch(`/users/testuser`)
        .send({
          password: "new-password",
        })
        .set("authorization", `Bearer ${adminToken}`);
    expect(res.body).toEqual({
      user: {
        username: "testuser",
        email: "test2@test.com",
        isAdmin: false,
      },
    });
    const isSuccessful = await User.authenticate("testuser", "new-password");
    expect(isSuccessful).toBeTruthy();
  });
});

/************************************** DELETE /users/:username */

describe("DELETE /users/:username", function () {
  test("works for admin", async function () {
    const res = await request(app)
        .delete(`/users/testuser`)
        .set("authorization", `Bearer ${adminToken}`);
    expect(res.body).toEqual({ deleted: "testuser" });
  });

  test("works for same user", async function () {
    const res = await request(app)
        .delete(`/users/testuser`)
        .set("authorization", `Bearer ${u1Token}`);
    expect(res.body).toEqual({ deleted: "testuser" });
  });

  test("unauth if not same user", async function () {
    const res = await request(app)
        .delete(`/users/testadmin`)
        .set("authorization", `Bearer ${u1Token}`);
    expect(res.statusCode).toEqual(401);
  });

  test("unauth for anon", async function () {
    const res = await request(app)
        .delete(`/users/testuser`);
    expect(res.statusCode).toEqual(401);
  });

  test("not found if user missing", async function () {
    const res = await request(app)
        .delete(`/users/nope`)
        .set("authorization", `Bearer ${adminToken}`);
    expect(res.statusCode).toEqual(404);
  });
});